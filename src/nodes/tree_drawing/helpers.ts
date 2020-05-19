import { NodeBase } from '../types'
import { Option, some, none } from 'fp-ts/es6/Option'

export const hasChildren = <Node>(node: NodeBase<Node>): boolean =>
	node.children.length > 0

export const hasSingleChild = <Node>(node: NodeBase<Node>): boolean =>
	node.children.length === 1

export const getLeftChild = <Node>(node: NodeBase<Node>): Option<Node> =>
	hasChildren<Node>(node) ? some(node.children[0]) : none

export const getRightChild = <Node>(node: NodeBase<Node>): Option<Node> =>
	node.children.length === 2 ? some(node.children[1]) : none

export const getRightmostChild = <Node>(node: NodeBase<Node>): Option<Node> =>
	hasChildren<Node>(node)
		? some(node.children[node.children.length - 1] as Node)
		: none
