function factorialBlockMaker(n) {
    return `<div class="factorial-block">
                <p class="factorial-block__text">${n} * fact(${n} - 1)</p>
                <div class="factorial-block__value-container">
                    <p class="factorial-block__text"></p>
                </div>
            </div>`
}

const factorialDemoContainer = document.querySelector('.factorial-demo');

function factorial(n) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let factorialBlock = factorialBlockMaker(n);
            factorialDemoContainer.insertAdjacentHTML('afterbegin', factorialBlock);
            let functionValueText = Array.from(document.querySelector('.factorial-block').querySelectorAll('.factorial-block__text'))[1];
            resolve(functionValueText);
        }, 500);
    }).then((functionValueText) => {
        if (n <= 1) {
            return Promise.resolve(1).then((value) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        functionValueText.insertAdjacentHTML('afterbegin', value.toString());
                        resolve(value);
                    }, 500);
                });
            });
        } else {
            return new Promise((resolve) => {
                let value = factorial(n - 1).then((val) => val * n);
                resolve(value);
            }).then((value) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        functionValueText.insertAdjacentHTML('afterbegin', value.toString());
                        resolve(value);
                    }, 500);
                });
            });
        }
    })
}

factorial(5);

