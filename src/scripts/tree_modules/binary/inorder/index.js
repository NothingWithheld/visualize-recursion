export default function* inorderGenerator(node) {
	if (node === null) return

	yield* inorderGenerator(node.left)
	yield node.nodeID
	yield* inorderGenerator(node.right)
}
