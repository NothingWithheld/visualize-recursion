import React from 'react'
import { Group, Circle, Text, Line } from 'react-konva'
import { nodeRadius } from '../../../nodes/constants'
import useKonvaTextWidth from '../../../Konva/useKonvaTextWidth'

const FunctionCallNode = ({
	x,
	y,
	returnValue,
	funcName,
	args,
	lastAction,
	setLayerPosition,
}) => {
	const [funcNameWidth, funcNameWidthCallback] = useKonvaTextWidth()
	const [returnValueWidth, returnValueWidthCallback] = useKonvaTextWidth()

	if (lastAction) {
		setLayerPosition(-x, -y)
	}

	return (
		<Group x={x} y={y}>
			<Circle
				radius={nodeRadius}
				fill="#F0F4F8"
				stroke={
					lastAction ? '#B990FF' : returnValue === null ? '#FADB5F' : '#BCCCDC'
				}
				strokeWidth={5}
			/>
			<Text
				text={args.join(', ')}
				x={-funcNameWidth / 2}
				y={-24}
				fontStyle="bold"
				fontFamily="Roboto"
				fontSize={18}
				ref={funcNameWidthCallback}
			/>
			<Line points={[-10, 0, 10, 0]} stroke="#BCCCDC" width={1} />
			<Text
				text={returnValue !== null ? returnValue.toString() : 'waiting'}
				x={-returnValueWidth / 2}
				y={12}
				fontStyle="bold"
				fontFamily="Roboto"
				fontSize={returnValue === null ? 14 : 18}
				ref={returnValueWidthCallback}
			/>
		</Group>
	)
}

export default FunctionCallNode
