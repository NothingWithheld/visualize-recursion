import { nodeRadius } from '../../../constants'

function drawTreeWithMinimumWidth(treeRoot) {
	const nextPositions = []
	const distance = 2.5 * nodeRadius

	function draw(node, depth = 0) {
		const children = node.children.map(child => draw(child, depth + 1))

		while (depth >= nextPositions.length) {
			nextPositions.push(0)
		}

		const updatedNode = {
			...node,
			children,
			x: nextPositions[depth],
			y: depth * distance,
		}

		nextPositions[depth] += distance
		return updatedNode
	}

	return draw(treeRoot)
}

export default drawTreeWithMinimumWidth
