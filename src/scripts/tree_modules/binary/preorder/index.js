export default function* preorderGenerator(node) {
	if (node === null) return

	yield node.nodeID
	yield* preorderGenerator(node.left)
	yield* preorderGenerator(node.right)
}
