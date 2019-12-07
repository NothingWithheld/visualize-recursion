import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import { Stage, Layer } from 'react-konva'
import FunctionCallArrow from '../../CodePlayer/RecursionCanvas/FunctionCallArrow'
import TreeNode from '../TreeComponents/TreeNode'
import useRefreshLayerOnFontLoad from '../../Konva/useRefreshLayerOnFontLoad'
import useBinaryNodes, { preorder, getEdges } from '../../nodes/useBinaryNodes'

const BinaryTreeBuilder = ({ startingNodes }) => {
	const {
		nodes,
		resetNodes,
		deleteNode,
		addLeftChild,
		addRightChild,
	} = useBinaryNodes(startingNodes)
	const layerRef = useRefreshLayerOnFontLoad()

	const [hoveringToBeDeletedNodeID, setHoveringToBeDeletedNodeID] = useState(
		null
	)

	const extraNodeProps = hoveringToBeDeletedNodeID
		? {
				[hoveringToBeDeletedNodeID]: {
					isHoveringToBeDeleted: true,
				},
		  }
		: {}

	return (
		<Box
			margin="12px 8px"
			border="thin solid"
			borderRadius="4px"
			borderColor="#BCCCDC"
		>
			<Stage
				width={window.innerWidth}
				height={(2 * window.innerHeight) / 3}
				draggable
			>
				<Layer
					ref={layerRef}
					x={window.innerWidth / 2}
					y={window.innerHeight / 3}
				>
					{getEdges(nodes).map(([parent, child]) => (
						<FunctionCallArrow
							startX={parent.x}
							startY={parent.y}
							endX={child.x}
							endY={child.y}
							key={child.nodeID}
						/>
					))}
					{preorder(nodes, extraNodeProps).map(([node, extraProps], i) => (
						<TreeNode
							{...node}
							{...extraProps}
							key={i}
							hasNoLeftChild={node.left === null}
							hasNoRightChild={node.right === null}
							addLeftChild={() => addLeftChild(node)}
							addRightChild={() => addRightChild(node)}
							deleteNode={() => deleteNode(node)}
							handleHoverToBeDeleted={mouseEntering =>
								mouseEntering
									? setHoveringToBeDeletedNodeID(node.nodeID)
									: setHoveringToBeDeletedNodeID(null)
							}
						/>
					))}
				</Layer>
			</Stage>
		</Box>
	)
}

export default BinaryTreeBuilder
