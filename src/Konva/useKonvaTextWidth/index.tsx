import { useState } from 'react'
import Konva from 'konva'

const useKonvaTextWidth = (): [number, (konvaText: Konva.Text) => void] => {
	const [textWidth, setTextWidth] = useState(0)
	const callbackRef = (konvaText: Konva.Text): void => {
		if (konvaText) {
			setTextWidth(konvaText.getTextWidth())
		}
	}

	return [textWidth, callbackRef]
}

export default useKonvaTextWidth
