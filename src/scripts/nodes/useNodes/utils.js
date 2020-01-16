import { identity, compose, curry } from 'ramda'
import { isSameNode } from '../utils'
import { hasNotReturned, notYetAssigned, noParentNode } from '../constants'

const setLastAction = node => ({ ...node, lastAction: true })

const unsetLastAction = node => ({ ...node, lastAction: false })

const updateTree = (updateFuncs, node) => {
	console.log({ node })
	if (node === null) return null

	const updateFunc = updateFuncs[node.nodeID] || unsetLastAction
	const updatedNode = updateFunc(node)
	console.log({ updatedNode })
	const updatedChildren = updatedNode.children.map(child =>
		updateTree(updateFuncs, child)
	)

	return { ...updatedNode, children: updatedChildren }
}

const handleTreeUpdates = curry((updateFuncs, treeRoot) => {
	console.log({ treeRoot, updateFuncs })
	if (updateFuncs[noParentNode]) {
		return updateFuncs[noParentNode]()
	}

	return updateTree(updateFuncs, treeRoot)
})

const addChildToParent = curry((child, parent) => ({
	...parent,
	children: [...parent.children, child],
}))

const removeChildFromParent = curry((childToRemove, parent) => ({
	...parent,
	children: parent.children.filter(child => !isSameNode(child, childToRemove)),
}))

const addReturnValue = curry((returnValue, node) => ({ ...node, returnValue }))

const removeReturnValue = node => ({ ...node, returnValue: hasNotReturned })

const addVariableDetails = curry((variableDetails, node) => ({
	...node,
	variableDetails: { ...node.variableDetails, ...variableDetails },
}))

const revertVariableDetails = curry((variableDetails, node) => {
	const notYetAssignedVariableDetails = Object.fromEntries(
		Object.keys(variableDetails).map(variableName => [
			variableName,
			notYetAssigned,
		])
	)

	return {
		...node,
		variableDetails: {
			...node.variableDetails,
			...notYetAssignedVariableDetails,
		},
	}
})

export const defaultFunctionProgressState = {
	forwardUpdateFuncs: [],
	backwardUpdateFuncs: [],
	curIndex: 0,
	treeRoot: null,
	isReset: true,
	canStepForward: false,
	canStepBackward: false,
}

export const functionProgressReducer = (state, action) => {
	switch (action.type) {
		case 'reset':
			return defaultFunctionProgressState
		case 'setup': {
			if (!state.isReset) {
				throw new Error('should reset before new setup')
			}
			const { args, generatorFunc } = action
			const nodeEvents = [...generatorFunc({ nodeID: noParentNode }, ...args)]
			console.log({ state, action, nodeEvents })

			const forwardUpdateFuncs = [
				{},
				...nodeEvents.map(eventObj => {
					const updateFuncsForEvents = Object.entries(eventObj).map(
						([nodeID, events]) => [
							nodeID,
							events.reduce((updateFunc, event) => {
								if (event.isAddToParent) {
									if (nodeID === noParentNode)
										return compose(
											setLastAction,
											() => event.childNode,
											updateFunc
										)

									return compose(
										unsetLastAction,
										addChildToParent(event.childNode),
										updateFunc
									)
								} else if (event.isAddReturnValue) {
									return compose(addReturnValue(event.returnValue), updateFunc)
								} else if (event.isSetLastAction) {
									return compose(setLastAction, updateFunc)
								}

								throw new Error('no event type')
							}, identity),
						]
					)

					return Object.fromEntries(updateFuncsForEvents)
				}),
				{},
			]

			const backwardUpdateFuncs = [
				{},
				{},
				...nodeEvents.map(eventObj => {
					const updateFuncsForEvents = Object.entries(eventObj).map(
						([nodeID, events]) => [
							nodeID,
							events.reduce((updateFunc, event) => {
								if (event.isAddToParent) {
									if (nodeID === noParentNode)
										return compose(() => null, updateFunc)

									return compose(
										removeChildFromParent(event.childNode),
										updateFunc
									)
								} else if (event.isAddReturnValue) {
									return compose(removeReturnValue, updateFunc)
								} else if (event.isSetLastAction) {
									return compose(unsetLastAction, updateFunc)
								}

								throw new Error('no event type')
							}, identity),
						]
					)

					return Object.fromEntries(updateFuncsForEvents)
				}),
			]

			return {
				forwardUpdateFuncs,
				backwardUpdateFuncs,
				curIndex: 1,
				treeRoot: null,
				isReset: false,
				canStepForward: forwardUpdateFuncs.length > 2,
				canStepBackward: false,
			}
		}
		case 'stepForward': {
			const { forwardUpdateFuncs, curIndex, treeRoot } = state
			if (curIndex + 1 >= forwardUpdateFuncs.length) {
				throw new Error('cannot step forward')
			}

			const updateFuncs = forwardUpdateFuncs[curIndex]
			const updatedTreeRoot = handleTreeUpdates(updateFuncs, treeRoot)
			const updatedIndex = curIndex + 1

			return {
				...state,
				curIndex: updatedIndex,
				treeRoot: updatedTreeRoot,
				canStepForward: curIndex + 1 < forwardUpdateFuncs.length,
				canStepBackward: true,
			}
		}
		case 'stepBackward': {
			const {
				forwardUpdateFuncs,
				backwardUpdateFuncs,
				curIndex,
				treeRoot,
			} = state

			console.log({ state })

			if (
				curIndex >= backwardUpdateFuncs.length ||
				curIndex - 2 < 0 ||
				curIndex - 2 >= forwardUpdateFuncs.length
			) {
				throw new Error('cannot step backward')
			}

			const backwardUpdateFuncsForFirstStepBack = backwardUpdateFuncs[curIndex]
			const backwardUpdateFuncsForSecondStepBack =
				backwardUpdateFuncs[curIndex - 1]
			const forwardUpdateFuncsForResolvingStepForward =
				forwardUpdateFuncs[curIndex - 2]
			const resolveUpdatesFunc = compose(
				handleTreeUpdates(forwardUpdateFuncsForResolvingStepForward),
				handleTreeUpdates(backwardUpdateFuncsForSecondStepBack),
				handleTreeUpdates(backwardUpdateFuncsForFirstStepBack)
			)

			const updatedTreeRoot = resolveUpdatesFunc(treeRoot)
			const updatedIndex = curIndex - 1

			return {
				...state,
				curIndex: updatedIndex,
				treeRoot: updatedTreeRoot,
				canStepForward: true,
				canStepBackward: curIndex - 2 >= 0,
			}
		}
		default:
			throw new Error('no correct action type specified')
	}
}

export const getMakeNodeFunc = (counter = 0) => {
	return args => {
		const node = {
			nodeID: counter,
			args,
			returnValue: hasNotReturned,
			children: [],
		}

		counter += 1
		return node
	}
}

export const createNodeTree = (nodeArray, rootIndex = 0) => {
	const getNodeTree = nodeIndex => {
		const { childIndices, ...node } = nodeArray[nodeIndex]
		const children = childIndices.map(getNodeTree)

		const nodeWithChildReferences = { ...node, children }
		return nodeWithChildReferences
	}

	return getNodeTree(rootIndex)
}

export const flattenTree = treeRoot => {
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
