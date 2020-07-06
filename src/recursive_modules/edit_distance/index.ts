import {
	MakeNodeFunc,
	getAddChildStepEvent,
	getLastActionStepEvent,
	getAddReturnValueStepEvent,
	getAddVariableDetailsStepEvent,
	FunctionProgressStepDetails,
} from '../../nodes/useNodes/utils'
import { SentryNode, FuncNode } from '../../nodes/types'

function scopeEditDistSliceGenerator(makeNode: MakeNodeFunc) {
	return function* editDist(
		parentNode: SentryNode | FuncNode,
		toChange: string,
		toMatch: string
	): Generator<FunctionProgressStepDetails[]> {
		const node = makeNode([
			['to_change', `"${toChange}"`],
			['to_match', `"${toMatch}"`],
		])
		yield [getAddChildStepEvent(parentNode, node), getLastActionStepEvent(node)]

		let returnValue: number
		if (toChange.length == 0) {
			returnValue = toMatch.length
		} else if (toMatch.length == 0) {
			returnValue = toChange.length
		} else {
			const fromDelete = yield* editDist(node, toChange.substring(1), toMatch)
			const fromInsert = yield* editDist(node, toChange, toMatch.substring(1))
			const fromReplace = yield* editDist(
				node,
				toChange.substring(1),
				toMatch.substring(1)
			)

			returnValue = Math.min(
				fromDelete + 1,
				fromInsert + 1,
				fromReplace + (toChange[0] === toMatch[0] ? 0 : 1)
			)
		}

		yield [
			getAddReturnValueStepEvent(node, returnValue.toString()),
			getLastActionStepEvent(node),
		]
		return returnValue
	}
}

export default scopeEditDistSliceGenerator
