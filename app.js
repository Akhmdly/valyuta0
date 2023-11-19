document.addEventListener("DOMContentLoaded", function () {
    let myInputs = document.querySelectorAll(".myInput");
    let fromLi = document.querySelectorAll(".li1");
    let toLi = document.querySelectorAll(".li2");
    let ul1Lis = document.querySelectorAll('.ul1 button');
    let ul2Lis = document.querySelectorAll('.ul2 button');
    let fromCurrency = "RUB";
    let toCurrency = "USD";

    myInputs.forEach(input => {
        input.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9.]/g, '');
            if (this.value.split('.').length > 2) {
                this.value = this.value.slice(0, this.value.lastIndexOf('.'));
            }
        });
    });

    function changeCurrency(from, to, amount, input) {
        fetch(`https://v6.exchangerate-api.com/v6/e6e1c3f4d892558fd8d393b7/latest/${from}`)
            .then(response => response.json())
            .then(data => {
                let exchangeRate = data.conversion_rates[to];
                let enteredAmount = parseFloat(amount);

                if (!isNaN(enteredAmount)) {
                    let convertedAmount = (enteredAmount * exchangeRate).toFixed(4);
                    input.value = convertedAmount;

                    document.getElementById('input1pId').innerText = `1 ${from} = ${exchangeRate.toFixed(4)} ${to}`;
                    document.getElementById('input2pId').innerText = `1 ${to} = ${(1 / exchangeRate).toFixed(4)} ${from}`;
                } else {
                    //input.value = "";
                }
            })
            .catch(error => {
                console.log("Valyuta məzənnələrini əldə edərkən xəta baş verdi:", error);
            });
    }

    function updateCurrency(event) {
        if (event.target.classList.contains("li1")) {
            fromCurrency = event.target.innerText;
            buttonClick(event.target, 'ul1');
        } else if (event.target.classList.contains("li2")) {
            toCurrency = event.target.innerText;
            buttonClick(event.target, 'ul2');
        }
        changeCurrency(fromCurrency, toCurrency, myInputs[0].value, myInputs[1]);
    }

    fromLi.forEach(button => {
        button.addEventListener("click", updateCurrency);
    });

    toLi.forEach(button => {
        button.addEventListener("click", updateCurrency);
    });

    myInputs.forEach((input, index) => {
        input.addEventListener("input", () => {
            if (index === 0) {
                changeCurrency(fromCurrency, toCurrency, input.value, myInputs[1]);
            } else {
                changeCurrency(toCurrency, fromCurrency, input.value, myInputs[0]);
            }
        });
    });

    function buttonClick(item, ulClass) {
        const activeButtons = document.querySelectorAll(`.${ulClass} .active`);

        if (!item.classList.contains('active')) {
            if (activeButtons.length > 0) {
                activeButtons[0].classList.remove('active');
            }
            item.classList.add('active');
            item.style.display = 'inline-block';
        }

        document.querySelectorAll(`.${ulClass} button`).forEach(button => {
            if (button !== item && !button.classList.contains('active')) {
                button.style.display = 'inline-block';
            }
        });

        if (ulClass === 'ul1') {
            fromCurrency = item.innerText;
        } else if (ulClass === 'ul2') {
            toCurrency = item.innerText;
        }
    }

    ul1Lis.forEach(li => {
        li.addEventListener('click', function () {
            buttonClick(li, 'ul1');
            updateCurrency({ target: li });
        });
    });

    ul2Lis.forEach(li2 => {
        li2.addEventListener('click', function () {
            buttonClick(li2, 'ul2');
            updateCurrency({ target: li2 });
        });
    });
    function activeButtons() {
        const rub1Button = document.querySelector('.rub1');
        const usd2Button = document.querySelector('.usd2');
        rub1Button.classList.add('active');
        usd2Button.classList.add('active');
        changeCurrency(fromCurrency, toCurrency,1, [myInputs[0], myInputs[1]]);
    }
    activeButtons();
});