import { getMakeNodeFunc } from '../../nodes/useNodes/utils'

function scopeLongestCommonSubstringGenerator(addChild, addReturnValue) {
	const makeNode = getMakeNodeFunc()

	return function* longestCommonSubstringGenerator(wordA, wordB) {
		function* recursiveGenerator(
			wordAInd = 0,
			wordBInd = 0,
			parentNode = null
		) {
			const node = makeNode([wordAInd, wordBInd])
			addChild(parentNode, node)
			yield

			let returnValue
			if (wordAInd === wordA.length || wordBInd === wordB.length) {
				returnValue = 0
			} else if (wordA[wordAInd] === wordB[wordBInd]) {
				const lcsForRestOfWord = yield* recursiveGenerator(
					wordAInd + 1,
					wordBInd + 1,
					node
				)
				returnValue = 1 + lcsForRestOfWord
			} else {
				const lcsStartIteratingDownWordA = yield* recursiveGenerator(
					wordAInd + 1,
					wordBInd,
					node
				)
				const lcsStartIteratingDownWordB = yield* recursiveGenerator(
					wordAInd,
					wordBInd + 1,
					node
				)

				returnValue = Math.max(
					lcsStartIteratingDownWordA,
					lcsStartIteratingDownWordB
				)
			}

			addReturnValue(node, returnValue)
			yield returnValue
			return returnValue
		}

		yield* recursiveGenerator()
	}
}

export default scopeLongestCommonSubstringGenerator
