import { useState, useRef, useEffect, useReducer, useCallback } from 'react'
import drawTree from '../tree_drawing/reingold_tilford'
import {
	getMakeNodeFunc,
	functionProgressReducer,
	defaultFunctionProgressState,
} from './utils'

export const useNodes = () => {
	const [makeNode, setMakeNode] = useState(() => getMakeNodeFunc())
	const [nodeState, nodeDispatch] = useReducer(
		functionProgressReducer,
		defaultFunctionProgressState
	)

	const { treeRoot, isReset, canStepForward, canStepBackward } = nodeState
	const [drawnTree, setDrawnTree] = useState(treeRoot && drawTree(treeRoot))

	useEffect(() => setDrawnTree(treeRoot && drawTree(treeRoot)), [treeRoot])

	const setupNodes = useCallback(
		(generatorFunc, args) =>
			nodeDispatch({ type: 'setup', generatorFunc, args }),
		[]
	)

	const stepForward = useCallback(
		() => nodeDispatch({ type: 'stepForward' }),
		[]
	)

	const stepBackward = useCallback(
		() => nodeDispatch({ type: 'stepBackward' }),
		[]
	)

	const resetNodes = useCallback(() => {
		nodeDispatch({ type: 'reset' })
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
