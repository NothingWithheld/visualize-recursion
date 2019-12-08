import React from 'react'
import TreeCodeController from './TreeCodeController'
import useTreeAlgoStepper from './useTreeAlgoStepper'
import BinaryTreeBuilder from '../TreeBuilder/BinaryTreeBuilder'
import useBinaryNodes from '../nodes/useBinaryNodes'

const TreePlayer = ({ algoGeneratorFunc, startingNodes }) => {
	const { calledNodeID, ...treeCodePlayerProps } = useTreeAlgoStepper(
		algoGeneratorFunc
	)
	const { treeRoot, deleteNode, addLeftChild, addRightChild } = useBinaryNodes(
		startingNodes
	)

	return (
		<>
			<TreeCodeController {...treeCodePlayerProps} treeRoot={treeRoot} />
			<BinaryTreeBuilder
				treeRoot={treeRoot}
				deleteNode={deleteNode}
				addLeftChild={addLeftChild}
				addRightChild={addRightChild}
				calledNodeID={calledNodeID}
			/>
		</>
	)
}

export default TreePlayer
