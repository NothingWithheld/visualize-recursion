'use strict';

class FibonacciGeneratorMaker {
    constructor() {
        this.returnValue;
    }

    *fibonacci(number, parentDOMRef) {
        const fibonacciBlock = this.makeFibonnaciBlock(number);
        this.placeFibonacciBlockOnPage(fibonacciBlock, parentDOMRef);
    
        if (number > 2) {
            yield;
        }
        
        let value = 0;
        if (number == 1 || number == 2) {
            value = 1;
        } else {
            yield *this.generateFibonacci(number - 1, fibonacciBlock);
            value += this.returnValue;
            yield *this.generateFibonacci(number - 2, fibonacciBlock);
            value += this.returnValue;
        }
        
        this.showFunctionHasResolved(value, fibonacciBlock);
        yield value;    
    }

    *generateFibonacci(number, parentDOMRef) {
        let generator = this.fibonacci(number, parentDOMRef);
        let next = generator.next();
        let returnValue;

        while (!next.done) {
            returnValue = next.value;
            yield;
            next = generator.next();
        }

        this.returnValue = returnValue;
    }

    makeFibonnaciBlock(number) {
        let fibonacciBlock = document.createElement('div');
        fibonacciBlock.classList.add('fibonacci-block__child');

        fibonacciBlock.innerHTML = `<div class="fibonacci-block">
                                        <p class="fibonacci-block__function-name fibonacci-block__top-row">fib(${number})</p>
                                        <p class="fibonacci-block__return-value fibonacci-block__bottom-row">waiting</p>
                                    </div>`

        return fibonacciBlock;
    }

    showFunctionHasResolved(returnValue, fibonacciBlock) {
        const functionValueText = fibonacciBlock.querySelector('.fibonacci-block__return-value');
        const functionNameBlock = fibonacciBlock.querySelector('.fibonacci-block__function-name');

        functionValueText.innerHTML = returnValue.toString();
        functionValueText.classList.add('fibonacci-block__return-value--returned');
        functionNameBlock.classList.add('fibonacci-block__function-name--resolved');
    }

    placeFibonacciBlockOnPage(fibonacciBlock, DOMLocation) {
        DOMLocation.appendChild(fibonacciBlock);
    }
}

function fibonacciBlockMaker(n) {
    let fibonacciBlock = document.createElement('div');
    fibonacciBlock.classList.add('fibonacci-block__child');

    if (n == 1 || n == 2) {
        fibonacciBlock.innerHTML = `<div class="fibonacci-block">
                                        <p class="fibonacci-block__function-name fibonacci-block__function-name--resolved fibonacci-block__top-row">fib(${n})</p>
                                        <p class="fibonacci-block__return-value fibonacci-block__return-value--returned fibonacci-block__bottom-row">1</p>
                                    </div>`
    } else {
        fibonacciBlock.innerHTML = `<div class="fibonacci-block">
                                        <p class="fibonacci-block__function-name fibonacci-block__top-row">fib(${n})</p>
                                        <p class="fibonacci-block__return-value fibonacci-block__bottom-row">waiting</p>
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
            let functionValueText = fibonacciBlock.querySelector('.fibonacci-block__return-value');
            let functionNameBlock = fibonacciBlock.querySelector('.fibonacci-block__function-name');
            parentDOMRef.append(fibonacciBlock);
            resolve([fibonacciBlock, functionValueText, functionNameBlock]);
        }, 500);
    }).then(([fibonacciBlock, functionValueText, functionNameBlock]) => {
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
                        functionNameBlock.classList.add('fibonacci-block__function-name--resolved');
                        resolve(value);
                    }, 500);
                })
            })
        }
    })
}

// fibonacci(7, fibonacciDemoContainer)

function* fib(number, parentDOMRef) {
    const fibonacciBlock = fibonacciBlockMaker(number);
    const functionValueText = fibonacciBlock.querySelector('.fibonacci-block__return-value');
    const functionNameBlock = fibonacciBlock.querySelector('.fibonacci-block__function-name');
    parentDOMRef.appendChild(fibonacciBlock);

    if (number > 2) {
        yield;
    }
    

    let value = 0;
    if (number == 1 || number == 2) {
        value = 1;
    } else {
        let generator1 = fib(number - 1, fibonacciBlock);
        let next1 = generator1.next();
        let yieldedValue1;
        while (!next1.done) {
            yieldedValue1 = next1.value;
            yield;
            next1 = generator1.next();
        }
        value += yieldedValue1;

        let generator2 = fib(number - 2, fibonacciBlock);
        let next2 = generator2.next();
        let yieldedValue2;
        while (!next2.done) {
            yieldedValue2 = next2.value;
            yield;
            next2 = generator2.next();
        }
        value += yieldedValue2;
    }
    

    functionValueText.innerHTML = value.toString();
    functionValueText.classList.add('fibonacci-block__return-value--returned');
    functionNameBlock.classList.add('fibonacci-block__function-name--resolved');
    
    yield value;    
}

function trial(generator, generatedObj) {
    let codeStepper = setTimeout(function step(generator, generatedObj) {
        if (generatedObj && generatedObj.done) {
            return;
        } else {
            generatedObj = generator.next();
            codeStepper = setTimeout(step, 300, generator, generatedObj);
        }
    }, 300, generator, generatedObj);
}

// trial(fib(10, fibonacciDemoContainer), null);

const fibGeneratorMaker = new FibonacciGeneratorMaker();
trial(fibGeneratorMaker.fibonacci(7, fibonacciDemoContainer), null);