import React from 'react'
import { Arrow } from 'react-konva'
import { nodeRadius } from '../../../constants'

const FunctionCallArrow = ({ startX, startY, endX, endY }) => {
	const calculatePerimeterPositions = (startX, startY, endX, endY) => {
		const dx = endX - startX
		const dy = endY - startY

		const hypotenuse = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
		const radiusOverHypotenuse = nodeRadius / hypotenuse

		return {
			startX: startX + radiusOverHypotenuse * dx,
			startY: startY + radiusOverHypotenuse * dy,
			endX: endX - radiusOverHypotenuse * dx,
			endY: endY - radiusOverHypotenuse * dy,
		}
	}

	const {
		startX: arrowStartX,
		startY: arrowStartY,
		endX: arrowEndX,
		endY: arrowEndY,
	} = calculatePerimeterPositions(startX, startY, endX, endY)

	return (
		<Arrow
			points={[arrowStartX, arrowStartY, arrowEndX, arrowEndY]}
			fill="black"
			stroke="black"
			strokeWidth={5}
		/>
	)
}

export default FunctionCallArrow
