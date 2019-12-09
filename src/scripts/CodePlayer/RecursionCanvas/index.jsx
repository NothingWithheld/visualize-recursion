import React, { useState } from 'react'
import { Stage, Layer } from 'react-konva'
import FunctionCallNode from './FunctionCallNode'
import FunctionCallArrow from './FunctionCallArrow'
import CallNodeExtraDetails from './CallNodeExtraDetails'
import Box from '@material-ui/core/Box'

const RecursionCanvas = ({ nodes }) => {
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
					{nodes.map((node, i) => (
						<FunctionCallNode
							{...node}
							setLayerPosition={setLayerPosition}
							openExtraDetails={(x, y) =>
								setNodeExtraDetailPositions([
									...nodeExtraDetailPositions,
									{ x, y },
								])
							}
							key={i}
						/>
					))}
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
				</Layer>
			</Stage>
			{nodeExtraDetailPositions.map((positionProps, i) => (
				<CallNodeExtraDetails {...positionProps} key={i} />
			))}
		</Box>
	)
}

export default RecursionCanvas
