import React from 'react'
import { Arrow } from 'react-konva'
import { nodeRadius } from '../../../nodes/constants'
import { calculatePerimeterPositions } from '../../../nodes/utils'

const FunctionCallArrow = ({ startX, startY, endX, endY }) => {
	const {
		startX: arrowStartX,
		startY: arrowStartY,
		endX: arrowEndX,
		endY: arrowEndY,
	} = calculatePerimeterPositions(nodeRadius, startX, startY, endX, endY)

	return (
		<Arrow
			points={[arrowStartX, arrowStartY, arrowEndX, arrowEndY]}
			fill="#486581"
			stroke="#486581"
			strokeWidth={3}
		/>
	)
}

export default FunctionCallArrow
