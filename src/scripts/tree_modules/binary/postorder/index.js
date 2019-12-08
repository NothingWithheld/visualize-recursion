export default function* postorderGenerator(node) {
	if (node === null) return

	yield* postorderGenerator(node.left)
	yield* postorderGenerator(node.right)
	yield node.nodeID
}
