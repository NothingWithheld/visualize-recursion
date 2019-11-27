import { useState, useRef, useEffect } from 'react'
import drawTree from '../tree_drawing/reingold_tilford'

const createNodeTree = nodeArray => {
	const getNodeTree = nodeIndex => {
		const { childIndices, ...node } = nodeArray[nodeIndex]
		const children = childIndices.map(getNodeTree)

		const nodeWithChildReferences = { ...node, children }
		return nodeWithChildReferences
	}

	return getNodeTree(0)
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

const useNodes = () => {
	const [nodeArray, setNodeArray] = useState([])
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

	const resetNodes = () => setNodeArray([])

	return {
		addReturnValue,
		resetNodes,
		nodes:
			nodeArray.length > 0
				? flattenTree(drawTree(createNodeTree(nodeArray)))
				: [],
		addChild: addChildToNodeArray,
	}
}

export default useNodes