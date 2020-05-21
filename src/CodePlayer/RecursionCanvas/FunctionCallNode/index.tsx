import React, { useRef } from 'react'
import { Group, Circle, Text, Line } from 'react-konva'
import { nodeRadius } from '../../../nodes/constants'
import useKonvaTextWidth from '../../../Konva/useKonvaTextWidth'
import { hasNotReturned } from '../../../nodes/constants'
import Konva from 'konva'

interface FunctionCallNodeProps {
	readonly x: number
	readonly y: number
	readonly returnValue: any
	readonly funcName: string
	readonly args: Array<[string, any]>
	readonly lastAction: boolean
	readonly setLayerPosition: (x: number, y: number) => void
	readonly openExtraDetails: (x: number, y: number) => void
}

const FunctionCallNode = ({
	x,
	y,
	returnValue,
	funcName,
	args,
	lastAction,
	setLayerPosition,
	openExtraDetails,
}: FunctionCallNodeProps) => {
	const [funcNameWidth, funcNameWidthCallback] = useKonvaTextWidth()
	const [returnValueWidth, returnValueWidthCallback] = useKonvaTextWidth()

	if (lastAction) {
		setLayerPosition(-x, -y)
	}

	const circleRef = useRef<Konva.Circle>(null)
	const handleClick = () => {
		if (circleRef.current !== null) {
			const { x, y } = circleRef.current.getAbsolutePosition()

			openExtraDetails(x, y)
		}
	}

	const functionHasNotReturned = returnValue === hasNotReturned

	return (
		<Group x={x} y={y}>
			<Circle
				radius={nodeRadius}
				fill="#F0F4F8"
				stroke={
					lastAction
						? '#B990FF'
						: functionHasNotReturned
						? '#FADB5F'
						: '#BCCCDC'
				}
				strokeWidth={5}
				ref={circleRef}
				onClick={handleClick}
			/>
			<Text
				text={Object.values(args).join(', ')}
				x={-funcNameWidth / 2}
				y={-24}
				fontStyle="bold"
				fontFamily="Roboto"
				fontSize={18}
				ref={funcNameWidthCallback}
			/>
			<Line points={[-10, 0, 10, 0]} stroke="#BCCCDC" width={1} />
			<Text
				text={functionHasNotReturned ? 'waiting' : returnValue.toString()}
				x={-returnValueWidth / 2}
				y={12}
				fontStyle="bold"
				fontFamily="Roboto"
				fontSize={functionHasNotReturned ? 14 : 18}
				ref={returnValueWidthCallback}
			/>
		</Group>
	)
}

export default FunctionCallNode
