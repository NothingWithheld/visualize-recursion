import React, { useState } from 'react'
import { Group, Circle } from 'react-konva'
import { nodeRadius } from '../../../nodes/constants'
import PlusButton from '../PlusButton'
import DeleteButton from '../DeleteButton'

const TreeNode = ({ x, y, addChild, allowAdditionalChildren, deleteNode }) => {
	const [isHovering, setIsHovering] = useState(false)

	return (
		<Group x={x} y={y}>
			<Group
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
			>
				<Circle radius={nodeRadius} fill="#F0F4F8" />
				{isHovering && <DeleteButton y={0} deleteNode={deleteNode} />}
			</Group>
			{allowAdditionalChildren && (
				<PlusButton y={nodeRadius} addChild={addChild} />
			)}
		</Group>
	)
}

export default TreeNode
