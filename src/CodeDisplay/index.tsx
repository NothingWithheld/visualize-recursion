/* eslint-disable react/jsx-key */
import React, { useState } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import draculaTheme from 'prism-react-renderer/themes/oceanicNext'
import Box from '@material-ui/core/Box'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { withStyles } from '@material-ui/core/styles'

const LanguageTabs = withStyles({
	root: { minHeight: '36px' },
	indicator: { backgroundColor: '#D9E2EC' },
})(Tabs)

const LanguageTab = withStyles({ root: { minHeight: '6px' } })(Tab)

interface CodeDisplayProps {
	readonly pythonCode: string
}

const CodeDisplay = ({ pythonCode }: CodeDisplayProps): JSX.Element => {
	const [language, setLanguage] = useState(0)

	const handleTabChange = (_: any, languageInd: number): void => {
		setLanguage(languageInd)
	}

	return (
		<>
			<Box
				bgcolor="#334E68"
				color="#D9E2EC"
				height="36px"
				borderRadius="8px 8px 0 0"
			>
				<LanguageTabs value={language} onChange={handleTabChange}>
					<LanguageTab label="Python3" />
				</LanguageTabs>
			</Box>
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
							fontSize: '14.5px',
							padding: '12px 16px 16px 16px',
							lineHeight: '1.4',
							borderRadius: '0 0 8px 8px',
							overflow: 'auto',
							margin: '0',
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
		</>
	)
}

export default CodeDisplay
