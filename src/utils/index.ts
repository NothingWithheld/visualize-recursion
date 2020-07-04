import { useEffect, useRef } from 'react'

export const usePrevious = <T>(value: T): T => {
	const ref = useRef()
	useEffect(() => {
		ref.current = value
	})
	return ref.current
}
