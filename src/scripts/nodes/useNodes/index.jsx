import { useState, useRef, useEffect, useReducer, useCallback } from 'react'
import drawTree from '../tree_drawing/reingold_tilford'
import {
	getMakeNodeFunc,
	functionProgressReducer,
	defaultFunctionProgressState,
} from './utils'

const createNodeTree = (nodeArray, rootIndex = 0) => {
	const getNodeTree = nodeIndex => {
		const { childIndices, ...node } = nodeArray[nodeIndex]
		const children = childIndices.map(getNodeTree)

		const nodeWithChildReferences = { ...node, children }
		return nodeWithChildReferences
	}

	return getNodeTree(rootIndex)
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

const useNodes = (startingNodes = []) => {
	const [nodeArray, setNodeArray] = useState(startingNodes)
	const [makeNode, setMakeNode] = useState(() =>
		getMakeNodeFunc(startingNodes.length)
	)
	const latestNodeArray = useRef(nodeArray)

	useEffect(() => {
		latestNodeArray.current = nodeArray
	}, [nodeArray])

	const addChildToNodeArray = (parent, child) => {
		if (latestNodeArray.current.length > 0) {
			const parentNodeIndex = latestNodeArray.current.findIndex(
				node => node.nodeID === parent.nodeID
			)
			const parentNode = latestNodeArray.current[parentNodeIndex]

			const newParentNode = {
				...parentNode,
				childIndices: [
					...parentNode.childIndices,
					latestNodeArray.current.length,
				],
			}
			const newNodeArray = [
				...latestNodeArray.current
					.map((node, i) => (i === parentNodeIndex ? newParentNode : node))
					.map(node => ({ ...node, lastAction: false })),
				{ ...child, childIndices: [], lastAction: true },
			]

			setNodeArray(newNodeArray)
		} else {
			setNodeArray([{ ...child, childIndices: [], lastAction: true }])
		}
	}

	const addReturnValue = (nodeToUpdate, returnValue) => {
		const nodeIndex = latestNodeArray.current.findIndex(
			node => node.nodeID === nodeToUpdate.nodeID
		)

		const updatedNode = {
			...latestNodeArray.current[nodeIndex],
			returnValue,
			lastAction: true,
		}
		const newNodeArray = latestNodeArray.current
			.map(node => ({ ...node, lastAction: false }))
			.map((node, i) => (i === nodeIndex ? updatedNode : node))

		setNodeArray(newNodeArray)
	}

	const resetNodes = () => {
		setNodeArray(startingNodes)
		setMakeNode(startingNodes.length)
	}

	return {
		addReturnValue,
		resetNodes,
		makeNode,
		nodes:
			nodeArray.length > 0
				? flattenTree(drawTree(createNodeTree(nodeArray)))
				: [],
		addChild: addChildToNodeArray,
	}
}

export default useNodes

export const useNodesNew = () => {
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
