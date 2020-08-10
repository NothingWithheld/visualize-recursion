import React, { useState, useEffect, useCallback } from 'react'
import { Stage, Layer } from 'react-konva'
import FunctionCallNode from './FunctionCallNode'
import FunctionCallArrow from './FunctionCallArrow'
import VariablesWindow from './VariablesWindow'
import Box from '@material-ui/core/Box'
import { preorder, getEdges } from '../../nodes/useNodes/traversals'
import {
	FuncNode,
	PlacedNode,
	iterablePlacedNode,
	eqNode,
} from '../../nodes/types'
import { Option, map, getOrElse, none, some, isNone } from 'fp-ts/es6/Option'
import * as R from 'ramda'
import { pipe } from 'fp-ts/es6/pipeable'
import useRefreshLayerOnFontLoad from '../../Konva/useRefreshLayerOnFontLoad'

interface RecursionCanvasProps {
	readonly treeRoot: Option<PlacedNode<FuncNode>>
}

export const RecursionCanvas = ({
	treeRoot,
}: RecursionCanvasProps): JSX.Element => {
	const [layerX, setLayerX] = useState(0)
	const [layerY, setLayerY] = useState(0)
	const [draggedX, setDraggedX] = useState(0)
	const [draggedY, setDraggedY] = useState(0)
	const [openVariablesNode, setOpenVariablesNode] = useState<
		Option<PlacedNode<FuncNode>>
	>(none)

	const layerRef = useRefreshLayerOnFontLoad(treeRoot)

	const isEqualToVariableNode = useCallback(
		(node: PlacedNode<FuncNode>): boolean =>
			pipe(
				openVariablesNode,
				map((varNode: PlacedNode<FuncNode>) => eqNode.equals(varNode, node)),
				getOrElse<boolean>(() => false)
			),
		[openVariablesNode]
	)

	useEffect(() => {
		const [possibleMatch] = pipe(
			treeRoot,
			map(preorder(iterablePlacedNode<FuncNode>())),
			map((nodeList) => nodeList.map(([node]) => node)),
			map((nodeList) => nodeList.filter(isEqualToVariableNode)),
			getOrElse<PlacedNode<FuncNode>[]>(() => [])
		)

		if (possibleMatch !== undefined) {
			const isSameObject = pipe(
				openVariablesNode,
				map((node: PlacedNode<FuncNode>) => node === possibleMatch),
				getOrElse<boolean>(() => false)
			)

			if (!isSameObject) {
				setOpenVariablesNode(some(possibleMatch))
			}
		} else if (!isNone(openVariablesNode)) {
			setOpenVariablesNode(none)
		}
	}, [treeRoot, isEqualToVariableNode, openVariablesNode])

	const setLayerPosition = (x: number, y: number) => {
		setLayerX(x - draggedX)
		setLayerY(y - draggedY)
	}

	const setFunctionCallNode = (
		[node]: [PlacedNode<FuncNode>, unknown],
		i: number
	) => (
		<FunctionCallNode
			{...node}
			isViewingVariables={isEqualToVariableNode(node)}
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
					onDragEnd={(event) => {
						const { x, y } = event.target.position()
						setDraggedX(x)
						setDraggedY(y)
					}}
				>
					<Layer
						x={layerX + window.innerWidth / 2}
						y={layerY + window.innerHeight / 3}
						ref={layerRef}
					>
						{pipe(
							treeRoot,
							map(getEdges(iterablePlacedNode<FuncNode>())),
							map(R.map(setFunctionCallArrow)),
							getOrElse<JSX.Element[] | null>(() => null)
						)}
						{pipe(
							treeRoot,
							map(preorder(iterablePlacedNode<FuncNode>())),
							map((nodeList) => nodeList.map(setFunctionCallNode)),
							getOrElse<JSX.Element[] | null>(() => null)
						)}
					</Layer>
				</Stage>
			</Box>
			{getOrElse<JSX.Element | null>(() => null)(
				map((node: PlacedNode<FuncNode>) => (
					<VariablesWindow
						{...node}
						closeWindow={() => setOpenVariablesNode(none)}
					/>
				))(openVariablesNode)
			)}
		</>
	)
}

export default RecursionCanvas
