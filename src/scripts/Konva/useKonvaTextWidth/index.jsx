import { useState, useCallback } from 'react'

const useKonvaTextWidth = () => {
	const [textWidth, setTextWidth] = useState(0)
	const callbackRef = useCallback(konvaText => {
		if (konvaText) {
			setTextWidth(konvaText.getTextWidth())
		}
	})

	return [textWidth, callbackRef]
}

export default useKonvaTextWidth
