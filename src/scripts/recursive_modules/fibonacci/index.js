function scopeFibonacciGenerator(makeNode, addChild, addReturnValue) {
	return function* fibonacciGenerator(argValue, parentNode = null) {
		const node = makeNode([argValue])
		addChild(parentNode, node)
		yield

		let returnValue
		if (argValue === 1 || argValue === 2) {
			returnValue = 1
		} else {
			const fibOfArgValueMinusOne = yield* fibonacciGenerator(
				argValue - 1,
				node
			)
			const fibOfArgValueMinusTwo = yield* fibonacciGenerator(
				argValue - 2,
				node
			)

			returnValue = fibOfArgValueMinusOne + fibOfArgValueMinusTwo
		}

		addReturnValue(node, returnValue)
		yield returnValue
		return returnValue
	}
}

export default scopeFibonacciGenerator

export function createFibonacciGenerator(makeNode) {
	return function* fibonacciGenerator(parentNode, argValue) {
		const node = makeNode({ argValue })
		const { nodeID } = node
		yield {
			[parentNode.nodeID]: [
				{ isAddToParent: true, parentNode, childNode: node },
			],
			[nodeID]: [{ isSetLastAction: true }],
		}

		let returnValue
		if (argValue === 1 || argValue === 2) {
			returnValue = 1
		} else {
			const fibOfArgValueMinusOne = yield* fibonacciGenerator(
				node,
				argValue - 1
			)
			const fibOfArgValueMinusTwo = yield* fibonacciGenerator(
				node,
				argValue - 2
			)

			returnValue = fibOfArgValueMinusOne + fibOfArgValueMinusTwo
		}

		yield {
			[nodeID]: [
				{ isAddReturnValue: true, returnValue },
				{ isSetLastAction: true },
			],
		}
		return returnValue
	}
}
