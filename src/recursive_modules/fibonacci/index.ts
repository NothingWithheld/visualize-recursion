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
		argValue: number
	): Iterable<FunctionProgressStepDetails[]> {
		const node = makeNode([argValue])
		yield [getAddChildStepEvent(parentNode, node), getLastActionStepEvent(node)]

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

		yield [
			getAddReturnValueStepEvent(node, returnValue),
			getLastActionStepEvent(node),
		]

		return returnValue
	}
}

export default scopeFibonacciGenerator
