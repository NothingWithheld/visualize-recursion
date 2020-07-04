import { Eq, getStructEq, eqNumber } from 'fp-ts/es6/Eq'
import { Option } from 'fp-ts/es6/Option'

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

// [string, string] -> [argName, argVal]
// everything as a string -> store as you want it to be displayed
interface FuncNodeData {
	readonly args: Array<[string, string]>
	readonly returnValue: Option<string>
	readonly variableDetails: Array<[string, string[]]>
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
	getNodeID: (node: PlacedNode<Node>): number => node.nodeID,
	getChildren: (node: PlacedNode<Node>): PlacedNode<Node>[] => node.children,
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

// Binary Node

interface BinaryNodeBase<Node> {
	readonly nodeID: number
	readonly left: Option<Node>
	readonly right: Option<Node>
	readonly properties: { [propName: string]: any }
	readonly propertyOrder: string[]
}

export type BinaryNode = BinaryNodeBase<BinaryNode>

export type PlacingBinaryNode = PlacingNodeData<PlacingBinaryNode> &
	BinaryNodeBase<PlacingBinaryNode>

export type PlacedBinaryNode = PlacedNodeData & BinaryNodeBase<PlacedBinaryNode>
