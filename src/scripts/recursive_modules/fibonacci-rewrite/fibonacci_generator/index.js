function makeNode(args, nodeID) {
	return {
		nodeID,
		args,
		funcName: 'fibonacci',
		returnValue: null,
		children: [],
	}
}

function scopeFibonacciGenerator(addChild, addReturnValue) {
	let counter = 0

	return function* fibonacciGenerator(argValue, parentNode = null) {
		const node = makeNode([argValue], counter)
		counter += 1
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
