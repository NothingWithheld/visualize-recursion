import { useState } from 'react'

const useKonvaTextWidth = () => {
	const [textWidth, setTextWidth] = useState(0)
	const callbackRef = konvaText => {
		if (konvaText) {
			setTextWidth(konvaText.getTextWidth())
		}
	}

	return [textWidth, callbackRef]
}

export default useKonvaTextWidth
