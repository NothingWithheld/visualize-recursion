import {
	MakeNodeFunc,
	getAddChildStepEvent,
	getLastActionStepEvent,
	getAddReturnValueStepEvent,
	getAddVariableDetailsStepEvent,
	FunctionProgressStepDetails,
} from '../../nodes/useNodes/utils'
import { SentryNode, FuncNode } from '../../nodes/types'

function scopeLongestCommonSubstringGenerator(makeNode: MakeNodeFunc) {
	return function* longestCommonSubstringGenerator(
		sentry: SentryNode,
		textA: string,
		textB: string
	): Iterable<FunctionProgressStepDetails[]> {
		function* recursiveGenerator(
			parentNode: SentryNode | FuncNode,
			textAInd = 0,
			textBInd = 0
		): Iterable<FunctionProgressStepDetails[]> {
			const node = makeNode([textAInd, textBInd])
			yield [
				getAddChildStepEvent(parentNode, node),
				getLastActionStepEvent(node),
			]

			let returnValue
			if (textAInd === textA.length || textBInd === textB.length) {
				returnValue = 0
			} else if (textA[textAInd] === textB[textBInd]) {
				const lcsForRestOfWord = yield* recursiveGenerator(
					node,
					textAInd + 1,
					textBInd + 1
				)
				returnValue = 1 + lcsForRestOfWord
			} else {
				const lcsStartIteratingDownWordA = yield* recursiveGenerator(
					node,
					textAInd + 1,
					textBInd
				)
				const lcsStartIteratingDownWordB = yield* recursiveGenerator(
					node,
					textAInd,
					textBInd + 1
				)

				returnValue = Math.max(
					lcsStartIteratingDownWordA,
					lcsStartIteratingDownWordB
				)
			}

			yield [
				getAddReturnValueStepEvent(node, returnValue),
				getLastActionStepEvent(node),
			]
			return returnValue
		}

		yield* recursiveGenerator(sentry)
	}
}

export default scopeLongestCommonSubstringGenerator
