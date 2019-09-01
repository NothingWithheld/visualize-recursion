import { useState, useEffect, useRef } from 'react'
import useNodes from '../useNodes'
import drawTree from '../../node_tree/tree_drawing/minimum_width'

const useRecursionStepper = scopeGeneratorFunc => {
	const {
		nodeTree: treeRoot,
		resetNodes,
		addChild,
		addReturnValue,
	} = useNodes()
	console.log({ treeRoot })
	const generatorFunc = scopeGeneratorFunc(addChild, addReturnValue)
	const [delayMilliseconds, setDelayMilliseconds] = useState(500)
	const [generator, setGenerator] = useState(null)
	const [isStepping, setIsStepping] = useState(false)
	const [isCompleted, setIsCompleted] = useState(false)

	const stepOnce = () => {
		if (!generator) return

		const iteratorRes = generator.next()
		if (iteratorRes.done) {
			setIsCompleted(true)
			setIsStepping(false)
		}
	}

	const startGenerator = (delay, ...args) => {
		setDelayMilliseconds(delay)
		setGenerator(generatorFunc(...args))
		setIsStepping(true)
	}

	const latestIsStepping = useRef(isStepping)
	useEffect(() => {
		latestIsStepping.current = isStepping

		setTimeout(function stepFunc() {
			if (!latestIsStepping.current) return

			stepOnce()
			setTimeout(stepFunc, delayMilliseconds)
		}, 0)
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
		console.log('reset')
		resetNodes()
		setGenerator(null)
		setIsStepping(false)
		setIsCompleted(false)
	}

	const flattenTree = treeRoot => {
		const flattenedTree = []

		function flatten(nodeToFlatten) {
			const { children, ...node } = nodeToFlatten
			const childIndices = children.map(flatten)

			const thisNodeIndex = flattenedTree.length
			flattenedTree.push({ ...node, childIndices })

			return thisNodeIndex
		}

		flatten(treeRoot)
		return flattenedTree
	}

	const nodesWithPositions = treeRoot && drawTree(treeRoot)

	return {
		play,
		pause,
		reset,
		isStepping,
		isCompleted,
		isStarted: generator !== null,
		start: startGenerator,
		step: stepOnce,
		nodes: nodesWithPositions ? flattenTree(nodesWithPositions) : [],
	}
}

export default useRecursionStepper
