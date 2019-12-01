import React, { useState } from 'react'
import { Group, Circle } from 'react-konva'
import { nodeRadius } from '../../../nodes/constants'
import PlusButton from '../PlusButton'
import DeleteButton from '../DeleteButton'

const TreeNode = ({ x, y, addChild, allowAdditionalChildren, deleteNode }) => {
	const [isHovering, setIsHovering] = useState(false)

	// when deleting a node, the deleted node and its state seems to be
	// used for its parent node, causing the parent node's delete button to
	// appear, if `setIsHovering(false)` isn't called
	const handleDelete = () => {
		deleteNode()
		setIsHovering(false)
	}

	return (
		<Group x={x} y={y}>
			<Group
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
			>
				<Circle radius={nodeRadius} fill="#F0F4F8" />
				{isHovering && <DeleteButton y={0} deleteNode={handleDelete} />}
			</Group>
			{allowAdditionalChildren && (
				<PlusButton y={nodeRadius} addChild={addChild} />
			)}
		</Group>
	)
}

export default TreeNode
