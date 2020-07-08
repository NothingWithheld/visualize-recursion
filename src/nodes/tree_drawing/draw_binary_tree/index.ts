import { nodeRadius } from '../../constants'
import {
	Option,
	alt,
	getOrElse,
	ap,
	map,
	isNone,
	some,
	none,
} from 'fp-ts/es6/Option'
import { BinaryNode, PlacedBinaryNode, PlacingBinaryNode } from '../../types'
import { pipe } from 'fp-ts/es6/pipeable'
import { curry } from 'ramda'

const minXDistanceBetweenNodes = 2.5 * nodeRadius
const minYDistanceBetweenNodes = 2.75 * nodeRadius

const drawBinaryTree = (treeRoot: BinaryNode): PlacedBinaryNode =>
	applyOffsets(0, getPlacedNode(treeRoot as PlacingBinaryNode))

export default drawBinaryTree

const applyOffsets = curry(
	(curOffset: number, node: PlacingBinaryNode): PlacedBinaryNode => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { x, left, right, offset: nodeOffset, thread, ...restOfNode } = node

		const runningOffset = curOffset + nodeOffset
		const partialFunc = applyOffsets(runningOffset)
		return {
			...restOfNode,
			x: x + curOffset,
			left: map(partialFunc)(left),
			right: map(partialFunc)(right),
		} as PlacedBinaryNode
	}
)

function getPlacedNode(node: PlacingBinaryNode, depth = 0): PlacingBinaryNode {
	const placeWithBothChildren = (leftChild: PlacingBinaryNode) => (
		rightChild: PlacingBinaryNode
	): PlacingBinaryNode => {
		const placedLeftChild = getPlacedNode(leftChild, depth + 1)
		const placedRightChild = getPlacedNode(rightChild, depth + 1)
		const adjustedRightChild = getAdjustedRightSubtree(
			placedLeftChild,
			placedRightChild
		)

		return {
			...node,
			x: (placedLeftChild.x + adjustedRightChild.x) / 2,
			y: depth * minYDistanceBetweenNodes,
			left: some(placedLeftChild),
			right: some(adjustedRightChild),
			offset: 0,
			thread: none,
		}
	}

	const placeWithOneChild = (
		child: PlacingBinaryNode,
		isLeftChild: boolean
	): PlacingBinaryNode => {
		const placedChild = getPlacedNode(child, depth + 1)

		return {
			...node,
			x: placedChild.x,
			y: depth * minYDistanceBetweenNodes,
			left: isLeftChild ? some(placedChild) : none,
			right: !isLeftChild ? some(placedChild) : none,
			offset: 0,
			thread: none,
		}
	}

	const [firstChildWithBool, secondChild]: [
		Option<[PlacingBinaryNode, boolean]>,
		Option<PlacingBinaryNode>
	] = isNone(node.left)
		? [
				map<PlacingBinaryNode, [PlacingBinaryNode, boolean]>((n) => [n, false])(
					node.right
				),
				node.left,
		  ]
		: [
				map<PlacingBinaryNode, [PlacingBinaryNode, boolean]>((n) => [n, true])(
					node.left
				),
				node.right,
		  ]

	const handlePlaceWithAtleastOneChild = ([child, isLeftChild]: [
		PlacingBinaryNode,
		boolean
	]): PlacingBinaryNode => {
		return pipe(
			secondChild,
			map(placeWithBothChildren(child)),
			getOrElse(() => placeWithOneChild(child, isLeftChild))
		)
	}

	const placedLeafNode: PlacingBinaryNode = {
		...node,
		x: 0,
		y: depth * minYDistanceBetweenNodes,
		offset: 0,
		thread: none,
	}

	return pipe(
		firstChildWithBool,
		map(handlePlaceWithAtleastOneChild),
		getOrElse(() => placedLeafNode)
	)
}

