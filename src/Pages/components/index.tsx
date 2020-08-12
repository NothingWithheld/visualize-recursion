import React from 'react'
import Box from '@material-ui/core/Box'
import { withStyles } from '@material-ui/core/styles'

interface InlineCodeProps {
	readonly code: string
}

export const InlineCode = ({ code }: InlineCodeProps): JSX.Element => {
	return (
		<code
			style={{
				backgroundColor: '#D9E2EC',
				padding: '2px 5px',
				borderRadius: '4px',
			}}
		>
			{code.trim()}
		</code>
	)
}

export const TextWrapper = withStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		maxWidth: '900px',
		margin: '0 auto',
	},
})(Box)
