export const getMakeNodeFunc = () => {
	let counter = 0

	return args => {
		const node = {
			nodeID: counter,
			args,
			returnValue: null,
			children: [],
		}

		counter += 1
		return node
	}
}
