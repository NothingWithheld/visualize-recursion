import { identity, compose, curry } from 'ramda'
import { hasNotReturned, notYetAssigned, sentryID } from '../constants'
import { FuncNode, eqNode, SentryNode, isSentry } from '../types'
import { none, some, map } from 'fp-ts/es6/Option'

const setLastAction = (node: FuncNode): FuncNode => ({
	...node,
	lastAction: true,
})

const unsetLastAction = (node: FuncNode): FuncNode => ({
	...node,
	lastAction: false,
})

type UpdateFuncs = { [propName: number]: (node: FuncNode) => FuncNode }

const updateTree = curry(
	(updateFuncs: UpdateFuncs, node: FuncNode): FuncNode => {
		const updateFunc = updateFuncs[node.nodeID] || unsetLastAction
		const updatedNode = updateFunc(node)
		const updatedChildren = updatedNode.children.map((child) =>
			updateTree(updateFuncs, child)
		)

		return { ...updatedNode, children: updatedChildren }
	}
)

type CombinedUpdateFuncs = UpdateFuncs & {
	[sentryID]?: (node: SentryNode) => SentryNode
}

const handleTreeUpdates = curry(
	(updateFuncs: CombinedUpdateFuncs, sentry: SentryNode): SentryNode => {
		const { [sentryID]: sentryNodeUpdate, ...restUpdateFuncs } = updateFuncs
		let updatedSentry = sentry
		if (sentryNodeUpdate) {
			updatedSentry = sentryNodeUpdate(sentry)
		}

		const updatedTreeRoot = map(updateTree(restUpdateFuncs))(updatedSentry.tree)

		return {
			...updatedSentry,
			tree: updatedTreeRoot,
		}
	}
)

const addChildToSentry = curry(
	(child: FuncNode, sentry: SentryNode): SentryNode => ({
		...sentry,
		tree: some(child),
	})
)

const removeChildFromSentry = curry(
	(sentry: SentryNode): SentryNode => ({
		...sentry,
		tree: none,
	})
)

const addChildToParent = curry(
	(child: FuncNode, parent: FuncNode): FuncNode => ({
		...parent,
		children: [...parent.children, child],
	})
)

const removeChildFromParent = curry(
	(childToRemove: FuncNode, parent: FuncNode): FuncNode => ({
		...parent,
		children: parent.children.filter(
			(child) => !eqNode.equals(child, childToRemove)
		),
	})
)

const addReturnValue = curry(
	(returnValue: any, node: FuncNode): FuncNode => ({
		...node,
		returnValue: some(returnValue),
	})
)

const removeReturnValue = (node: FuncNode): FuncNode => ({
	...node,
	returnValue: none,
})

const addVariableDetails = curry(
	(variableDetails: any[], node: FuncNode): FuncNode => ({
		...node,
		variableDetails: { ...node.variableDetails, ...variableDetails },
	})
)

