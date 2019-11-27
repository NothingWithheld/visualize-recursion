export const hasChildren = node => node.children.length > 0

export const hasSingleChild = node => node.children.length === 1

export const getLeftChild = node =>
	hasChildren(node) ? node.children[0] : null

export const getRightChild = node =>
	node.children.length === 2 ? node.children[1] : null

export const getRightmostChild = node =>
	hasChildren(node) ? node.children[node.children.length - 1] : null
