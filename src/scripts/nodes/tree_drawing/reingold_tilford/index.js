import { nodeRadius } from '../../constants'
import {
	hasChildren,
	hasSingleChild,
	getLeftChild,
	getRightChild,
	getRightmostChild,
} from '../helpers'

const minXDistanceBetweenNodes = 2.5 * nodeRadius
const minYDistanceBetweenNodes = 2.75 * nodeRadius

const drawTreeReingoldTilford = treeRoot =>
	applyOffsets(getPlacedNode(treeRoot))

export default drawTreeReingoldTilford

function applyOffsets(node, curOffset = 0) {
	const { x, children, offset: nodeOffset, thread, ...restOfNode } = node

	return {
		...restOfNode,
		x: x + curOffset,
		children: children.map(child =>
			applyOffsets(child, curOffset + nodeOffset)
		),
	}
}

function getPlacedNode(node, depth = 0) {
	if (!hasChildren(node)) {
		return {
			...node,
			x: 0,
			y: depth * minYDistanceBetweenNodes,
			offset: 0,
			thread: null,
		}
	} else if (hasSingleChild(node)) {
		const placedChild = getPlacedNode(getLeftChild(node), depth + 1)

		return {
			...node,
			x: placedChild.x,
			y: depth * minYDistanceBetweenNodes,
			children: [placedChild],
			offset: 0,
			thread: null,
		}
	}

	const placedLeftChild = getPlacedNode(getLeftChild(node), depth + 1)
	const placedRightChild = getPlacedNode(getRightChild(node), depth + 1)
	const adjustedRightChild = getAdjustedRightSubtree(
		placedLeftChild,
		placedRightChild
	)

	return {
		...node,
		x: (placedLeftChild.x + adjustedRightChild.x) / 2,
		y: depth * minYDistanceBetweenNodes,
		children: [placedLeftChild, adjustedRightChild],
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
	if (hasChildren(node)) {
		return getLeftChild(node)
	} else if (node.thread) {
		return node.thread
	}

	return null
}

function getNextRightInTree(node) {
	if (hasChildren(node)) {
		return getRightmostChild(node)
	} else if (node.thread) {
		return node.thread
	}

	return null
}
