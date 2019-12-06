import { useState } from 'react'
import { curry } from 'ramda'
import {
	getMakeBinaryNodeFunc,
	addNodeToTree,
	deleteNodeFromTree,
	isSameNode,
} from './utils'
import drawBinaryTree from '../tree_drawing/draw_binary_tree'
import { preorder, getEdges } from './traversals'
export { preorder, getEdges }

const useBinaryNodes = (startingNodes = []) => {
	const [makeNode, setMakeNode] = useState(() =>
		getMakeBinaryNodeFunc(startingNodes.length)
	)
	const [treeRoot, setTreeRoot] = useState(makeNode())

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
		setTreeRoot(null)
		setMakeNode(() => getMakeBinaryNodeFunc(startingNodes.length))
	}

	return {
		resetNodes,
		deleteNode,
		nodes: treeRoot === null ? null : drawBinaryTree(treeRoot),
		addLeftChild: addNode(true),
		addRightChild: addNode(false),
	}
}

export default useBinaryNodes
