import React, { useState } from 'react'
import { Stage, Layer, Circle } from 'react-konva'
import { nodeRadius } from '../../constants'
import FunctionCallNode from './FunctionCallNode'
import FunctionCallArrow from './FunctionCallArrow'

const RecursionCanvas = ({ nodes }) => {
	console.log({ nodes })
	const [layerX, setLayerX] = useState(0)
	const [layerY, setLayerY] = useState(0)

	const setLayerPosition = (x, y) => {
		setLayerX(x)
		setLayerY(y)
	}

	return (
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
	)
}

export default RecursionCanvas
