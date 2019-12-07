import { identity } from 'ramda'

export const buildBinaryTreeFromArraySpec = (makeNode, nodeArrays) => {
	let treeRoot = null

	let prevLevelNodes = []
	for (const thisLevel of nodeArrays) {
		const thisLevelNodes = thisLevel.map(([idxOfParentInLevel, isLeftNode]) => {
			const node = makeNode()
			if (idxOfParentInLevel === -1) {
				if (treeRoot !== null) {
					throw Error('There can only be one tree root')
				}

				treeRoot = node
			} else {
				const parentNode = prevLevelNodes[idxOfParentInLevel]
				if (isLeftNode) {
					parentNode.left = node
				} else {
					parentNode.right = node
				}
			}

			return node
		})

		prevLevelNodes = thisLevelNodes
	}

	return treeRoot
}

export const isSameNode = (nodeA, nodeB) =>
	nodeA === null || nodeB === null ? false : nodeA.nodeID === nodeB.nodeID

const updateTree = (updateFuncs, node) => {
	if (node === null) return null

	const left = updateTree(updateFuncs, node.left)
	const right = updateTree(updateFuncs, node.right)
	const updateFunc = updateFuncs[node.nodeID] || identity

	return updateFunc({ ...node, left, right })
}

const findParentOf = (nodeToFind, curNode) => {
	if (curNode === null) return null

	if (
		isSameNode(nodeToFind, curNode.left) ||
		isSameNode(nodeToFind, curNode.right)
	) {
		return curNode
	}

	return (
		findParentOf(nodeToFind, curNode.left) ||
		findParentOf(nodeToFind, curNode.right)
	)
}

export const addNodeToTree = (treeRoot, child, isLeftChild, parent) => {
	const attachChild = _ =>
		isLeftChild
			? { ...parent, left: child, right: parent.right }
			: { ...parent, left: parent.left, right: child }

	const newTree = updateTree({ [parent.nodeID]: attachChild }, treeRoot)
	return newTree
}

export const deleteNodeFromTree = (treeRoot, nodeToDelete) => {
	const parent = findParentOf(nodeToDelete, treeRoot)
	const removeChildFromParent = _ => {
		const { left, right } = parent

		return {
			...parent,
			left: isSameNode(nodeToDelete, left) ? null : left,
			right: isSameNode(nodeToDelete, right) ? null : right,
		}
	}

	return updateTree({ [parent.nodeID]: removeChildFromParent }, treeRoot)
}

export const getMakeBinaryNodeFunc = (counter = 0) => {
	return () => {
		const node = {
			nodeID: counter,
			left: null,
			right: null,
		}

		counter += 1
		return node
	}
}
