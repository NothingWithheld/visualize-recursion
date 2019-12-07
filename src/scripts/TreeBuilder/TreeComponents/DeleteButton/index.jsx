import React from 'react'
import { Group, Text, Rect } from 'react-konva'
import useKonvaTextWidth from '../../../Konva/useKonvaTextWidth'

const DeleteButton = ({ y, deleteNode, handleHoverToBeDeleted }) => {
	const [xWidth, xWidthCallback] = useKonvaTextWidth()

	return (
		<Group
			y={y}
			onClick={deleteNode}
			onMouseEnter={() => handleHoverToBeDeleted(true)}
			onMouseLeave={() => handleHoverToBeDeleted(false)}
		>
			<Rect
				fill="#E12D39"
				cornerRadius={4}
				width={30}
				height={30}
				x={-15}
				y={-15}
			/>
			<Text
				text="x"
				fill="#F0F4F8"
				x={-xWidth / 2}
				y={-10}
				fontStyle="bold"
				fontFamily="Roboto"
				fontSize={18}
				ref={xWidthCallback}
			/>
		</Group>
	)
}

export default DeleteButton
