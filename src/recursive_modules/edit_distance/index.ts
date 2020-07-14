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
			['to_change', `'${toChange}'`],
			['to_match', `'${toMatch}'`],
		])
		yield [getAddChildStepEvent(parentNode, node), getLastActionStepEvent(node)]

		let returnValue: number
		const returnVariableDetails: [string, string][] = []
		if (toChange.length == 0) {
			returnValue = toMatch.length
		} else if (toMatch.length == 0) {
			returnValue = toChange.length
		} else {
			const fromDelete = yield* editDist(node, toChange.substring(1), toMatch)
			yield [
				getAddVariableDetailsStepEvent(node, [
					['dist_if_delete', `${1 + fromDelete}`],
				]),
				getLastActionStepEvent(node),
			]

			const fromInsert = yield* editDist(node, toChange, toMatch.substring(1))
			yield [
				getAddVariableDetailsStepEvent(node, [
					['dist_if_insert', `${1 + fromInsert}`],
				]),
				getLastActionStepEvent(node),
			]

			const fromReplace = yield* editDist(
				node,
				toChange.substring(1),
				toMatch.substring(1)
			)

			returnVariableDetails.push(['dist_if_substitute', `${1 + fromReplace}`])
			if (toChange[0] === toMatch[0]) {
				returnVariableDetails.push(['dist_if_use_same_char', `${fromReplace}`])
			}

			returnValue = Math.min(
				fromDelete + 1,
				fromInsert + 1,
				fromReplace + (toChange[0] === toMatch[0] ? 0 : 1)
			)
		}

		yield [
			getAddVariableDetailsStepEvent(node, returnVariableDetails),
			getAddReturnValueStepEvent(node, returnValue.toString()),
			getLastActionStepEvent(node),
		]
		return returnValue
	}
}

export default scopeEditDistSliceGenerator
