import { nodeRadius } from '../../constants'
import {
	hasChildren,
	getLeftChild,
	getRightChild,
	getRightmostChild,
} from '../helpers'
import { PlacingNode, PlacedNode } from '../../types'
import {
	Option,
	none,
	some,
	isNone,
	map,
	ap,
	getOrElse,
} from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'

const minXDistanceBetweenNodes = 2.5 * nodeRadius
const minYDistanceBetweenNodes = 2.75 * nodeRadius

const drawTreeReingoldTilford = <Node>(treeRoot: Node): PlacedNode<Node> =>
	applyOffsets<Node>(
		getPlacedNode<Node>((treeRoot as unknown) as PlacingNode<Node>)
	)

export default drawTreeReingoldTilford

function applyOffsets<Node>(
	node: PlacingNode<Node>,
	curOffset = 0
): PlacedNode<Node> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { x, children, offset: nodeOffset, thread, ...restOfNode } = node

	return ({
		...restOfNode,
		x: x + curOffset,
		children: children.map((child) =>
			applyOffsets<Node>(child, curOffset + nodeOffset)
		),
	} as unknown) as PlacedNode<Node>
}

function getPlacedNode<Node>(
	node: PlacingNode<Node>,
	depth = 0
): PlacingNode<Node> {
	const placeWithBothChildren = (leftChild: PlacingNode<Node>) => (
		rightChild: PlacingNode<Node>
	): PlacingNode<Node> => {
		const placedLeftChild = getPlacedNode<Node>(leftChild, depth + 1)
		const placedRightChild = getPlacedNode<Node>(rightChild, depth + 1)
		const adjustedRightChild = getAdjustedRightSubtree<Node>(
			placedLeftChild,
			placedRightChild
		)

		return {
			...node,
			x: (placedLeftChild.x + adjustedRightChild.x) / 2,
			y: depth * minYDistanceBetweenNodes,
			children: [placedLeftChild, adjustedRightChild],
			offset: 0,
			thread: none,
		}
	}

	const placeWithOneChild = (child: PlacingNode<Node>): PlacingNode<Node> => {
		const placedChild = getPlacedNode<Node>(child, depth + 1)

		return {
			...node,
			x: placedChild.x,
			y: depth * minYDistanceBetweenNodes,
			children: [placedChild],
			offset: 0,
			thread: none,
		}
	}

	const handlePlaceWithAtleastOneChild = (
		child: PlacingNode<Node>
	): PlacingNode<Node> => {
		return pipe(
			getRightChild<PlacingNode<Node>>(node),
			map(placeWithBothChildren(child)),
			getOrElse(() => placeWithOneChild(child))
		)
	}

	const placedLeafNode: PlacingNode<Node> = {
		...node,
		x: 0,
		y: depth * minYDistanceBetweenNodes,
		offset: 0,
		thread: none,
	}

	return pipe(
		getLeftChild<PlacingNode<Node>>(node),
		map(handlePlaceWithAtleastOneChild),
		getOrElse(() => placedLeafNode)
	)
}

// MUTATES deep child node to place thread
function getAdjustedRightSubtree<Node>(
	leftTree: PlacingNode<Node>,
	rightTree: PlacingNode<Node>
): PlacingNode<Node> {
	const {
		rightmostOnLeftAtShortestHeightPlusOne,
		leftmostOnRightAtShortestHeightPlusOne,
		leftmostOnLeftAtShortestHeight,
		rightmostOnRightAtShortestHeight,
		maxGap,
		offset,
	} = getContourData<Node>(leftTree, rightTree, leftTree, rightTree)

	const amountToSlideRightTreeOverBy = maxGap + minXDistanceBetweenNodes

	const placeThread = (toUpdate: PlacingNode<Node>) => (
		threadTo: PlacingNode<Node>
	): void => {
		toUpdate.thread = some(threadTo)
		toUpdate.offset = offset - amountToSlideRightTreeOverBy
	}

	// if one subtree is taller than the other, attach a thread when combining the trees
	if (isNone(leftmostOnRightAtShortestHeightPlusOne)) {
		map(placeThread(rightmostOnRightAtShortestHeight))(
			rightmostOnLeftAtShortestHeightPlusOne
		)
	} else if (isNone(rightmostOnLeftAtShortestHeightPlusOne)) {
		map(placeThread(leftmostOnLeftAtShortestHeight))(
			leftmostOnRightAtShortestHeightPlusOne
		)
	}

	return {
		...rightTree,
		x: rightTree.x + amountToSlideRightTreeOverBy,
		offset: rightTree.offset + amountToSlideRightTreeOverBy,
	}
}

type GetCountourDataReturn<Node> = {
	rightmostOnLeftAtShortestHeightPlusOne: Option<PlacingNode<Node>>
	leftmostOnRightAtShortestHeightPlusOne: Option<PlacingNode<Node>>
	leftmostOnLeftAtShortestHeight: PlacingNode<Node>
	rightmostOnRightAtShortestHeight: PlacingNode<Node>
	maxGap: number
	offset: number
}

function getContourData<Node>(
	rightmostOnLeftTree: PlacingNode<Node>,
	leftmostOnRightTree: PlacingNode<Node>,
	leftmostOnLeftTree: PlacingNode<Node>,
	rightmostOnRightTree: PlacingNode<Node>,
	curMaxGap = 0,
	curOffset = 0
): GetCountourDataReturn<Node> {
	const maxGap = Math.max(
		curMaxGap,
		rightmostOnLeftTree.x + curOffset - leftmostOnRightTree.x
	)

	const nextRightmostOnLeftTree = getNextRightInTree<Node>(rightmostOnLeftTree)
	const nextLeftmostOnRightTree = getNextLeftInTree<Node>(leftmostOnRightTree)
	const nextLeftmostOnLeftTree = getNextLeftInTree<Node>(leftmostOnLeftTree)
	const nextRightmostOnRightTree = getNextRightInTree<Node>(
		rightmostOnRightTree
	)

	const goOneLevelDeeper = (nextRightOnLeftTree: PlacingNode<Node>) => (
		nextLeftOnRightTree: PlacingNode<Node>
	) => (nextLeftOnLeftTree: PlacingNode<Node>) => (
		nextRightOnRightTree: PlacingNode<Node>
	): GetCountourDataReturn<Node> => {
		const offset =
			curOffset + rightmostOnLeftTree.offset - leftmostOnRightTree.offset
		return getContourData<Node>(
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
		offset: curOffset,
	}

	return pipe(
		maybeOneLevelDeeper,
		getOrElse(() => thisLevelRes)
	)
}

function getNextLeftInTree<Node>(
	node: PlacingNode<Node>
): Option<PlacingNode<Node>> {
	if (hasChildren<PlacingNode<Node>>(node)) {
		return getLeftChild<PlacingNode<Node>>(node)
	}

	return node.thread
}

function getNextRightInTree<Node>(
	node: PlacingNode<Node>
): Option<PlacingNode<Node>> {
	if (hasChildren<PlacingNode<Node>>(node)) {
		return getRightmostChild<PlacingNode<Node>>(node)
	}

	return node.thread
}
