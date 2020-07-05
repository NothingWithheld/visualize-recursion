import { useState, useEffect } from 'react'
import { curry } from 'ramda'
import {
	getMakeBinaryNodeFunc,
	addNodeToTree,
	deleteNodeFromTree,
	buildBinaryTreeFromArraySpec,
	BinaryTreeArray,
} from './utils'
import drawBinaryTree from '../tree_drawing/draw_binary_tree'
import { BinaryNode, eqBinaryNode, PlacedBinaryNode } from '../types'
import { map, Option, getOrElse, none, ap, some } from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'

interface UseBinaryNodesReturn {
	readonly resetNodes: () => void
	readonly deleteNode: (node: PlacedBinaryNode) => void
	readonly treeRoot: Option<PlacedBinaryNode>
	readonly addLeftChild: (parent: PlacedBinaryNode) => void
	readonly addRightChild: (parent: PlacedBinaryNode) => void
}

const useBinaryNodes = (
	startingNodes: BinaryTreeArray = []
): UseBinaryNodesReturn => {
	const [makeNode, setMakeNode] = useState(() => getMakeBinaryNodeFunc())
	const [treeRoot, setTreeRoot] = useState(() =>
		buildBinaryTreeFromArraySpec(makeNode, startingNodes)
	)
	const [drawnTree, setDrawnTree] = useState(map(drawBinaryTree)(treeRoot))

	useEffect(() => setDrawnTree(map(drawBinaryTree)(treeRoot)), [treeRoot])

	const addNode = curry(
		(isLeftChild: boolean, parent: Option<PlacedBinaryNode>): void => {
			const newNode = makeNode()

			const updatedRootNode = pipe(
				treeRoot,
				map(addNodeToTree(newNode, isLeftChild)),
				ap(parent as Option<BinaryNode>),
				getOrElse<BinaryNode>(() => newNode)
			)
			setTreeRoot(some(updatedRootNode))
		}
	)

	const deleteNode = (nodeToDelete: PlacedBinaryNode): void => {
		const isSameAsTreeNode = pipe(
			treeRoot,
			map((tree: BinaryNode) => eqBinaryNode.equals(tree, nodeToDelete)),
			getOrElse<boolean>(() => false)
		)

		if (isSameAsTreeNode) {
			setTreeRoot(none)
			return
		}

		setTreeRoot(map(deleteNodeFromTree(nodeToDelete as BinaryNode))(treeRoot))
	}

	const resetNodes = () => {
		const resetMakeNode = getMakeBinaryNodeFunc()
		setTreeRoot(() =>
			buildBinaryTreeFromArraySpec(resetMakeNode, startingNodes)
		)
		setMakeNode(resetMakeNode)
	}

	return {
		resetNodes,
		deleteNode,
		treeRoot: drawnTree,
		addLeftChild: addNode(true),
		addRightChild: addNode(false),
	}
}

export default useBinaryNodes
