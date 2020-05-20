import React, { useLayoutEffect, useRef } from 'react'
import Konva from 'konva'

const useRefreshLayerOnFontLoad = (): React.RefObject<Konva.Layer> => {
	const layerElement = useRef<Konva.Layer>(null)
	useLayoutEffect(() => {
		// document.fonts not yet in lib file
		;(document as any).fonts.ready.then(() => {
			if (layerElement.current !== null) {
				layerElement.current.draw()
			}
		})
	}, [])

	return layerElement
}

export default useRefreshLayerOnFontLoad
