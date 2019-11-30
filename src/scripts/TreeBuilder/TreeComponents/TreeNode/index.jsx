import React from 'react'
import { Group, Circle } from 'react-konva'
import { nodeRadius } from '../../../nodes/constants'
import PlusButton from '../PlusButton'

const TreeNode = ({ x, y, addChild, allowAdditionalChildren }) => {
	return (
		<Group x={x} y={y}>
			<Circle radius={nodeRadius} fill="#F0F4F8" />
			{allowAdditionalChildren && (
				<PlusButton y={nodeRadius} addChild={addChild} />
			)}
		</Group>
	)
}

export default TreeNode
