import { useState, useEffect, useRef } from 'react'
import useNodes from '../../nodes/useNodes'

const useRecursionStepper = scopeGeneratorFunc => {
	const { nodes, makeNode, resetNodes, addChild, addReturnValue } = useNodes()
	const generatorFunc = scopeGeneratorFunc(makeNode, addChild, addReturnValue)
	const [delayMilliseconds, setDelayMilliseconds] = useState(500)
	const [generator, setGenerator] = useState(null)
	const [isStepping, setIsStepping] = useState(false)
	const [isCompleted, setIsCompleted] = useState(false)
	const [stepFuncID, setStepFuncID] = useState(null)

	const stepOnce = generatorArg => {
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

	const startGenerator = startAndStepOnce => (delay, ...args) => {
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
