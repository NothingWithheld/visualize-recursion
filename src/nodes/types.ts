import { Eq, getStructEq, eqNumber } from 'fp-ts/es6/Eq'
import { Option, none } from 'fp-ts/es6/Option'

export interface NodeBase<Node> {
	readonly nodeID: number
	readonly children: Node[]
}

export type BaseNode = NodeBase<BaseNode>

export type SentryNode = {
	readonly nodeID: number
	readonly tree: Option<FuncNode>
}

export function isSentry(node: SentryNode | FuncNode): node is SentryNode {
	return (node as SentryNode).tree !== undefined
}

interface FuncNodeData {
	readonly args: any[]
	readonly returnValue: Option<any>
	readonly variableDetails: any[]
	readonly lastAction: boolean
}

export type FuncNode = FuncNodeData & NodeBase<FuncNode>

interface PlacedNodeData {
	readonly x: number
	readonly y: number
}

interface PlacingNodeData<Node> {
	readonly x: number
	readonly y: number
	offset: number
	thread: Option<Node>
}

export type PlacedNode<Node> = Omit<Node, 'children'> &
	PlacedNodeData &
	NodeBase<PlacedNode<Node>>

export type PlacingNode<Node> = Omit<Node, 'children'> &
	PlacingNodeData<PlacingNode<Node>> &
	NodeBase<PlacingNode<Node>>

export const eqNode: Eq<NodeBase<any>> = getStructEq({ nodeID: eqNumber })
