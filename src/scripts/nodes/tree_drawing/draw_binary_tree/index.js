import { nodeRadius } from '../../constants'

const minXDistanceBetweenNodes = 2.5 * nodeRadius
const minYDistanceBetweenNodes = 2.75 * nodeRadius

const drawBinaryTree = treeRoot => applyOffsets(getPlacedNode(treeRoot))

export default drawBinaryTree

function applyOffsets(node, curOffset = 0) {
	const { x, left, right, offset: nodeOffset, thread, ...restOfNode } = node

	const runningOffset = curOffset + nodeOffset
	return {
		...restOfNode,
		x: x + curOffset,
		left: left && applyOffsets(left, runningOffset),
		right: right && applyOffsets(right, runningOffset),
	}
}

function getPlacedNode(node, depth = 0) {
	if (hasNoChildren(node)) {
		return {
			...node,
			x: 0,
			y: depth * minYDistanceBetweenNodes,
			offset: 0,
			thread: null,
		}
	} else if (hasBothChildren(node)) {
		const placedLeftChild = getPlacedNode(node.left, depth + 1)
		const placedRightChild = getPlacedNode(node.right, depth + 1)
		const adjustedRightChild = getAdjustedRightSubtree(
			placedLeftChild,
			placedRightChild
		)

		return {
			...node,
			x: (placedLeftChild.x + adjustedRightChild.x) / 2,
			y: depth * minYDistanceBetweenNodes,
			left: placedLeftChild,
			right: adjustedRightChild,
			offset: 0,
			thread: null,
		}
	}

	const hasLeftChild = node.left !== null
	const placedChild = getPlacedNode(node.left || node.right, depth + 1)

	return {
		...node,
		x: hasLeftChild
			? placedChild.x + minXDistanceBetweenNodes / 2
			: placedChild.x - minXDistanceBetweenNodes / 2,
		y: depth * minYDistanceBetweenNodes,
		left: hasLeftChild ? placedChild : null,
		right: hasLeftChild ? null : placedChild,
		offset: 0,
		thread: null,
	}
}

function getAdjustedRightSubtree(leftTree, rightTree) {
	const {
		rightmostOnLeftAtShortestHeightPlusOne,
		leftmostOnRightAtShortestHeightPlusOne,
		leftmostOnLeftAtShortestHeight,
		rightmostOnRightAtShortestHeight,
		maxGap,
		offset,
	} = getContourData(leftTree, rightTree, leftTree, rightTree)

	const amountToSlideRightTreeOverBy = maxGap + minXDistanceBetweenNodes

	// if one subtree is taller than the other, attach a thread when combining the trees
	if (
		rightmostOnLeftAtShortestHeightPlusOne !== null &&
		leftmostOnRightAtShortestHeightPlusOne === null
	) {
		rightmostOnRightAtShortestHeight.thread = rightmostOnLeftAtShortestHeightPlusOne
		rightmostOnRightAtShortestHeight.offset =
			offset - amountToSlideRightTreeOverBy
	} else if (
		rightmostOnLeftAtShortestHeightPlusOne === null &&
		leftmostOnRightAtShortestHeightPlusOne !== null
	) {
		leftmostOnLeftAtShortestHeight.thread = leftmostOnRightAtShortestHeightPlusOne
		leftmostOnLeftAtShortestHeight.offset =
			amountToSlideRightTreeOverBy - offset
	}

	return {
		...rightTree,
		x: rightTree.x + amountToSlideRightTreeOverBy,
		offset: rightTree.offset + amountToSlideRightTreeOverBy,
	}
}

function getContourData(
	rightmostOnLeftTree,
	leftmostOnRightTree,
	leftmostOnLeftTree,
	rightmostOnRightTree,
	curMaxGap = 0,
	curOffset = 0
) {
	const maxGap = Math.max(
		curMaxGap,
		rightmostOnLeftTree.x + curOffset - leftmostOnRightTree.x
	)

	const nextRightmostOnLeftTree = getNextRightInTree(rightmostOnLeftTree)
	const nextLeftmostOnRightTree = getNextLeftInTree(leftmostOnRightTree)
	const nextLeftmostOnLeftTree = getNextLeftInTree(leftmostOnLeftTree)
	const nextRightmostOnRightTree = getNextRightInTree(rightmostOnRightTree)

	if (nextRightmostOnLeftTree !== null && nextLeftmostOnRightTree !== null) {
		const offset =
			curOffset + rightmostOnLeftTree.offset - leftmostOnRightTree.offset
		return getContourData(
			nextRightmostOnLeftTree,
			nextLeftmostOnRightTree,
			nextLeftmostOnLeftTree,
			nextRightmostOnRightTree,
			maxGap,
			offset
		)
	}

	return {
		rightmostOnLeftAtShortestHeightPlusOne: nextRightmostOnLeftTree,
		leftmostOnRightAtShortestHeightPlusOne: nextLeftmostOnRightTree,
		leftmostOnLeftAtShortestHeight: leftmostOnLeftTree,
		rightmostOnRightAtShortestHeight: rightmostOnRightTree,
		maxGap,
		offset: curOffset,
	}
}

function getNextLeftInTree(node) {
	if (node.left) {
		return node.left
	} else if (node.right) {
		return node.right
	} else if (node.thread) {
		return node.thread
	}

	return null
}

function getNextRightInTree(node) {
	if (node.right) {
		return node.right
	} else if (node.left) {
		return node.left
	} else if (node.thread) {
		return node.thread
	}

	return null
}

function hasNoChildren(binaryNode) {
	return !binaryNode.left && !binaryNode.right
}

function hasBothChildren(binaryNode) {
	return binaryNode.left && binaryNode.right
}
