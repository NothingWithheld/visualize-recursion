import { PlacedBinaryNode } from '../types'
import { getOrElse, map } from 'fp-ts/es6/Option'
import { curry } from 'ramda'

type NodeIterable = Iterable<[PlacedBinaryNode, { [propName: number]: any }]>

export const preorder = (
	root: PlacedBinaryNode,
	maybePropsForNodeAndChildren?: { [propName: number]: any }
): Array<[PlacedBinaryNode, { [propName: number]: any }]> => {
	const propsForNodeAndChildren = maybePropsForNodeAndChildren || {}

	const preorderGenerator = curry(function* (
		props: { [propName: number]: any },
		node: PlacedBinaryNode
	): NodeIterable {
		const { nodeID, left, right } = node
		const updatedProps = { ...props, ...propsForNodeAndChildren[nodeID] }

		yield [node, updatedProps]

		const partialFunc = preorderGenerator(updatedProps)
		yield* getOrElse<NodeIterable>(() => [])(map(partialFunc)(left))
		yield* getOrElse<NodeIterable>(() => [])(map(partialFunc)(right))
	})

	return Array.from(preorderGenerator(propsForNodeAndChildren, root))
}

type EdgeIterable = Iterable<[PlacedBinaryNode, PlacedBinaryNode]>

export const getEdges = (
	root: PlacedBinaryNode
): Array<[PlacedBinaryNode, PlacedBinaryNode]> => {
	function* edgeGenerator(node: PlacedBinaryNode): EdgeIterable {
		const { left, right } = node

		function* generateEdgesFrom(child: PlacedBinaryNode): EdgeIterable {
			yield [node, child]
			yield* edgeGenerator(child)
		}

		yield* getOrElse<EdgeIterable>(() => [])(map(generateEdgesFrom)(left))
		yield* getOrElse<EdgeIterable>(() => [])(map(generateEdgesFrom)(right))
	}

	return Array.from(edgeGenerator(root))
}
