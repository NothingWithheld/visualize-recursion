import {
	MakeNodeFunc,
	getAddChildStepEvent,
	getLastActionStepEvent,
	getAddReturnValueStepEvent,
	getAddVariableDetailsStepEvent,
	FunctionProgressStepDetails,
} from '../../nodes/useNodes/utils'
import { SentryNode, FuncNode } from '../../nodes/types'

function scopeFibonacciGenerator(makeNode: MakeNodeFunc) {
	return function* fibonacciGenerator(
		parentNode: SentryNode | FuncNode,
		fibNumber: number
	): Generator<FunctionProgressStepDetails[]> {
		const node = makeNode([['fibNumber', fibNumber.toString()]])
		yield [getAddChildStepEvent(parentNode, node), getLastActionStepEvent(node)]

		let returnValue
		if (fibNumber === 1 || fibNumber === 2) {
			returnValue = 1
		} else {
			const fibOfArgValueMinusOne = yield* fibonacciGenerator(
				node,
				fibNumber - 1
			)
			const fibOfArgValueMinusTwo = yield* fibonacciGenerator(
				node,
				fibNumber - 2
			)

			returnValue = fibOfArgValueMinusOne + fibOfArgValueMinusTwo
		}

		yield [
			getAddReturnValueStepEvent(node, returnValue.toString()),
			getLastActionStepEvent(node),
		]

		return returnValue
	}
}

export default scopeFibonacciGenerator