const revertVariableDetails = curry(
	(variableDetails: any[], node: FuncNode): FuncNode => {
		const notYetAssignedVariableDetails = Object.fromEntries(
			Object.keys(variableDetails).map((variableName) => [
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
	}
)

interface FunctionProgressState {
	forwardUpdateFuncs: Array<CombinedUpdateFuncs>
	backwardUpdateFuncs: Array<CombinedUpdateFuncs>
	curIndex: number
	sentry: SentryNode
	isReset: boolean
	canStepForward: boolean
	canStepBackward: boolean
}

export const defaultFunctionProgressState: FunctionProgressState = {
	forwardUpdateFuncs: [],
	backwardUpdateFuncs: [],
	curIndex: 0,
	sentry: { nodeID: sentryID, tree: none },
	isReset: true,
	canStepForward: false,
	canStepBackward: false,
}

export enum FunctionProgressActions {
	Reset = 'RESET',
	Setup = 'SETUP',
	StepForward = 'STEP_FORWARD',
	StepBackward = 'STEP_BACKWARD',
}

enum FunctionProgressSteps {
	AddChild = 'ADD_CHILD',
	LastAction = 'LAST_ACTION',
	AddReturnValue = 'ADD_RETURN_VALUE',
}

interface AddChildStepDetails {
	readonly type: FunctionProgressSteps.AddChild
	readonly parent: SentryNode | FuncNode
	readonly child: FuncNode
}

interface LastActionStepDetails {
	readonly type: FunctionProgressSteps.LastAction
}

interface AddReturnValueStepDetails {
	readonly type: FunctionProgressSteps.AddReturnValue
	readonly returnValue: any
}

type FunctionProgressStepDetails =
	| AddChildStepDetails
	| LastActionStepDetails
	| AddReturnValueStepDetails

export function getAddChildStepEvent(
	parent: SentryNode | FuncNode,
	child: FuncNode
): AddChildStepDetails {
	return {
		type: FunctionProgressSteps.AddChild,
		parent,
		child,
	}
}

export function getLastActionStepEvent(): LastActionStepDetails {
	return { type: FunctionProgressSteps.LastAction }
}

export function getAddReturnValueStepEvent(
	returnValue: any
): AddReturnValueStepDetails {
	return {
		type: FunctionProgressSteps.AddReturnValue,
		returnValue,
	}
}

interface FunctionProgressAction {
	readonly type: FunctionProgressActions
	readonly args: any[]
	readonly generatorFunc: (
		sentry: SentryNode,
		...args: any[]
	) => Iterable<{
		[propName: number]: FunctionProgressStepDetails[]
	}>
}

export const functionProgressReducer = (
	state: FunctionProgressState,
	action: FunctionProgressAction
): FunctionProgressState => {
	switch (action.type) {
		case FunctionProgressActions.Reset:
			return defaultFunctionProgressState
		case FunctionProgressActions.Setup: {
			if (!state.isReset) {
				throw new Error('should reset before new setup')
			}
			const { args, generatorFunc } = action
			const nodeEvents = [...generatorFunc(state.sentry, ...args)]

			const forwardUpdateFuncs = [
				{},
				...nodeEvents.map((eventObj) => {
					const updateFuncsForEvents = Object.entries(eventObj).map(
						([nodeID, events]) => [
							nodeID,
							events.reduce((updateFunc, event) => {
								switch (event.type) {
									case FunctionProgressSteps.AddChild:
										if (isSentry(event.parent)) {
											return compose(
												setLastAction,
												addChildToSentry(event.child),
												updateFunc
											)
										} else {
											return compose(
												unsetLastAction,
												addChildToParent(event.child),
												updateFunc
											)
										}
									case FunctionProgressSteps.LastAction:
										return compose(setLastAction, updateFunc)
									case FunctionProgressSteps.AddReturnValue:
										return compose(
											addReturnValue(event.returnValue),
											updateFunc
										)
								}

								// } else if (event.isAddVariableDetails) {
								// 	return compose(
								// 		addVariableDetails(event.variableDetails),
								// 		updateFunc
								// 	)
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
				...nodeEvents.map((eventObj) => {
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
								} else if (event.isAddVariableDetails) {
									return compose(
										revertVariableDetails(event.variableDetails),
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
		case FunctionProgressActions.StepForward: {
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
				canStepForward: updatedIndex + 1 < forwardUpdateFuncs.length,
				canStepBackward: true,
			}
		}
		case FunctionProgressActions.StepBackward: {
			const {
				forwardUpdateFuncs,
				backwardUpdateFuncs,
				curIndex,
				treeRoot,
			} = state

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
				canStepBackward: updatedIndex - 2 >= 0,
			}
		}
		default:
			throw new Error('no correct action type specified')
	}
}

export const getMakeNodeFunc = (counter = 0): ((args: any[]) => FuncNode) => {
	return (args: any[]): FuncNode => {
		const node = {
			nodeID: counter,
			args,
			returnValue: none,
			variableDetails: [],
			children: [],
			lastAction: false,
		}

		counter += 1
		return node
	}
}
