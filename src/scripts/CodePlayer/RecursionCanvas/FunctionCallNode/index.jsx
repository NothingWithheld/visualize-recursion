import React from 'react'
import { Group, Circle, Text } from 'react-konva'
import { nodeRadius } from '../../../constants'
import useKonvaTextWidth from '../useKonvaTextWidth'

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
				fill="grey"
				stroke={
					lastAction ? 'orange' : returnValue === null ? 'yellow' : 'green'
				}
				strokeWidth={7}
			/>
			<Text
				text={`${funcName}(${args.join(', ')})`}
				x={-funcNameWidth / 2}
				y={-20}
				ref={funcNameWidthCallback}
			/>
			<Text
				text={returnValue || 'waiting'}
				x={-returnValueWidth / 2}
				y={20}
				ref={returnValueWidthCallback}
			/>
		</Group>
	)
}

export default FunctionCallNode
