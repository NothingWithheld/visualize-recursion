import React, { useState } from 'react'
import { Group, Text, Rect, Circle } from 'react-konva'
import useKonvaTextWidth from '../../../Konva/useKonvaTextWidth'

const PlusButton = ({ y, addChild }) => {
	const [plusWidth, plusWidthCallback] = useKonvaTextWidth()
	const [isHovering, setIsHovering] = useState(false)

	// when adding a new child node, the current node and its state seems to be
	// used for the child node, causing the child node's add child button to
	// appear, if `setIsHovering(false)` isn't called
	const handleClick = () => {
		addChild()
		setIsHovering(false)
	}

	return (
		<Group y={y}>
			{isHovering ? (
				<Group onClick={handleClick} onMouseLeave={() => setIsHovering(false)}>
					<Rect
						fill="#B990FF"
						cornerRadius={4}
						width={40}
						height={20}
						x={-20}
					/>
					<Text
						text="+"
						fill="white"
						x={-plusWidth / 2}
						y={1}
						fontStyle="bold"
						fontFamily="Roboto"
						fontSize={18}
						ref={plusWidthCallback}
					/>
				</Group>
			) : (
				<Circle
					onMouseEnter={() => setIsHovering(true)}
					fill="#B990FF"
					radius={5}
					y={10}
				/>
			)}
		</Group>
	)
}

export default PlusButton
