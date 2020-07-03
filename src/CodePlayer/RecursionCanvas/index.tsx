import React, { useState } from 'react'
import { Stage, Layer } from 'react-konva'
import FunctionCallNode from './FunctionCallNode'
import FunctionCallArrow from './FunctionCallArrow'
import CallNodeExtraDetails from './CallNodeExtraDetails'
import VariablesWindow from './VariablesWindow'
import Box from '@material-ui/core/Box'
import { preorder, getEdges } from '../../nodes/useNodes/traversals'
import {
	FuncNode,
	PlacedNode,
	iterablePlacedNode,
	eqNode,
} from '../../nodes/types'
import { Option, map, getOrElse, none, some } from 'fp-ts/es6/Option'
import * as R from 'ramda'
import { pipe } from 'fp-ts/es6/pipeable'

interface RecursionCanvasProps {
	readonly treeRoot: Option<PlacedNode<FuncNode>>
}

export const RecursionCanvas = ({
	treeRoot,
}: RecursionCanvasProps): JSX.Element => {
	const [layerX, setLayerX] = useState(0)
	const [layerY, setLayerY] = useState(0)
	const [nodeExtraDetailPositions, setNodeExtraDetailPositions] = useState<
		Array<PlacedNode<FuncNode>>
	>([])
	const [openVariablesNode, setOpenVariablesNode] = useState<
		Option<PlacedNode<FuncNode>>
	>(none)

	const setLayerPosition = (x: number, y: number) => {
		setLayerX(x)
		setLayerY(y)
	}

	const setFunctionCallNode = (
		[node]: [PlacedNode<FuncNode>, unknown],
		i: number
	) => (
		<FunctionCallNode
			{...node}
			isViewingVariables={getOrElse(() => false)(
				map((varNode: PlacedNode<FuncNode>) => eqNode.equals(varNode, node))(
					openVariablesNode
				)
			)}
			setLayerPosition={setLayerPosition}
			viewVariables={() => setOpenVariablesNode(some(node))}
			key={i}
		/>
	)

	const setFunctionCallArrow = ([parent, child]: [
		PlacedNode<FuncNode>,
		PlacedNode<FuncNode>
	]) => (
		<FunctionCallArrow
			startX={parent.x}
			startY={parent.y}
			endX={child.x}
			endY={child.y}
			key={child.nodeID}
		/>
	)

	return (
		<>
			<Box
				margin="12px 8px"
				border="thin solid"
				borderRadius="4px"
				borderColor="#BCCCDC"
				position="relative"
			>
				<Stage
					width={window.innerWidth - 100}
					height={(2 * window.innerHeight) / 3}
					draggable
				>
					<Layer
						x={layerX + window.innerWidth / 2}
						y={layerY + window.innerHeight / 3}
					>
						{pipe(
							treeRoot,
							map(preorder(iterablePlacedNode<FuncNode>())),
							map((nodeList) => nodeList.map(setFunctionCallNode)),
							getOrElse<JSX.Element[] | null>(() => null)
						)}
						{pipe(
							treeRoot,
							map(getEdges(iterablePlacedNode<FuncNode>())),
							map(R.map(setFunctionCallArrow)),
							getOrElse<JSX.Element[] | null>(() => null)
						)}
					</Layer>
				</Stage>
				{nodeExtraDetailPositions.map((positionProps, i) => (
					<CallNodeExtraDetails {...positionProps} key={i} />
				))}
			</Box>
			{getOrElse<JSX.Element | null>(() => null)(
				map((node: PlacedNode<FuncNode>) => <VariablesWindow {...node} />)(
					openVariablesNode
				)
			)}
		</>
	)
}

export default RecursionCanvas
