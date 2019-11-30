export const calculatePerimeterPositions = (
	nodeRadius,
	startX,
	startY,
	endX,
	endY
) => {
	const dx = endX - startX
	const dy = endY - startY
	const hypotenuse = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))

	// scale down the hypotenuse, so the tip of the arrow ends at the node's edge,
	// instead of slightly inside the node
	const scale = 0.88
	const scaledHypotenuse = scale * hypotenuse

	const radiusOverHypotenuse = nodeRadius / hypotenuse
	const radiusOverScaledHypotenuse = nodeRadius / scaledHypotenuse

	return {
		startX: startX + radiusOverHypotenuse * dx,
		startY: startY + radiusOverHypotenuse * dy,
		endX: endX - radiusOverScaledHypotenuse * dx,
		endY: endY - radiusOverScaledHypotenuse * dy,
	}
}
