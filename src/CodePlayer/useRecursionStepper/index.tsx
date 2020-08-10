import { useState, useEffect, useRef } from 'react'
import useNodes from '../../nodes/useNodes'
import { curry } from 'ramda'
import { usePrevious } from '../../utils'
import { MakeNodeFunc, NodeGeneratorFunc } from '../../nodes/useNodes/utils'
import { Option } from 'fp-ts/es6/Option'
import { FuncNode, PlacedNode } from '../../nodes/types'
import { defaultDelayMilliseconds } from '../constants'

interface UseRecursionStepperReturn {
	readonly treeRoot: Option<PlacedNode<FuncNode>>
	readonly play: () => void
	readonly pause: () => void
	readonly reset: () => void
	readonly isStepping: boolean
	readonly canStepForward: boolean
	readonly canStepBackward: boolean
	readonly stepForward: () => void
	readonly stepBackward: () => void
	readonly isReset: boolean
	readonly start: (args: any[]) => void
	readonly startAndStepOnce: (args: any[]) => void
	readonly setDelay: (delay: number) => void
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
	const delayMilliseconds = useRef(defaultDelayMilliseconds)
	const [isStepping, setIsStepping] = useState(false)
	const stepFuncTimerId = useRef<number | undefined>(undefined)

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

		stepFuncTimerId.current = window.setTimeout(function stepFunc() {
			if (!latestIsStepping.current || !latestCanStepForward.current) {
				setIsStepping(false)
				return
			}

			stepForward()
			stepFuncTimerId.current = window.setTimeout(
				stepFunc,
				delayMilliseconds.current
			)
		}, delayMilliseconds.current)

		return () => clearTimeout(stepFuncTimerId.current)
	}, [isStepping, stepForward])

	const start = curry((andStartStepping, args) => {
		setupNodes(scopeGeneratorFunc(makeNode), args)

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
		clearTimeout(stepFuncTimerId.current)
	}

	const reset = (): void => {
		clearTimeout(stepFuncTimerId.current)
		resetNodes()
		setIsStepping(false)
	}

	const setDelay = (delay: number): void => {
		delayMilliseconds.current = delay
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
		setDelay,
	}
}

export default useRecursionStepper