// MUTATES deep child node to place thread
function getAdjustedRightSubtree(
	leftTree: PlacingBinaryNode,
	rightTree: PlacingBinaryNode
): PlacingBinaryNode {
	const {
		rightmostOnLeftAtShortestHeightPlusOne,
		leftmostOnRightAtShortestHeightPlusOne,
		leftmostOnLeftAtShortestHeight,
		rightmostOnRightAtShortestHeight,
		maxGap,
		combOffset,
	} = getContourData(leftTree, rightTree, leftTree, rightTree)

	const amountToSlideRightTreeOverBy = maxGap + minXDistanceBetweenNodes

	const placeThread = (toUpdate: PlacingBinaryNode, crossingLeft: boolean) => (
		threadTo: PlacingBinaryNode
	): void => {
		toUpdate.thread = some(threadTo)
		const treeOffsetDiff = combOffset + amountToSlideRightTreeOverBy
		toUpdate.offset = crossingLeft ? treeOffsetDiff : -treeOffsetDiff
	}

	// if one subtree is taller than the other, attach a thread when combining the trees
	if (isNone(leftmostOnRightAtShortestHeightPlusOne)) {
		map(placeThread(rightmostOnRightAtShortestHeight, false))(
			rightmostOnLeftAtShortestHeightPlusOne
		)
	} else if (isNone(rightmostOnLeftAtShortestHeightPlusOne)) {
		map(placeThread(leftmostOnLeftAtShortestHeight, true))(
			leftmostOnRightAtShortestHeightPlusOne
		)
	}

	return {
		...rightTree,
		x: rightTree.x + amountToSlideRightTreeOverBy,
		offset: rightTree.offset + amountToSlideRightTreeOverBy,
	}
}

type GetCountourDataReturn = {
	rightmostOnLeftAtShortestHeightPlusOne: Option<PlacingBinaryNode>
	leftmostOnRightAtShortestHeightPlusOne: Option<PlacingBinaryNode>
	leftmostOnLeftAtShortestHeight: PlacingBinaryNode
	rightmostOnRightAtShortestHeight: PlacingBinaryNode
	maxGap: number
	combOffset: number
}

function getContourData(
	rightmostOnLeftTree: PlacingBinaryNode,
	leftmostOnRightTree: PlacingBinaryNode,
	leftmostOnLeftTree: PlacingBinaryNode,
	rightmostOnRightTree: PlacingBinaryNode,
	curMaxGap = -Number.MAX_SAFE_INTEGER,
	curCombOffset = 0
): GetCountourDataReturn {
	const maxGap = Math.max(
		curMaxGap,
		rightmostOnLeftTree.x + curCombOffset - leftmostOnRightTree.x
	)

	const nextRightmostOnLeftTree = getNextRightInTree(rightmostOnLeftTree)
	const nextLeftmostOnRightTree = getNextLeftInTree(leftmostOnRightTree)
	const nextLeftmostOnLeftTree = getNextLeftInTree(leftmostOnLeftTree)
	const nextRightmostOnRightTree = getNextRightInTree(rightmostOnRightTree)

	const goOneLevelDeeper = (nextRightOnLeftTree: PlacingBinaryNode) => (
		nextLeftOnRightTree: PlacingBinaryNode
	) => (nextLeftOnLeftTree: PlacingBinaryNode) => (
		nextRightOnRightTree: PlacingBinaryNode
	): GetCountourDataReturn => {
		const offset =
			curCombOffset + rightmostOnLeftTree.offset - leftmostOnRightTree.offset
		return getContourData(
			nextRightOnLeftTree,
			nextLeftOnRightTree,
			nextLeftOnLeftTree,
			nextRightOnRightTree,
			maxGap,
			offset
		)
	}

	const maybeOneLevelDeeper = pipe(
		nextRightmostOnLeftTree,
		map(goOneLevelDeeper),
		ap(nextLeftmostOnRightTree),
		ap(nextLeftmostOnLeftTree),
		ap(nextRightmostOnRightTree)
	)

	const thisLevelRes = {
		rightmostOnLeftAtShortestHeightPlusOne: nextRightmostOnLeftTree,
		leftmostOnRightAtShortestHeightPlusOne: nextLeftmostOnRightTree,
		leftmostOnLeftAtShortestHeight: leftmostOnLeftTree,
		rightmostOnRightAtShortestHeight: rightmostOnRightTree,
		maxGap,
		combOffset: curCombOffset,
	}

	return pipe(
		maybeOneLevelDeeper,
		getOrElse(() => thisLevelRes)
	)
}

function getNextLeftInTree(node: PlacingBinaryNode): Option<PlacingBinaryNode> {
	return pipe(
		node.thread,
		alt(() => node.right),
		alt(() => node.left)
	)
}

function getNextRightInTree(
	node: PlacingBinaryNode
): Option<PlacingBinaryNode> {
	return pipe(
		node.thread,
		alt(() => node.left),
		alt(() => node.right)
	)
}
