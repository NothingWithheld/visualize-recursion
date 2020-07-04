import React, { memo } from 'react'
import { Arrow } from 'react-konva'
import { nodeRadius } from '../../../nodes/constants'
import { calculatePerimeterPositions } from '../../../nodes/utils'
import { edgeColor } from '../../../constants'

interface FunctionCallArrowProps {
	readonly startX: number
	readonly startY: number
	readonly endX: number
	readonly endY: number
}

const FunctionCallArrow = ({
	startX,
	startY,
	endX,
	endY,
}: FunctionCallArrowProps): JSX.Element => {
	const {
		startX: arrowStartX,
		startY: arrowStartY,
		endX: arrowEndX,
		endY: arrowEndY,
	} = calculatePerimeterPositions(nodeRadius, startX, startY, endX, endY)

	return (
		<Arrow
			points={[arrowStartX, arrowStartY, arrowEndX, arrowEndY]}
			fill={edgeColor}
			stroke={edgeColor}
			strokeWidth={3}
		/>
	)
}

export default memo(FunctionCallArrow)
