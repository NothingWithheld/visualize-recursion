export const preorder = (root, propsForNodeAndChildren = {}) => {
	function* preorderGenerator(node, props = {}) {
		if (node === null) return

		const { nodeID, children } = node
		const updatedProps = { ...props, ...propsForNodeAndChildren[nodeID] }

		for (const child of children) {
			yield* preorderGenerator(child, updatedProps)
		}

		yield [node, updatedProps]
	}

	return Array.from(preorderGenerator(root))
}

export const getEdges = root => {
	function* edgeGenerator(node) {
		const { children } = node

		for (const child of children) {
			yield [node, child]
			yield* edgeGenerator(child)
		}
	}

	if (root === null) return []
	return Array.from(edgeGenerator(root))
}
