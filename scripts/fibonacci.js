'use strict';

function fibonacciBlockMaker(n, isFirstCall = false) {
    let fibonacciBlock = document.createElement('div');
    fibonacciBlock.classList.add('fibonacci-block__child');

    if (isFirstCall) {
        fibonacciBlock.innerHTML = `<dl class="fibonacci-block">
                                        <dt class="fibonacci-block__call-type fibonacci-block__top-row">Initial Call</dt>
                                        <dd class="fibonacci-block__function-name fibonacci-block__bottom-row">fibonacci(${n})</dd>
                                        <dt class="fibonacci-block__return-header fibonacci-block__top-row">return</dt>
                                        <dd class="fibonacci-block__return-value fibonacci-block__bottom-row">waiting</dd>
                                    </dl>`;
    } else if (n == 1 || n == 2) {
        fibonacciBlock.innerHTML = `<dl class="fibonacci-block">
                                        <dt class="fibonacci-block__call-type fibonacci-block__top-row">Base Case</dt>
                                        <dd class="fibonacci-block__function-name fibonacci-block__bottom-row">fibonacci(${n})</dd>
                                        <dt class="fibonacci-block__return-header fibonacci-block__top-row">return</dt>
                                        <dd class="fibonacci-block__return-value fibonacci-block__return-value--returned fibonacci-block__bottom-row">1</dd>
                                    </dl>`;
    } else {
        fibonacciBlock.innerHTML = `<dl class="fibonacci-block">
                                        <dt class="fibonacci-block__call-type fibonacci-block__top-row">Recursive Call</dt>
                                        <dd class="fibonacci-block__function-name fibonacci-block__bottom-row">fibonacci(${n})</dd>
                                        <dt class="fibonacci-block__return-header fibonacci-block__top-row">return</dt>
                                        <dd class="fibonacci-block__return-value fibonacci-block__bottom-row">waiting</dd>
                                    </dl>`;
    }

    return fibonacciBlock;
}

const fibonacciDemoContainer = document.querySelector('.fibonacci-demo');
const fibonacciWrapper = document.querySelector('.fibonacci-wrapper');
fibonacciWrapper.scroll(4400, 0);

function fibonacci(n, parentDOMRef) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let fibonacciBlock = fibonacciBlockMaker(n);
            let functionValueText = fibonacciBlock.querySelector('.fibonacci-block__return-value');
            parentDOMRef.append(fibonacciBlock);
            resolve([fibonacciBlock, functionValueText]);
        }, 500);
    }).then(([fibonacciBlock, functionValueText]) => {
        if (n == 1 || n == 2) {
            return Promise.resolve(1);
        } else {
            return new Promise((resolve) => {
                let value = Promise.all([fibonacci(n - 1, fibonacciBlock), fibonacci(n - 2, fibonacciBlock)]).then(([val1, val2]) => val1 + val2);
                console.log(value);
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


