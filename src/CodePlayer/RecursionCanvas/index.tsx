import React, { useState } from 'react'
import { Stage, Layer } from 'react-konva'
import FunctionCallNode from './FunctionCallNode'
import FunctionCallArrow from './FunctionCallArrow'
import CallNodeExtraDetails from './CallNodeExtraDetails'
import Box from '@material-ui/core/Box'
import { preorder, getEdges } from '../../nodes/useNodes/traversals'

export const RecursionCanvas = ({ treeRoot }) => {
	const [layerX, setLayerX] = useState(0)
	const [layerY, setLayerY] = useState(0)
	const [nodeExtraDetailPositions, setNodeExtraDetailPositions] = useState([])

	const setLayerPosition = (x, y) => {
		setLayerX(x)
		setLayerY(y)
	}

	return (
		<Box
			margin="12px 8px"
			border="thin solid"
			borderRadius="4px"
			borderColor="#BCCCDC"
			position="relative"
		>
			<Stage
				width={window.innerWidth}
				height={(2 * window.innerHeight) / 3}
				draggable
			>
				<Layer
					x={layerX + window.innerWidth / 2}
					y={layerY + window.innerHeight / 3}
				>
					{preorder(treeRoot).map(([node, _], i) => (
						<FunctionCallNode
							{...node}
							setLayerPosition={setLayerPosition}
							openExtraDetails={(x, y) =>
								setNodeExtraDetailPositions([
									...nodeExtraDetailPositions,
									{ ...node, x, y },
								])
							}
							key={i}
						/>
					))}
					{getEdges(treeRoot).map(([parent, child]) => (
						<FunctionCallArrow
							startX={parent.x}
							startY={parent.y}
							endX={child.x}
							endY={child.y}
							key={child.nodeID}
						/>
					))}
				</Layer>
			</Stage>
			{nodeExtraDetailPositions.map((positionProps, i) => (
				<CallNodeExtraDetails {...positionProps} key={i} />
			))}
		</Box>
	)
}

export default RecursionCanvas
