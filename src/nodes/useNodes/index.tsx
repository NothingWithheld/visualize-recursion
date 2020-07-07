import { useState, useEffect, useReducer, useCallback } from 'react'
import drawTree from '../tree_drawing/reingold_tilford'
import {
	getMakeNodeFunc,
	functionProgressReducer,
	defaultFunctionProgressState,
	FunctionProgressActions,
	NodeGeneratorFunc,
	MakeNodeFunc,
} from './utils'
import { map, Option } from 'fp-ts/es6/Option'
import { FuncNode, PlacedNode } from '../types'

interface UseNodesReturn {
	readonly setupNodes: (generatorFunc: NodeGeneratorFunc, args: any[]) => void
	readonly stepForward: () => void
	readonly stepBackward: () => void
	readonly resetNodes: () => void
	readonly makeNode: MakeNodeFunc
	readonly treeRoot: Option<PlacedNode<FuncNode>>
	readonly isReset: boolean
	readonly canStepForward: boolean
	readonly canStepBackward: boolean
}

export const useNodes = (): UseNodesReturn => {
	const [makeNode, setMakeNode] = useState(() => getMakeNodeFunc())
	const [nodeState, nodeDispatch] = useReducer(
		functionProgressReducer,
		defaultFunctionProgressState
	)

	const { sentry, isReset, canStepForward, canStepBackward } = nodeState
	const [drawnTree, setDrawnTree] = useState(() => map(drawTree)(sentry.tree))

	useEffect(() => setDrawnTree(map(drawTree)(sentry.tree)), [sentry])

	const setupNodes = useCallback(
		(generatorFunc: NodeGeneratorFunc, argValues: any[]) =>
			nodeDispatch({
				type: FunctionProgressActions.Setup,
				generatorFunc,
				argValues,
			}),
		[]
	)

	const stepForward = useCallback(
		() => nodeDispatch({ type: FunctionProgressActions.StepForward }),
		[]
	)

	const stepBackward = useCallback(
		() => nodeDispatch({ type: FunctionProgressActions.StepBackward }),
		[]
	)

	const resetNodes = useCallback(() => {
		nodeDispatch({ type: FunctionProgressActions.Reset })
		setMakeNode(() => getMakeNodeFunc())
	}, [])

	return {
		setupNodes,
		stepForward,
		stepBackward,
		resetNodes,
		makeNode,
		treeRoot: drawnTree,
		isReset,
		canStepForward,
		canStepBackward,
	}
}

export default useNodes
