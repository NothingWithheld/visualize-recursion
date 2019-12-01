import { useState } from 'react'
import { getMakeNodeFunc } from '../useNodes/utils'
import drawBinaryTree from '../tree_drawing/draw_binary_tree'

const createNodeTree = (nodeArray, rootIndex = 0) => {
	const getNodeTree = nodeIndex => {
		console.log({ nodeIndex })
		if (nodeIndex === null) {
			return null
		}

		const { leftIndex, rightIndex, ...node } = nodeArray[nodeIndex]
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
	const [nodeArray, setNodeArray] = useState(startingNodes)
	const [makeNode, setMakeNode] = useState(() =>
		getMakeNodeFunc(startingNodes.length)
	)

	const addChildToNodeArray = (parent, child, isLeftChild) => {
		if (nodeArray.length > 0) {
			const parentNode = nodeArray.find(node => node.nodeID === parent.nodeID)
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
				leftIndex: isLeftChild ? nodeArray.length : leftIndex,
				rightIndex: !isLeftChild ? nodeArray.length : rightIndex,
			}
			const newNodeArray = [
				...nodeArray.map(node =>
					node.nodeID === newParentNode.nodeID ? newParentNode : node
				),
				{ ...child, leftIndex: null, rightIndex: null },
			]

			setNodeArray(newNodeArray)
		} else {
			setNodeArray([{ ...child, leftIndex: null, rightIndex: null }])
		}
	}

	const getParentWithoutChildReference = childToRemoveIndex => {
		const { leftIndex, rightIndex, ...restOfParent } = nodeArray.find(
			node =>
				node.leftIndex === childToRemoveIndex ||
				node.rightIndex === childToRemoveIndex
		)

		return {
			...restOfParent,
			leftIndex: leftIndex === childToRemoveIndex ? null : leftIndex,
			rightIndex: rightIndex === childToRemoveIndex ? null : rightIndex,
		}
	}

	const deleteNode = nodeToDelete => {
		const nodeToDeleteArrayIndex = nodeArray.findIndex(
			node => node.nodeID === nodeToDelete.nodeID
		)
		console.log({ nodeArray, nodeToDelete, nodeToDeleteArrayIndex })
		const thisSubtreeArray = flattenTree(
			createNodeTree(nodeArray, nodeToDeleteArrayIndex)
		)
		const subtreeNodeIDs = new Set(thisSubtreeArray.map(node => node.nodeID))

		const parentWithoutChildReference = getParentWithoutChildReference(
			nodeToDeleteArrayIndex
		)
		console.log({ parentWithoutChildReference })
		const allNodesNotInSubtree = nodeArray
			.filter(node => !subtreeNodeIDs.has(node.nodeID))
			.map(node =>
				node.nodeID === parentWithoutChildReference.nodeID
					? parentWithoutChildReference
					: node
			)

		console.log({ allNodesNotInSubtree })
		setNodeArray(allNodesNotInSubtree)
	}

	const resetNodes = () => {
		setNodeArray(startingNodes)
		setMakeNode(startingNodes.length)
	}

	return {
		resetNodes,
		makeNode,
		deleteNode,
		nodes:
			nodeArray.length > 0
				? flattenTree(drawBinaryTree(createNodeTree(nodeArray)))
				: [],
		addLeftChild: (parent, child) => addChildToNodeArray(parent, child, true),
		addRightChild: (parent, child) => addChildToNodeArray(parent, child, false),
	}
}

export default useBinaryNodes
