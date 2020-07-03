import { compose, curry } from 'ramda'
import { notYetAssigned, sentryID, sentryTag } from '../constants'
import { FuncNode, eqNode, SentryNode, isSentry } from '../types'
import { none, some, map, Option, getOrElse } from 'fp-ts/es6/Option'
import { assertNever } from '../../utils'

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
	[sentryTag]?: (node: SentryNode) => SentryNode
}

const handleTreeUpdates = curry(
	(updateFuncs: CombinedUpdateFuncs, sentry: SentryNode): SentryNode => {
		const { [sentryTag]: sentryNodeUpdate, ...restUpdateFuncs } = updateFuncs
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

const addChildToSentry = (child: FuncNode) => (
	sentry: SentryNode
): SentryNode => ({
	...sentry,
	tree: some(child),
})

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
	(returnValue: string, node: FuncNode): FuncNode => ({
		...node,
		returnValue: some(returnValue),
	})
)

const removeReturnValue = (node: FuncNode): FuncNode => ({
	...node,
	returnValue: none,
})

const addVariableDetails = curry(
	(variableDetails: Array<[string, string]>, node: FuncNode): FuncNode => {
		const updatedVariableDetails = variableDetails.reduce(
			(acc, [variableName, value]) => {
				const [variable] = acc.filter(
					([variableName_]) => variableName === variableName_
				)

				variable.push(value)
				return acc
			},
			node.variableDetails
		)

		return {
			...node,
			variableDetails: updatedVariableDetails,
		}
	}
)

const revertVariableDetails = curry(
	(variableDetails: Array<[string, string]>, node: FuncNode): FuncNode => {
		const updatedVariableDetails = variableDetails.reduce(
			(acc, [variableName]) => {
				const [variable] = acc.filter(
					([variableName_]) => variableName === variableName_
				)

				variable.pop()
				return acc
			},
			node.variableDetails
		)

		return {
			...node,
			variableDetails: updatedVariableDetails,
		}
	}
)

interface FunctionProgressState {
	readonly generator: Option<Generator<FunctionProgressStepDetails[]>>
	readonly forwardUpdateFuncs: Array<CombinedUpdateFuncs>
	readonly backwardUpdateFuncs: Array<CombinedUpdateFuncs>
	readonly curIndex: number
	readonly sentry: SentryNode
	readonly isReset: boolean
	readonly canStepForward: boolean
	readonly canStepBackward: boolean
}

export const defaultFunctionProgressState: FunctionProgressState = {
	generator: none,
	forwardUpdateFuncs: [{}],
	backwardUpdateFuncs: [{}, {}],
	curIndex: 1,
	sentry: { nodeID: sentryID, tree: none },
	isReset: true,
	canStepForward: false,
	canStepBackward: false,
}

enum FunctionProgressSteps {
	AddChild = 'ADD_CHILD',
	LastAction = 'LAST_ACTION',
	AddReturnValue = 'ADD_RETURN_VALUE',
	AddVariableDetails = 'ADD_VARIABLE_DETAILS',
}

interface AddChildStepDetails {
	readonly type: FunctionProgressSteps.AddChild
	readonly node: SentryNode | FuncNode
	readonly child: FuncNode
}

interface LastActionStepDetails {
	readonly type: FunctionProgressSteps.LastAction
	readonly node: FuncNode
}

interface AddReturnValueStepDetails {
	readonly type: FunctionProgressSteps.AddReturnValue
	readonly node: FuncNode
	readonly returnValue: any
}

interface AddVariableDetailsStepDetails {
	readonly type: FunctionProgressSteps.AddVariableDetails
	readonly node: FuncNode
	readonly variableDetails: Array<[string, any]>
}

export type FunctionProgressStepDetails =
	| AddChildStepDetails
	| LastActionStepDetails
	| AddReturnValueStepDetails
	| AddVariableDetailsStepDetails

export function getAddChildStepEvent(
	parent: SentryNode | FuncNode,
	child: FuncNode
): AddChildStepDetails {
	return {
		type: FunctionProgressSteps.AddChild,
		node: parent,
		child,
	}
}

export function getLastActionStepEvent(node: FuncNode): LastActionStepDetails {
	return { type: FunctionProgressSteps.LastAction, node }
}

export function getAddReturnValueStepEvent(
	node: FuncNode,
	returnValue: string
): AddReturnValueStepDetails {
	return {
		type: FunctionProgressSteps.AddReturnValue,
		node,
		returnValue,
	}
}

export function getAddVariableDetailsStepEvent(
	node: FuncNode,
	variableDetails: Array<[string, string]>
): AddVariableDetailsStepDetails {
	return {
		type: FunctionProgressSteps.AddVariableDetails,
		node,
		variableDetails,
	}
}

export enum FunctionProgressActions {
	Reset = 'RESET',
	Setup = 'SETUP',
	StepForward = 'STEP_FORWARD',
	StepBackward = 'STEP_BACKWARD',
}

interface ResetAction {
	readonly type: FunctionProgressActions.Reset
}

export type NodeGeneratorFunc = (
	sentry: SentryNode,
	...argValues: any[]
) => Generator<FunctionProgressStepDetails[]>

interface SetupAction {
	readonly type: FunctionProgressActions.Setup
	readonly argValues: any[]
	readonly generatorFunc: NodeGeneratorFunc
}

interface StepForwardAction {
	readonly type: FunctionProgressActions.StepForward
}

interface StepBackwardAction {
	readonly type: FunctionProgressActions.StepBackward
}

type FunctionProgressAction =
	| ResetAction
	| SetupAction
	| StepForwardAction
	| StepBackwardAction

const getForwardUpdateFuncs = (
	nodeEvents: FunctionProgressStepDetails[]
): CombinedUpdateFuncs => {
	const sentryNodeEvents = nodeEvents.filter(({ node }) => isSentry(node))
	const funcNodeEvents = nodeEvents.filter(({ node }) => !isSentry(node))

	const updateFuncs = funcNodeEvents.reduce(
		(updateFuncs_: UpdateFuncs, event) => {
			let updateFunc: (node: FuncNode) => FuncNode
			switch (event.type) {
				case FunctionProgressSteps.AddChild:
					updateFunc = compose(unsetLastAction, addChildToParent(event.child))
					break
				case FunctionProgressSteps.AddReturnValue:
					updateFunc = addReturnValue(event.returnValue)
					break
				case FunctionProgressSteps.LastAction:
					updateFunc = setLastAction
					break
				case FunctionProgressSteps.AddVariableDetails:
					updateFunc = addVariableDetails(event.variableDetails)
					break
				default:
					assertNever(event)
			}

			const nodeID = event.node.nodeID
			if (nodeID in updateFuncs_) {
				updateFuncs_[nodeID] = compose(updateFunc, updateFuncs_[nodeID])
			} else {
				updateFuncs_[nodeID] = updateFunc
			}

			return updateFuncs_
		},
		{}
	)

	// only sentry node event should be to add the tree to the sentry
	if (sentryNodeEvents.length > 0) {
		const sentryNodeEvent = sentryNodeEvents[0]

		return {
			...updateFuncs,
			[sentryTag]: addChildToSentry(
				(sentryNodeEvent as AddChildStepDetails).child
			),
		}
	}

	return updateFuncs
}

const getBackwardUpdateFuncs = (
	nodeEvents: FunctionProgressStepDetails[]
): CombinedUpdateFuncs => {
	const sentryNodeEvents = nodeEvents.filter(({ node }) => isSentry(node))
	const funcNodeEvents = nodeEvents.filter(({ node }) => !isSentry(node))

	const updateFuncs = funcNodeEvents.reduce(
		(updateFuncs_: UpdateFuncs, event) => {
			let updateFunc: (node: FuncNode) => FuncNode
			switch (event.type) {
				case FunctionProgressSteps.AddChild:
					updateFunc = removeChildFromParent(event.child)
					break
				case FunctionProgressSteps.AddReturnValue:
					updateFunc = removeReturnValue
					break
				case FunctionProgressSteps.LastAction:
					updateFunc = unsetLastAction
					break
				case FunctionProgressSteps.AddVariableDetails:
					updateFunc = revertVariableDetails(event.variableDetails)
					break
				default:
					assertNever(event)
			}

			const nodeID = event.node.nodeID
			if (nodeID in updateFuncs_) {
				updateFuncs_[nodeID] = compose(updateFunc, updateFuncs_[nodeID])
			} else {
				updateFuncs_[nodeID] = updateFunc
			}

			return updateFuncs_
		},
		{}
	)

	// only sentry node event should be to add the tree to the sentry
	if (sentryNodeEvents.length > 0) {
		return {
			...updateFuncs,
			[sentryTag]: removeChildFromSentry,
		}
	}

	return updateFuncs
}

export const functionProgressReducer = (
	state: FunctionProgressState,
	action: FunctionProgressAction
): FunctionProgressState => {
	const callGeneratorStepForward = (
		generator: Generator<FunctionProgressStepDetails[]>
	) => {
		const { forwardUpdateFuncs, backwardUpdateFuncs } = state

		const { done, value } = generator.next()
		if (done) {
			return {
				generator: none,
				forwardUpdateFuncs,
				backwardUpdateFuncs,
			}
		}

		return {
			generator: some(generator),
			forwardUpdateFuncs: [...forwardUpdateFuncs, getForwardUpdateFuncs(value)],
			backwardUpdateFuncs: [
				...backwardUpdateFuncs,
				getBackwardUpdateFuncs(value),
			],
		}
	}

	switch (action.type) {
		case FunctionProgressActions.Reset:
			return defaultFunctionProgressState
		case FunctionProgressActions.Setup: {
			if (!state.isReset) {
				throw new Error('should reset before new setup')
			}

			const { argValues, generatorFunc } = action

			const {
				generator,
				forwardUpdateFuncs,
				backwardUpdateFuncs,
			} = callGeneratorStepForward(generatorFunc(state.sentry, ...argValues))

			return {
				generator,
				forwardUpdateFuncs,
				backwardUpdateFuncs,
				curIndex: 1,
				sentry: { nodeID: sentryID, tree: none },
				isReset: false,
				canStepForward: forwardUpdateFuncs.length > 1,
				canStepBackward: false,
			}
		}
		case FunctionProgressActions.StepForward: {
			const { generator, forwardUpdateFuncs, backwardUpdateFuncs } = getOrElse(
				() => ({
					generator: state.generator,
					forwardUpdateFuncs: state.forwardUpdateFuncs,
					backwardUpdateFuncs: state.backwardUpdateFuncs,
				})
			)(map(callGeneratorStepForward)(state.generator))

			const { curIndex, sentry } = state
			if (curIndex >= forwardUpdateFuncs.length) {
				throw new Error('cannot step forward')
			}

			const updateFuncs = forwardUpdateFuncs[curIndex]
			const updatedSentry = handleTreeUpdates(updateFuncs, sentry)
			const updatedIndex = curIndex + 1

			return {
				...state,
				generator,
				forwardUpdateFuncs,
				backwardUpdateFuncs,
				curIndex: updatedIndex,
				sentry: updatedSentry,
				canStepForward: updatedIndex < forwardUpdateFuncs.length,
				canStepBackward: true,
			}
		}
		case FunctionProgressActions.StepBackward: {
			const {
				forwardUpdateFuncs,
				backwardUpdateFuncs,
				curIndex,
				sentry,
			} = state

			if (
				curIndex >= backwardUpdateFuncs.length ||
				curIndex - 2 < 0 ||
				curIndex - 2 >= forwardUpdateFuncs.length
			) {
				throw new Error('cannot step backward')
			}

			// step back twice and forward once
			// restores 'lastAction'
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

			const updatedSentry = resolveUpdatesFunc(sentry)
			const updatedIndex = curIndex - 1

			return {
				...state,
				curIndex: updatedIndex,
				sentry: updatedSentry,
				canStepForward: true,
				canStepBackward: updatedIndex - 2 >= 0,
			}
		}
		default:
			assertNever(action)
	}
}

export type MakeNodeFunc = (args: Array<[string, string]>) => FuncNode

export const getMakeNodeFunc = (counter = 0): MakeNodeFunc => {
	return (args: Array<[string, string]>): FuncNode => {
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
