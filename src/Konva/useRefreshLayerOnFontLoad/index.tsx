import React, { useLayoutEffect, useRef, useState } from 'react'
import Konva from 'konva'
import { Option, isNone } from 'fp-ts/es6/Option'

const useRefreshLayerOnFontLoad = (
	maybeObj: Option<any>
): React.RefObject<Konva.Layer> => {
	const layerElement = useRef<Konva.Layer>(null)
	const [loadedText, setLoadedText] = useState(false)

	useLayoutEffect(() => {
		if (loadedText || isNone(maybeObj)) {
			return
		}

		setLoadedText(true)

		// document.fonts not yet in lib file
		;(document as any).fonts.ready.then(() => {
			if (layerElement.current !== null) {
				layerElement.current.batchDraw()
			}
		})
	}, [maybeObj, loadedText])

	return layerElement
}

export default useRefreshLayerOnFontLoad
