import { BaseNode } from '../types'

export const preorder = (
	root: BaseNode,
	maybePropsForNodeAndChildren?: { [propName: number]: any }
): Array<[BaseNode, { [propName: number]: any }]> => {
	const propsForNodeAndChildren = maybePropsForNodeAndChildren || {}

	function* preorderGenerator(
		node: BaseNode,
		props: { [propName: number]: any }
	): Iterable<[BaseNode, { [propName: number]: any }]> {
		const { nodeID, children } = node
		const updatedProps = { ...props, ...propsForNodeAndChildren[nodeID] }

		for (const child of children) {
			yield* preorderGenerator(child, updatedProps)
		}

		yield [node, updatedProps]
	}

	return Array.from(preorderGenerator(root, {}))
}

export const getEdges = (root: BaseNode): Array<[BaseNode, BaseNode]> => {
	function* edgeGenerator(node: BaseNode): Iterable<[BaseNode, BaseNode]> {
		const { children } = node

		for (const child of children) {
			yield [node, child]
			yield* edgeGenerator(child)
		}
	}

	return Array.from(edgeGenerator(root))
}
