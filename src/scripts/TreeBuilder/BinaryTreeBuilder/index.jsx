import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import { Stage, Layer } from 'react-konva'
import FunctionCallArrow from '../../CodePlayer/RecursionCanvas/FunctionCallArrow'
import TreeNode from '../TreeComponents/TreeNode'
import useRefreshLayerOnFontLoad from '../../Konva/useRefreshLayerOnFontLoad'
import useNodes from '../../nodes/useNodes'
import { getMakeNodeFunc } from '../../nodes/useNodes/utils'

const BinaryTreeBuilder = ({ startingNodes }) => {
	console.log({ startingNodes })
	const { nodes, makeNode, resetNodes, deleteNode, addChild } = useNodes(
		startingNodes
	)
	const layerRef = useRefreshLayerOnFontLoad()

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
					{nodes
						.map(node =>
							node.childIndices.map(childIndex => {
								const child = nodes[childIndex]
								return (
									<FunctionCallArrow
										startX={node.x}
										startY={node.y}
										endX={child.x}
										endY={child.y}
										key={child.nodeID}
									/>
								)
							})
						)
						.reduce((acc, array) => [...acc, ...array], [])}
					{nodes.map((node, i) => (
						<TreeNode
							{...node}
							key={i}
							addChild={() => addChild(node, makeNode())}
							allowAdditionalChildren={node.childIndices.length < 2}
							deleteNode={() => deleteNode(node)}
						/>
					))}
				</Layer>
			</Stage>
		</Box>
	)
}

export default BinaryTreeBuilder
