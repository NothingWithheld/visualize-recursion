import { useState, useRef, useEffect } from 'react'

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
		console.log('addReturnValue', {
			nodeArray: latestNodeArray.current,
			nodeToUpdate,
			returnValue,
		})
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

	const getNodeTree = nodeIndex => {
		const { childIndices, ...node } = nodeArray[nodeIndex]
		const children = childIndices.map(getNodeTree)

		const nodeWithChildReferences = { ...node, children }
		return nodeWithChildReferences
	}

	return {
		addReturnValue,
		resetNodes,
		nodeTree: nodeArray.length > 0 ? getNodeTree(0) : null,
		addChild: addChildToNodeArray,
	}
}

export default useNodes
