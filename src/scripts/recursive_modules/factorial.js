import React from 'react'
import ReactDOM from 'react-dom'
import RecursionVisualizer from '../code_player/RecursionVisualizer'
import TreeNode from '../node_tree/TreeNode'
import NodeTree from '../node_tree/NodeTree'
import fibonacciGenerator from '../recursive_modules/fibonacci/fibonacci-generator'
import CodePlayer from '../CodePlayer'
import scopeFibonacciGenerator from './fibonacci-rewrite/fibonacci_generator'

ReactDOM.render(
	<>
		<RecursionVisualizer
			defaultArgs={[7]}
			generatorFunction={fibonacciGenerator}
			outputContainer={NodeTree}
			containerClassNames="fibonacci-demo"
		/>
		<CodePlayer
			scopeGeneratorFunc={scopeFibonacciGenerator}
			functionInputObjs={[
				{
					value: 7,
					label: 'Fibonacci Number of',
					type: 'number',
					toValue: val => val.toString(),
					fromValue: val => parseInt(val, 10),
				},
			]}
		/>
	</>,
	document.getElementById('test')
)

// let nodeTreeRef;
// let nodeTree = <NodeTree ref={thisComponent => nodeTreeRef = thisComponent} containerClassNames={'fibonacci-demo'} />;
// ReactDOM.render(nodeTree, document.querySelector('.fibonacci-wrapper'));

// let fibGen = fibonacciGenerator(7, nodeTreeRef);
// let iteratorRes = fibGen.next();

// while (!iteratorRes.done) {
//     iteratorRes = fibGen.next();
// }

// let treeNodeRef;
// let treeNode = <TreeNode ref={(thisComponent) => {treeNodeRef = thisComponent}} />;
// ReactDOM.render(treeNode, document.getElementById('recursion-test'));
// console.log({treeNodeRef});
// console.log(treeNodeRef.addChildComponent);
// console.log(treeNodeRef.addProps);

// function* fibonacci(n) {
//     if (n <= 2) {
//         yield 1
//         return 1;
//     } else {
//         const fibNMinusOne = yield* fibonacci(n - 1);
//         const fibNMinusTwo = yield* fibonacci(n - 2);

//         yield fibNMinusOne + fibNMinusTwo;
//         return fibNMinusOne + fibNMinusTwo;
//     }
// }

// let fibGen = fibonacci(7);
// let iteratorReturn = fibGen.next();
// console.log(iteratorReturn);

// while (!iteratorReturn.done) {
//     console.log(iteratorReturn);
//     iteratorReturn = fibGen.next();
// }

function factorialBlockMaker(n, isFirstCall = false) {
	let factorialBlock = document.createElement('dl')
	factorialBlock.classList.add('factorial-block--new')

	if (isFirstCall) {
		factorialBlock.classList.add('factorial-block__initial-call')
		factorialBlock.innerHTML = `<dt class="factorial-block__call-type factorial-block__top-row">Initial Call</dt>
                                    <dd class="factorial-block__function-name factorial-block__bottom-row">factorial(${n})</dd>
                                    <dt class="factorial-block__equivalent factorial-block__top-row">equivalent to</dt>
                                    <dd class="factorial-block__equivalent-value factorial-block__bottom-row">${n} * factorial(${n -
			1})</dd>
                                    <dt class="factorial-block__return-header factorial-block__top-row">return value</dt>
                                    <dd class="factorial-block__return-value factorial-block__bottom-row">waiting</dd>`
	} else if (n == 1) {
		factorialBlock.innerHTML = `<dt class="factorial-block__call-type factorial-block__top-row">Base Case</dt>
                                    <dd class="factorial-block__function-name factorial-block__bottom-row">factorial(1)</dd>
                                    <dt class="factorial-block__equivalent factorial-block__top-row">equivalent to</dt>
                                    <dd class="factorial-block__equivalent-value factorial-block__bottom-row">1</dd>
                                    <dt class="factorial-block__return-header factorial-block__top-row">return value</dt>
                                    <dd class="factorial-block__return-value factorial-block__return-value--returned factorial-block__bottom-row">1</dd>`
	} else {
		factorialBlock.innerHTML = `<dt class="factorial-block__call-type factorial-block__top-row">Recursive Call</dt>
                                    <dd class="factorial-block__function-name factorial-block__bottom-row">factorial(${n})</dd>
                                    <dt class="factorial-block__equivalent factorial-block__top-row">equivalent to</dt>
                                    <dd class="factorial-block__equivalent-value factorial-block__bottom-row">${n} * factorial(${n -
			1})</dd>
                                    <dt class="factorial-block__return-header factorial-block__top-row">return value</dt>
                                    <dd class="factorial-block__return-value factorial-block__bottom-row">waiting</dd>`
	}

	return factorialBlock
}

const factorialDemoContainer = document.querySelector('.factorial-demo')

function factorial(n) {
	return new Promise(resolve => {
		setTimeout(() => {
			let factorialBlock
			if (!factorialDemoContainer.hasChildNodes())
				factorialBlock = factorialBlockMaker(n, true)
			else factorialBlock = factorialBlockMaker(n, false)
			factorialDemoContainer.appendChild(factorialBlock)
			let functionValueText = factorialBlock.querySelector(
				'.factorial-block__return-value'
			)
			resolve(functionValueText)
		}, 500)
	}).then(functionValueText => {
		if (n <= 1) {
			return Promise.resolve(1)
		} else {
			return new Promise(resolve => {
				let value = factorial(n - 1).then(val => val * n)
				resolve(value)
			}).then(value => {
				return new Promise(resolve => {
					setTimeout(() => {
						functionValueText.innerHTML = value.toString()
						functionValueText.classList.add(
							'factorial-block__return-value--returned'
						)
						resolve(value)
					}, 500)
				})
			})
		}
	})
}

factorialDemoContainer ? factorial(5) : null
