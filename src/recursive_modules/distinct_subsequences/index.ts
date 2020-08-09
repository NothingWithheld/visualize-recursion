import {
	MakeNodeFunc,
	getAddChildStepEvent,
	getLastActionStepEvent,
	getAddReturnValueStepEvent,
	getAddVariableDetailsStepEvent,
	FunctionProgressStepDetails,
} from '../../nodes/useNodes/utils'
import { SentryNode, FuncNode } from '../../nodes/types'

const scopeDistinctSubsequencesGenerator = (makeNode: MakeNodeFunc) => {
	return function* distinctSubsequences(
		sentry: SentryNode,
		toUse: string,
		target: string
	): Generator<FunctionProgressStepDetails[]> {
		function* distinctSubsequencesHelper(
			parentNode: SentryNode | FuncNode,
			toUseInd: number,
			targetInd: number
		): Generator<FunctionProgressStepDetails[]> {
			const node = makeNode([
				['to_use_ind', toUseInd.toString()],
				['target_ind', targetInd.toString()],
			])

			const substringVariableDetails: [string, string][] = [
				['toUse', toUse.substring(toUseInd)],
				['target', target.substring(targetInd)],
			]

			yield [
				getAddChildStepEvent(parentNode, node),
				getLastActionStepEvent(node),
				getAddVariableDetailsStepEvent(node, substringVariableDetails),
			]

			if (targetInd === target.length) {
				yield [
					getAddReturnValueStepEvent(node, '1'),
					getLastActionStepEvent(node),
				]

				return 1
			} else if (toUseInd === toUse.length) {
				yield [
					getAddReturnValueStepEvent(node, '0'),
					getLastActionStepEvent(node),
				]

				return 0
			}

			const waysFromNotUsingChar = yield* distinctSubsequencesHelper(
				node,
				toUseInd + 1,
				targetInd
			)
			const toUseChar = toUse[toUseInd]
			const targetChar = target[targetInd]

			const notUsingVariableDetails: [string, string][] = [
				['to_use_char', toUseChar.toString()],
				['target_char', targetChar.toString()],
				['ways_from_not_using_char', waysFromNotUsingChar.toString()],
			]

			if (toUseChar === targetChar) {
				yield [
					getAddVariableDetailsStepEvent(node, notUsingVariableDetails),
					getLastActionStepEvent(node),
				]

				const waysFromUsingChar = yield* distinctSubsequencesHelper(
					node,
					toUseInd + 1,
					targetInd + 1
				)

				const returnValue = waysFromNotUsingChar + waysFromUsingChar
				yield [
					getAddVariableDetailsStepEvent(node, [
						['ways_from_using_char', waysFromUsingChar.toString()],
					]),
					getAddReturnValueStepEvent(node, returnValue.toString()),
					getLastActionStepEvent(node),
				]

				return returnValue
			}

			yield [
				getAddVariableDetailsStepEvent(node, notUsingVariableDetails),
				getAddReturnValueStepEvent(node, waysFromNotUsingChar.toString()),
				getLastActionStepEvent(node),
			]

			return waysFromNotUsingChar
		}

		yield* distinctSubsequencesHelper(sentry, 0, 0)
	}
}

export default scopeDistinctSubsequencesGenerator
