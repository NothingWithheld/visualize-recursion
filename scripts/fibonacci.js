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
    let fibonacciBlock = fibonacciBlockMaker(n);
    let functionValueText = fibonacciBlock.querySelector('.fibonacci-block__return-value');
    parentDOMRef.append(fibonacciBlock);
    if (n == 1 || n == 2) {
        return 1;
    } else {
        let value = fibonacci(n - 1, fibonacciBlock) + fibonacci(n - 2, fibonacciBlock);
        functionValueText.innerHTML = value.toString();
        functionValueText.classList.add('fibonacci-block__return-value--returned');
        return value;
    }
}


fibonacci(6, fibonacciDemoContainer)