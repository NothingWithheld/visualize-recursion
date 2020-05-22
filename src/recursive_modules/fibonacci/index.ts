import {
	MakeNodeFunc,
	getAddChildStepEvent,
	getLastActionStepEvent,
	getAddReturnValueStepEvent,
	getAddVariableDetailsStepEvent,
	FunctionProgressStepDetails,
} from '../../nodes/useNodes/utils'
import { SentryNode, FuncNode } from '../../nodes/types'

export function scopeFibonacciGenerator(makeNode: MakeNodeFunc) {
	return function* fibonacciGenerator(
		parentNode: SentryNode | FuncNode,
		fibNumber: number
	): Iterable<FunctionProgressStepDetails[]> {
		const node = makeNode([['fibNumber', fibNumber]])
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
			getAddReturnValueStepEvent(node, returnValue),
			getLastActionStepEvent(node),
		]

		return returnValue
	}
}

export default scopeFibonacciGenerator
