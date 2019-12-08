import { useState, useEffect, useRef } from 'react'

const useTreeAlgoStepper = algoGeneratorFunc => {
	const [isInitialized, setIsInitialized] = useState(false)
	const [isStepping, setIsStepping] = useState(false)
	const [delayMilliseconds, setDelayMilliseconds] = useState(500)
	const [stepFuncID, setStepFuncID] = useState(null)
	const [calledNodes, setCalledNodes] = useState([null])
	const [callIdx, setCallIdx] = useState(0)

	const latestIsStepping = useRef(isStepping)
	const latestCallIdx = useRef(callIdx)

	const initialize = treeRoot => {
		const initializedCalledNodes = [{}, ...algoGeneratorFunc(treeRoot)]
		setCalledNodes(initializedCalledNodes)
		setIsInitialized(true)

		return initializedCalledNodes
	}

	const canStepForward = (calledNodesArg, callIdxArg) =>
		callIdxArg < calledNodesArg.length - 1
	const canStepBackward = () => callIdx > 0

	const stepForward = (calledNodesArg, callIdxArg) => {
		if (canStepForward(calledNodesArg, callIdxArg)) {
			setCallIdx(callIdxArg + 1)
			return true
		}

		return false
	}
	const stepBackward = () => {
		if (canStepBackward()) {
			setCallIdx(callIdx - 1)
		}
	}

	useEffect(() => {
		latestCallIdx.current = callIdx
	}, [callIdx])

	useEffect(() => {
		latestIsStepping.current = isStepping

		const initialClickTimerID = setTimeout(function stepFunc() {
			if (!latestIsStepping.current) return

			const stepSucceeded = stepForward(calledNodes, latestCallIdx.current)
			if (stepSucceeded) {
				const recursiveTimerID = setTimeout(stepFunc, delayMilliseconds)
				setStepFuncID(recursiveTimerID)
			} else {
				setIsStepping(false)
			}
		}, 0)
		setStepFuncID(initialClickTimerID)
	}, [isStepping])

	const start = startAndStepOnce => treeRoot => {
		if (startAndStepOnce) {
			const initializedCalledNodes = initialize(treeRoot)
			stepForward(initializedCalledNodes, 0)
		} else {
			initialize(treeRoot)
			setIsStepping(true)
		}
	}

	const play = () => {
		if (canStepForward(calledNodes, callIdx)) {
			setIsStepping(true)
		}
	}

	const pause = () => setIsStepping(false)

	const reset = () => {
		clearTimeout(stepFuncID)
		setStepFuncID(null)
		setCalledNodes([null])
		setCallIdx(0)
		setIsStepping(false)
		setIsInitialized(false)
	}

	return {
		calledNodeID: calledNodes[callIdx],
		isInitialized,
		isStepping,
		canStepForward: canStepForward(calledNodes, callIdx),
		canStepBackward: canStepBackward(),
		start: start(false),
		startAndStepOnce: start(true),
		play,
		pause,
		stepForward: () => stepForward(calledNodes, callIdx),
		stepBackward,
		reset,
	}
}

export default useTreeAlgoStepper
