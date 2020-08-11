/* eslint-disable react/jsx-key */
import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import draculaTheme from 'prism-react-renderer/themes/oceanicNext'

interface CodeDisplayProps {
	readonly pythonCode: string
}

const CodeDisplay = ({ pythonCode }: CodeDisplayProps): JSX.Element => {
	return (
		<Highlight
			{...defaultProps}
			code={pythonCode.trim()}
			language="python"
			theme={draculaTheme}
		>
			{({ className, style, tokens, getLineProps, getTokenProps }) => (
				<pre
					className={className}
					style={{
						...style,
						fontSize: '15px',
						padding: '16px',
						lineHeight: '1.3',
						borderRadius: '12px',
					}}
				>
					{tokens.map((line, i) => (
						<div {...getLineProps({ line, key: i })}>
							{line.map((token, key) => (
								<span {...getTokenProps({ token, key })} />
							))}
						</div>
					))}
				</pre>
			)}
		</Highlight>
	)
}

export default CodeDisplay
