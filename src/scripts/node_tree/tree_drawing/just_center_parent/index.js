import { nodeRadius } from '../../../constants'
import { hasChildren, hasSingleChild } from '../helpers'

function drawTreeJustCenterParent(treeRoot) {
	const nextOpenPositions = []
	const offsetsFor = []
	const distance = 2.5 * nodeRadius

	function draw(node, depth = 0) {
		const children = node.children.map(child => draw(child, depth + 1))

		while (depth >= nextOpenPositions.length) {
			nextOpenPositions.push(0)
			offsetsFor.push(0)
		}

		let positionWithoutOffset
		if (!hasChildren(node)) {
			positionWithoutOffset = nextOpenPositions[depth]
		} else if (hasSingleChild(node)) {
			positionWithoutOffset = children[0].x
		} else {
			positionWithoutOffset =
				(children[0].x + children[children.length - 1].x) / 2
		}

		const newNode = {
			...node,
			children,
			x: Math.max(
				positionWithoutOffset,
				nextOpenPositions[depth] + offsetsFor[depth]
			),
			y: depth * distance,
			offset: offsetsFor[depth],
		}

		const gapToNextOpenSpace = positionWithoutOffset - nextOpenPositions[depth]
		offsetsFor[depth] = Math.max(offsetsFor[depth], gapToNextOpenSpace)

		nextOpenPositions[depth] += distance
		return newNode
	}

	return draw(treeRoot)
}

export default drawTreeJustCenterParent
