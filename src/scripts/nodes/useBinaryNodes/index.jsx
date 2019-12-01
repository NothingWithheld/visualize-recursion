import { useState } from 'react'
import { getMakeNodeFunc } from '../useNodes/utils'
import drawBinaryTree from '../tree_drawing/draw_binary_tree'

const createNodeTree = (nodeMap, rootIndex = 0) => {
	const getNodeTree = nodeIndex => {
		if (nodeIndex === null) {
			return null
		}

		const { leftIndex, rightIndex, ...node } = nodeMap.get(nodeIndex)
		const left = getNodeTree(leftIndex)
		const right = getNodeTree(rightIndex)

		return { ...node, left, right }
	}

	return getNodeTree(rootIndex)
}

const flattenTree = treeRoot => {
	const flattenedTree = []

	function flatten(nodeToFlatten) {
		if (nodeToFlatten === null) {
			return null
		}

		const { left, right, ...node } = nodeToFlatten
		const leftIndex = flatten(left)
		const rightIndex = flatten(right)

		const thisNodeIndex = flattenedTree.length
		flattenedTree.push({ ...node, leftIndex, rightIndex })

		return thisNodeIndex
	}

	flatten(treeRoot)
	return flattenedTree
}

const useBinaryNodes = (startingNodes = []) => {
	const [nodeMap, setNodeMap] = useState(
		new Map(startingNodes.map(node => [node.nodeID, node]))
	)
	const [makeNode, setMakeNode] = useState(() =>
		getMakeNodeFunc(startingNodes.length)
	)

	const addChildToNodeArray = (parent, child, isLeftChild) => {
		if (nodeMap.size > 0) {
			const parentNode = nodeMap.get(parent.nodeID)
			const { leftIndex, rightIndex, ...restOfParentNode } = parentNode

			if (isLeftChild && leftIndex !== null) {
				throw new Error(
					`Cannot add a left child when there is already a left child for ${parentNode}`
				)
			} else if (!isLeftChild && rightIndex !== null) {
				throw new Error(
					`Cannot add a right child when there is already a right child for ${parentNode}`
				)
			}

			const newParentNode = {
				...restOfParentNode,
				leftIndex: isLeftChild ? child.nodeID : leftIndex,
				rightIndex: !isLeftChild ? child.nodeID : rightIndex,
			}
			const newNodeMap = new Map([
				...Array.from(nodeMap.entries()).map(([nodeID, node]) =>
					nodeID === newParentNode.nodeID
						? [newParentNode.nodeID, newParentNode]
						: [nodeID, node]
				),
				[child.nodeID, { ...child, leftIndex: null, rightIndex: null }],
			])

			setNodeMap(newNodeMap)
		} else {
			setNodeMap(
				new Map([
					[child.nodeID, { ...child, leftIndex: null, rightIndex: null }],
				])
			)
		}
	}

	const getParentWithoutChildReference = childID => {
		const { leftIndex, rightIndex, ...restOfParent } = Array.from(
			nodeMap.values()
		).find(node => node.leftIndex === childID || node.rightIndex === childID)

		return {
			...restOfParent,
			leftIndex: leftIndex === childID ? null : leftIndex,
			rightIndex: rightIndex === childID ? null : rightIndex,
		}
	}

	const deleteNode = nodeToDelete => {
		const thisSubtreeArray = flattenTree(
			createNodeTree(nodeMap, nodeToDelete.nodeID)
		)
		const subtreeNodeIDs = new Set(thisSubtreeArray.map(node => node.nodeID))

		const parentWithoutChildReference = getParentWithoutChildReference(
			nodeToDelete.nodeID
		)
		const allNodesNotInSubtree = Array.from(nodeMap.values())
			.filter(node => !subtreeNodeIDs.has(node.nodeID))
			.map(node =>
				node.nodeID === parentWithoutChildReference.nodeID
					? parentWithoutChildReference
					: node
			)

		setNodeMap(new Map(allNodesNotInSubtree.map(node => [node.nodeID, node])))
	}

	const resetNodes = () => {
		setNodeMap(new Map(startingNodes.map(node => [node.nodeID, node])))
		setMakeNode(startingNodes.length)
	}

	return {
		resetNodes,
		makeNode,
		deleteNode,
		nodes:
			nodeMap.size > 0
				? flattenTree(drawBinaryTree(createNodeTree(nodeMap)))
				: [],
		addLeftChild: (parent, child) => addChildToNodeArray(parent, child, true),
		addRightChild: (parent, child) => addChildToNodeArray(parent, child, false),
	}
}

export default useBinaryNodes
