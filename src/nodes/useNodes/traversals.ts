import { IterableNode } from '../types'

export const preorder = <Node>(iterableNode: IterableNode<Node>) => (
	root: Node,
	maybePropsForNodeAndChildren?: { [propName: number]: any }
): Array<[Node, { [propName: number]: any }]> => {
	const propsForNodeAndChildren = maybePropsForNodeAndChildren || {}

	function* preorderGenerator(
		node: Node,
		props: { [propName: number]: any }
	): Iterable<[Node, { [propName: number]: any }]> {
		const nodeID = iterableNode.getNodeID(node)
		const children = iterableNode.getChildren(node)
		const updatedProps = { ...props, ...propsForNodeAndChildren[nodeID] }

		yield [node, updatedProps]
		for (const child of children) {
			yield* preorderGenerator(child, updatedProps)
		}
	}

	return Array.from(preorderGenerator(root, {}))
}

export const getEdges = <Node>(iterableNode: IterableNode<Node>) => (
	root: Node
): Array<[Node, Node]> => {
	function* edgeGenerator(node: Node): Iterable<[Node, Node]> {
		const children = iterableNode.getChildren(node)

		for (const child of children) {
			yield [node, child]
			yield* edgeGenerator(child)
		}
	}

	return Array.from(edgeGenerator(root))
}
