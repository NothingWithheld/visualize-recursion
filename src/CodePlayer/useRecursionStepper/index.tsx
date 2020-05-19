import { useState, useEffect, useRef } from 'react'
import useNodes, { useNodesNew } from '../../nodes/useNodes'
import { curry } from 'ramda'
import { usePrevious } from '../../utils'

const useRecursionStepper = (scopeGeneratorFunc) => {
	const { nodes, makeNode, resetNodes, addChild, addReturnValue } = useNodes()
	const generatorFunc = scopeGeneratorFunc(makeNode, addChild, addReturnValue)
	const [delayMilliseconds, setDelayMilliseconds] = useState(500)
	const [generator, setGenerator] = useState(null)
	const [isStepping, setIsStepping] = useState(false)
	const [isCompleted, setIsCompleted] = useState(false)
	const [stepFuncID, setStepFuncID] = useState(null)

	const stepOnce = (generatorArg) => {
		const iteratorRes = generatorArg.next()
		if (iteratorRes.done) {
			setIsCompleted(true)
			setIsStepping(false)
		}
	}

	const handleStepOnce = () => {
		if (isCompleted || !generator) return

		stepOnce(generator)
	}

	const startGenerator = (startAndStepOnce) => (delay, ...args) => {
		setDelayMilliseconds(delay)
		const createdGenerator = generatorFunc(...args)
		setGenerator(createdGenerator)

		if (startAndStepOnce) {
			stepOnce(createdGenerator)
		} else {
			setIsStepping(true)
		}
	}

	const latestIsStepping = useRef(isStepping)
	useEffect(() => {
		latestIsStepping.current = isStepping

		const initialClickTimerID = setTimeout(function stepFunc() {
			if (!latestIsStepping.current) return

			handleStepOnce()
			const recursiveTimerID = setTimeout(stepFunc, delayMilliseconds)
			setStepFuncID(recursiveTimerID)
		}, 0)
		setStepFuncID(initialClickTimerID)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isStepping])

	const play = () => {
		if (!isCompleted) {
			setIsStepping(true)
		}
	}

	const pause = () => {
		setIsStepping(false)
	}

	const reset = () => {
		clearTimeout(stepFuncID)
		setStepFuncID(null)
		resetNodes()
		setGenerator(null)
		setIsStepping(false)
		setIsCompleted(false)
	}

	return {
		nodes,
		play,
		pause,
		reset,
		isStepping,
		isCompleted,
		isStarted: generator !== null,
		start: startGenerator(false),
		startAndStepOnce: startGenerator(true),
		step: handleStepOnce,
	}
}

export default useRecursionStepper

export const useRecursionStepperNew = (scopeGeneratorFunc) => {
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
	} = useNodesNew()
	const previousIsReset = usePrevious(isReset)
	const [delayMilliseconds, setDelayMilliseconds] = useState(500)
	const [isStepping, setIsStepping] = useState(false)
	const [stepFuncID, setStepFuncID] = useState(null)

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

	const play = () => {
		if (canStepForward) {
			setIsStepping(true)
		}
	}

	const pause = () => {
		setIsStepping(false)
		clearTimeout(stepFuncID)
	}

	const reset = () => {
		clearTimeout(stepFuncID)
		setStepFuncID(null)
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
