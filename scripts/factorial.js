function factorialBlockMaker(n, isFirstCall = false) {
    let factorialBlock = document.createElement('dl');
    factorialBlock.classList.add('factorial-block--new');

    if (isFirstCall) {
        factorialBlock.classList.add('factorial-block__initial-call');
        factorialBlock.innerHTML = `<dt class="factorial-block__call-type factorial-block__top-row">Initial Call</dt>
                                    <dd class="factorial-block__function-name factorial-block__bottom-row">factorial(${n})</dd>
                                    <dt class="factorial-block__equivalent factorial-block__top-row">equivalent to</dt>
                                    <dd class="factorial-block__equivalent-value factorial-block__bottom-row">${n} * factorial(${n - 1})</dd>
                                    <dt class="factorial-block__return-header factorial-block__top-row">return value</dt>
                                    <dd class="factorial-block__return-value factorial-block__bottom-row">waiting</dd>`;
    } else if (n == 1) {
        factorialBlock.innerHTML = `<dt class="factorial-block__call-type factorial-block__top-row">Base Case</dt>
                                    <dd class="factorial-block__function-name factorial-block__bottom-row">factorial(1)</dd>
                                    <dt class="factorial-block__equivalent factorial-block__top-row">equivalent to</dt>
                                    <dd class="factorial-block__equivalent-value factorial-block__bottom-row">1</dd>
                                    <dt class="factorial-block__return-header factorial-block__top-row">return value</dt>
                                    <dd class="factorial-block__return-value factorial-block__return-value--returned factorial-block__bottom-row">1</dd>`;
    } else {
        factorialBlock.innerHTML = `<dt class="factorial-block__call-type factorial-block__top-row">Recursive Call</dt>
                                    <dd class="factorial-block__function-name factorial-block__bottom-row">factorial(${n})</dd>
                                    <dt class="factorial-block__equivalent factorial-block__top-row">equivalent to</dt>
                                    <dd class="factorial-block__equivalent-value factorial-block__bottom-row">${n} * factorial(${n - 1})</dd>
                                    <dt class="factorial-block__return-header factorial-block__top-row">return value</dt>
                                    <dd class="factorial-block__return-value factorial-block__bottom-row">waiting</dd>`;
    }

    return factorialBlock;
}

const factorialDemoContainer = document.querySelector('.factorial-demo');

function factorial(n) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let factorialBlock;
            if (!factorialDemoContainer.hasChildNodes()) factorialBlock = factorialBlockMaker(n, true); 
            else factorialBlock = factorialBlockMaker(n, false);
            factorialDemoContainer.appendChild(factorialBlock);
            let functionValueText = factorialBlock.querySelector('.factorial-block__return-value');
            resolve(functionValueText);
        }, 500);
    }).then((functionValueText) => {
        if (n <= 1) {
            return Promise.resolve(1);
        } else {
            return new Promise((resolve) => {
                let value = factorial(n - 1).then((val) => val * n);
                resolve(value);
            }).then((value) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        functionValueText.innerHTML = value.toString();
                        functionValueText.classList.add('factorial-block__return-value--returned');
                        resolve(value);
                    }, 500);
                });
            });
        }
    })
}

factorial(5);

