import { Eq, getStructEq, eqNumber } from 'fp-ts/es6/Eq'
import { Option, none } from 'fp-ts/es6/Option'

export interface NodeBase<Node> {
	readonly nodeID: number
	readonly children: Node[]
}

export interface IterableNode<Node> {
	readonly getNodeID: (node: Node) => number
	readonly getChildren: (node: Node) => Node[]
}

export type SentryNode = {
	readonly nodeID: number
	readonly tree: Option<FuncNode>
}

export function isSentry(node: SentryNode | FuncNode): node is SentryNode {
	return (node as SentryNode).tree !== undefined
}

interface FuncNodeData {
	readonly args: Array<[string, any]>
	readonly returnValue: Option<any>
	readonly variableDetails: Array<[string, any[]]>
	readonly lastAction: boolean
}

export type FuncNode = FuncNodeData & NodeBase<FuncNode>

export const iterableFuncNode: IterableNode<FuncNode> = {
	getNodeID: (node: FuncNode) => node.nodeID,
	getChildren: (node: FuncNode) => node.children,
}

interface PlacedNodeData {
	readonly x: number
	readonly y: number
}

export type PlacedNode<Node> = Omit<Node, 'children'> &
	PlacedNodeData &
	NodeBase<PlacedNode<Node>>

export const iterablePlacedNode = <Node>(): IterableNode<PlacedNode<Node>> => ({
	getNodeID: (node: PlacedNode<Node>) => node.nodeID,
	getChildren: (node: PlacedNode<Node>) => node.children,
})

interface PlacingNodeData<Node> {
	readonly x: number
	readonly y: number
	offset: number
	thread: Option<Node>
}

export type PlacingNode<Node> = Omit<Node, 'children'> &
	PlacingNodeData<PlacingNode<Node>> &
	NodeBase<PlacingNode<Node>>

export const eqNode: Eq<NodeBase<any>> = getStructEq({ nodeID: eqNumber })
