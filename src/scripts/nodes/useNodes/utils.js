export const getMakeNodeFunc = counter => {
	return args => {
		const node = {
			nodeID: counter,
			args,
			returnValue: null,
		}

		counter += 1
		return node
	}
}

export const createNodeTree = (nodeArray, rootIndex = 0) => {
	const getNodeTree = nodeIndex => {
		const { childIndices, ...node } = nodeArray[nodeIndex]
		const children = childIndices.map(getNodeTree)

		const nodeWithChildReferences = { ...node, children }
		return nodeWithChildReferences
	}

	return getNodeTree(rootIndex)
}

export const flattenTree = treeRoot => {
	const flattenedTree = []

	function flatten(nodeToFlatten) {
		const { children, ...node } = nodeToFlatten
		const childIndices = children.map(flatten)

		const thisNodeIndex = flattenedTree.length
		flattenedTree.push({ ...node, childIndices })

		return thisNodeIndex
	}

	flatten(treeRoot)
	return flattenedTree
}
