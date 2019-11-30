import { useEffect, useRef } from 'react'

const useRefreshLayerOnFontLoad = () => {
	const layerElement = useRef(null)
	useEffect(() => {
		document.fonts.ready.then(() => layerElement.current.draw())
	}, [])

	return layerElement
}

export default useRefreshLayerOnFontLoad
