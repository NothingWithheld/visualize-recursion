import { useState, useEffect, useRef } from 'react'
import useNodes from '../../nodes/useNodes'
import { curry } from 'ramda'
import { usePrevious } from '../../utils'
import { MakeNodeFunc, NodeGeneratorFunc } from '../../nodes/useNodes/utils'
import { Option } from 'fp-ts/es6/Option'
import { FuncNode } from '../../nodes/types'

interface UseRecursionStepperReturn {
	readonly treeRoot: Option<FuncNode>
	readonly play: () => void
	readonly pause: () => void
	readonly reset: () => void
	readonly isStepping: boolean
	readonly canStepForward: boolean
	readonly canStepBackward: boolean
	readonly stepForward: () => void
	readonly stepBackward: () => void
	readonly isReset: boolean
	readonly start: (args: any[], delayMilliseconds: number) => void
	readonly startAndStepOnce: (args: any[], delayMilliseconds: number) => void
}

export const useRecursionStepper = (
	scopeGeneratorFunc: (makeNode: MakeNodeFunc) => NodeGeneratorFunc
): UseRecursionStepperReturn => {
	const {
		treeRoot,
		resetNodes,
		isReset,
		stepForward,
		stepBackward,
		setupNodes,
		makeNode,
		canStepForward,
		canStepBackward,
	} = useNodes()
	const previousIsReset = usePrevious(isReset)
	const [delayMilliseconds, setDelayMilliseconds] = useState(500)
	const [isStepping, setIsStepping] = useState(false)
	const [stepFuncID, setStepFuncID] = useState<number | undefined>(undefined)

	// immediately step once on first start/play
	useEffect(() => {
		if (!isReset && previousIsReset === true && canStepForward) {
			stepForward()
		}
	}, [isReset, previousIsReset, canStepForward, stepForward])

	const latestCanStepForward = useRef(canStepForward)
	useEffect(() => {
		latestCanStepForward.current = canStepForward
	}, [canStepForward])

	const latestIsStepping = useRef(isStepping)
	useEffect(() => {
		latestIsStepping.current = isStepping

		const initialClickTimerID = setTimeout(function stepFunc() {
			if (!latestIsStepping.current || !latestCanStepForward.current) {
				setIsStepping(false)
				return
			}

			stepForward()
			const recursiveTimerID = setTimeout(stepFunc, delayMilliseconds)
			setStepFuncID(recursiveTimerID)
		}, delayMilliseconds)
		setStepFuncID(initialClickTimerID)
	}, [isStepping, delayMilliseconds, stepForward])

	const start = curry((andStartStepping, args, delayMilliseconds) => {
		setupNodes(scopeGeneratorFunc(makeNode), args)
		setDelayMilliseconds(delayMilliseconds)
		if (andStartStepping) {
			setIsStepping(true)
		}
	})

	const play = (): void => {
		if (canStepForward) {
			setIsStepping(true)
		}
	}

	const pause = (): void => {
		setIsStepping(false)
		clearTimeout(stepFuncID)
	}

	const reset = (): void => {
		clearTimeout(stepFuncID)
		setStepFuncID(undefined)
		resetNodes()
		setIsStepping(false)
	}

	return {
		treeRoot,
		play,
		pause,
		reset,
		isStepping,
		canStepForward,
		canStepBackward,
		stepForward,
		stepBackward,
		isReset,
		start: start(true),
		startAndStepOnce: start(false),
	}
}

export default useRecursionStepper
