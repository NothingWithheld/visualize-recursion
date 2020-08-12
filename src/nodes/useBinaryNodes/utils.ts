import { identity, curry } from 'ramda'
import { BinaryNode, eqBinaryNode } from '../types'
import {
	Option,
	getOrElse,
	map,
	some,
	alt,
	chain,
	none,
} from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'

export type BinaryTreeArray = [number, boolean][][]

export const buildBinaryTreeFromArraySpec = (
	makeNode: MakeNodeFunc,
	nodeArrays: BinaryTreeArray
): Option<BinaryNode> => {
	let treeRoot: Option<BinaryNode> = none

	let prevLevelNodes: BinaryNode[] = []
	for (const thisLevel of nodeArrays) {
		const thisLevelNodes = thisLevel.map(([idxOfParentInLevel, isLeftNode]) => {
			const node = makeNode()
			if (idxOfParentInLevel === -1) {
				treeRoot = some(node)
			} else {
				const parent = prevLevelNodes[idxOfParentInLevel]
				if (isLeftNode) {
					prevLevelNodes[idxOfParentInLevel] = { ...parent, left: some(node) }
				} else {
					prevLevelNodes[idxOfParentInLevel] = { ...parent, right: some(node) }
				}
			}

			return node
		})

		prevLevelNodes = thisLevelNodes
	}

	return treeRoot
}

const updateTree = curry(
	(
		updateFuncs: {
			[propName: number]: (node: BinaryNode) => BinaryNode
		},
		node: BinaryNode
	): BinaryNode => {
		const partialFunc = updateTree(updateFuncs)

		const left = map(partialFunc)(node.left)
		const right = map(partialFunc)(node.right)
		const updateFunc = updateFuncs[node.nodeID] || identity

		return updateFunc({ ...node, left, right })
	}
)

const isSameAsChild = curry(
	(node: BinaryNode, child: Option<BinaryNode>): boolean => {
		return pipe(
			child,
			map((childNode: BinaryNode) => eqBinaryNode.equals(node, childNode)),
			getOrElse<boolean>(() => false)
		)
	}
)

const findParentOf = curry(
	(nodeToFind: BinaryNode, curNode: BinaryNode): Option<BinaryNode> => {
		if (
			isSameAsChild(nodeToFind, curNode.left) ||
			isSameAsChild(nodeToFind, curNode.right)
		) {
			return some(curNode)
		}

		const partialFunc = findParentOf(nodeToFind)

		return alt(() => chain(partialFunc)(curNode.left))(
			chain(partialFunc)(curNode.right)
		)
	}
)

export const addNodeToTree = curry(
	(
		child: BinaryNode,
		isLeftChild: boolean,
		treeRoot: BinaryNode,
		parent: BinaryNode
	): BinaryNode => {
		const attachChild = (_: BinaryNode): BinaryNode =>
			isLeftChild
				? { ...parent, left: some(child) }
				: { ...parent, right: some(child) }

		return updateTree({ [parent.nodeID]: attachChild }, treeRoot)
	}
)

export const deleteNodeFromTree = (nodeToDelete: BinaryNode) => (
	treeRoot: BinaryNode
): BinaryNode => {
	const possibleParent = findParentOf(nodeToDelete, treeRoot)

	const removeChildFromParent = (parent: BinaryNode): BinaryNode => {
		const removeChildFunc = (_: BinaryNode): BinaryNode => {
			const { left, right } = parent

			return {
				...parent,
				left: isSameAsChild(nodeToDelete, left) ? none : left,
				right: isSameAsChild(nodeToDelete, right) ? none : right,
			}
		}

		return updateTree(
			{
				[parent.nodeID]: removeChildFunc,
			},
			treeRoot
		)
	}

	return getOrElse(() => treeRoot)(map(removeChildFromParent)(possibleParent))
}

export type MakeNodeFunc = () => BinaryNode

export const getMakeBinaryNodeFunc = (counter = 0): MakeNodeFunc => {
	return (): BinaryNode => {
		const node = {
			nodeID: counter,
			left: none,
			right: none,
			properties: {},
			propertyOrder: [],
		}

		counter += 1
		return node
	}
}
