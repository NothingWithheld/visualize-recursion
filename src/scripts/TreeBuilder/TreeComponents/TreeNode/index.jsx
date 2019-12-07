import React, { useState } from 'react'
import { Group, Circle } from 'react-konva'
import { nodeRadius } from '../../../nodes/constants'
import PlusButton from '../PlusButton'
import DeleteButton from '../DeleteButton'

const TreeNode = ({
	x,
	y,
	hasNoLeftChild,
	hasNoRightChild,
	addLeftChild,
	addRightChild,
	deleteNode,
	handleHoverToBeDeleted,
	isHoveringToBeDeleted = false,
}) => {
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
				<Circle
					radius={nodeRadius}
					fill="#F0F4F8"
					stroke="#E12D39"
					strokeWidth={isHoveringToBeDeleted ? 3 : 0}
				/>
				{isHovering && (
					<DeleteButton
						y={0}
						deleteNode={handleDelete}
						handleHoverToBeDeleted={handleHoverToBeDeleted}
					/>
				)}
			</Group>
			{hasNoLeftChild && (
				<PlusButton x={-25} y={nodeRadius} addChild={addLeftChild} />
			)}
			{hasNoRightChild && (
				<PlusButton x={25} y={nodeRadius} addChild={addRightChild} />
			)}
		</Group>
	)
}

export default TreeNode
