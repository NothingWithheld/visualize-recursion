import { useState, useEffect } from 'react'
import { curry } from 'ramda'
import {
	getMakeBinaryNodeFunc,
	addNodeToTree,
	deleteNodeFromTree,
	isSameNode,
	buildBinaryTreeFromArraySpec,
} from './utils'
import drawBinaryTree from '../tree_drawing/draw_binary_tree'
import { preorder, getEdges } from './traversals'
export { preorder, getEdges }

const useBinaryNodes = (startingNodes = []) => {
	const [makeNode, setMakeNode] = useState(() => getMakeBinaryNodeFunc())
	const [treeRoot, setTreeRoot] = useState(() =>
		buildBinaryTreeFromArraySpec(makeNode, startingNodes)
	)
	const [drawnTree, setDrawnTree] = useState(
		treeRoot && drawBinaryTree(treeRoot)
	)

	useEffect(() => setDrawnTree(treeRoot && drawBinaryTree(treeRoot)), [
		treeRoot,
	])

	const addNode = curry((isLeftChild, parent) => {
		const newNode = makeNode()
		if (treeRoot === null) {
			setTreeRoot(newNode)
			return
		}

		setTreeRoot(addNodeToTree(treeRoot, newNode, isLeftChild, parent))
	})

	const deleteNode = nodeToDelete => {
		if (isSameNode(nodeToDelete, treeRoot)) {
			setTreeRoot(null)
			return
		}

		setTreeRoot(deleteNodeFromTree(treeRoot, nodeToDelete))
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
