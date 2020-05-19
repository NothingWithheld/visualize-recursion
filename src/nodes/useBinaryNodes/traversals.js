export const preorder = (root, propsForNodeAndChildren = {}) => {
	function* preorderGenerator(node, props = {}) {
		if (node === null) return

		const { nodeID, left, right } = node
		const updatedProps = { ...props, ...propsForNodeAndChildren[nodeID] }

		yield* preorderGenerator(left, updatedProps)
		yield* preorderGenerator(right, updatedProps)

		yield [node, updatedProps]
	}

	return Array.from(preorderGenerator(root))
}

export const getEdges = root => {
	function* edgeGenerator(node) {
		const { left, right } = node

		if (left !== null) {
			yield [node, left]
			yield* edgeGenerator(left)
		}
		if (right !== null) {
			yield [node, right]
			yield* edgeGenerator(right)
		}
	}

	if (root === null) return []
	return Array.from(edgeGenerator(root))
}
