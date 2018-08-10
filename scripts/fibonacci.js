'use strict';

function fibonacciBlockMaker1(n, isFirstCall = false) {
    let fibonacciBlock = document.createElement('div');
    fibonacciBlock.classList.add('fibonacci-block__child');

    if (isFirstCall) {
        fibonacciBlock.innerHTML = `<dl class="fibonacci-block">
                                        <dt class="fibonacci-block__call-type fibonacci-block__top-row">Initial Call</dt>
                                        <dd class="fibonacci-block__function-name fibonacci-block__bottom-row">fib(${n})</dd>
                                        <dt class="fibonacci-block__return-header fibonacci-block__top-row">return</dt>
                                        <dd class="fibonacci-block__return-value fibonacci-block__bottom-row">waiting</dd>
                                    </dl>`;
    } else if (n == 1 || n == 2) {
        fibonacciBlock.innerHTML = `<dl class="fibonacci-block">
                                        <dt class="fibonacci-block__call-type fibonacci-block__top-row">Base Case</dt>
                                        <dd class="fibonacci-block__function-name fibonacci-block__bottom-row">fib(${n})</dd>
                                        <dt class="fibonacci-block__return-header fibonacci-block__top-row">return</dt>
                                        <dd class="fibonacci-block__return-value fibonacci-block__return-value--returned fibonacci-block__bottom-row">1</dd>
                                    </dl>`;
    } else {
        fibonacciBlock.innerHTML = `<dl class="fibonacci-block">
                                        <dt class="fibonacci-block__call-type fibonacci-block__top-row">Recursive Call</dt>
                                        <dd class="fibonacci-block__function-name fibonacci-block__bottom-row">fib(${n})</dd>
                                        <dt class="fibonacci-block__return-header fibonacci-block__top-row">return</dt>
                                        <dd class="fibonacci-block__return-value fibonacci-block__bottom-row">waiting</dd>
                                    </dl>`;
    }

    return fibonacciBlock;
}

function fibonacciBlockMaker(n) {
    let fibonacciBlock = document.createElement('div');
    fibonacciBlock.classList.add('fibonacci-block__child');

    if (n == 1 || n == 2) {
        fibonacciBlock.innerHTML = `<div class="fibonacci-block--new">
                                        <p class="fibonacci-block__function-name--new fibonacci-block__top-row">fib(${n})</p>
                                        <p class="fibonacci-block__return-value--new fibonacci-block__return-value--returned fibonacci-block__bottom-row">1</p>
                                    </div>`
    } else {
        fibonacciBlock.innerHTML = `<div class="fibonacci-block--new">
                                        <p class="fibonacci-block__function-name--new fibonacci-block__top-row">fib(${n})</p>
                                        <p class="fibonacci-block__return-value--new fibonacci-block__bottom-row">waiting</p>
                                    </div>`
    }

    return fibonacciBlock;
}

const fibonacciDemoContainer = document.querySelector('.fibonacci-demo');
const fibonacciWrapper = document.querySelector('.fibonacci-wrapper');
fibonacciWrapper.scroll(4400, 0);

function fibonacci(n, parentDOMRef) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let fibonacciBlock;
            if (!fibonacciDemoContainer.hasChildNodes()) fibonacciBlock = fibonacciBlockMaker(n, true);
            else fibonacciBlock = fibonacciBlockMaker(n, false);
            let functionValueText = fibonacciBlock.querySelector('.fibonacci-block__return-value--new');
            parentDOMRef.append(fibonacciBlock);
            resolve([fibonacciBlock, functionValueText]);
        }, 500);
    }).then(([fibonacciBlock, functionValueText]) => {
        if (n == 1 || n == 2) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(1);
                }, 500);
            });
        } else {
            return new Promise((resolve) => {
                let value = fibonacci(n - 1, fibonacciBlock).then((val1) => {
                    return fibonacci(n - 2, fibonacciBlock).then((val2) => [val1, val2]);
                }).then(([val1, val2]) => val1 + val2);
                resolve(value);
            }).then((value) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        functionValueText.innerHTML = value.toString();
                        functionValueText.classList.add('fibonacci-block__return-value--returned');
                        resolve(value);
                    }, 500);
                })
            })
        }
    })
}

fibonacci(6, fibonacciDemoContainer)