import React, { useRef, memo } from 'react'
import { Group, Circle, Text, Line } from 'react-konva'
import { nodeRadius } from '../../../nodes/constants'
import useKonvaTextWidth from '../../../Konva/useKonvaTextWidth'
import Konva from 'konva'
import { Option, isNone, getOrElse } from 'fp-ts/es6/Option'
import {
	nodeBackgroundColor,
	nodeOutlineColor,
	nodeHighlightColor,
	waitingColor,
	inspectingColor,
} from '../../../constants'

interface FunctionCallNodeProps {
	readonly x: number
	readonly y: number
	readonly args: Array<[string, string]>
	readonly returnValue: Option<string>
	readonly lastAction: boolean
	readonly isViewingVariables: boolean
	readonly setLayerPosition: (x: number, y: number) => void
	readonly viewVariables: () => void
}

const FunctionCallNode = ({
	x,
	y,
	args,
	returnValue,
	lastAction,
	isViewingVariables,
	setLayerPosition,
	viewVariables,
}: FunctionCallNodeProps): JSX.Element => {
	const [funcNameWidth, funcNameWidthCallback] = useKonvaTextWidth()
	const [returnValueWidth, returnValueWidthCallback] = useKonvaTextWidth()

	if (lastAction) {
		setLayerPosition(-x, -y)
	}

	const circleRef = useRef<Konva.Circle>(null)

	const functionHasNotReturned = isNone(returnValue)

	return (
		<Group
			x={x}
			y={y}
			onClick={viewVariables}
			onMouseEnter={(event) => {
				const container = (event.target as Konva.Stage).getStage().container()
				container.style.cursor = 'pointer'
			}}
			onMouseLeave={(event) => {
				const container = (event.target as Konva.Stage).getStage().container()
				container.style.cursor = 'default'
			}}
		>
			<Circle
				radius={nodeRadius}
				fill={nodeBackgroundColor}
				stroke={
					isViewingVariables
						? inspectingColor
						: lastAction
						? nodeHighlightColor
						: functionHasNotReturned
						? waitingColor
						: nodeOutlineColor
				}
				strokeWidth={5}
				ref={circleRef}
			/>
			<Text
				text={args.map(([, argValue]) => argValue).join(', ')}
				x={-funcNameWidth / 2}
				y={-24}
				fontStyle="bold"
				fontFamily="Roboto"
				fontSize={18}
				ref={funcNameWidthCallback}
			/>
			<Line points={[-10, 0, 10, 0]} stroke={nodeOutlineColor} width={1} />
			<Text
				text={getOrElse(() => 'waiting')(returnValue)}
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

const areEqual = (
	prevProps: FunctionCallNodeProps,
	nextProps: FunctionCallNodeProps
): boolean =>
	prevProps.x === nextProps.x &&
	prevProps.y === nextProps.y &&
	prevProps.args === nextProps.args &&
	prevProps.returnValue === nextProps.returnValue &&
	prevProps.lastAction === nextProps.lastAction &&
	prevProps.isViewingVariables === nextProps.isViewingVariables

export default memo(FunctionCallNode, areEqual)
