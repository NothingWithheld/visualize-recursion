import React from 'react'
import { Option, getOrElse } from 'fp-ts/es6/Option'
import Box from '@material-ui/core/Box'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const CodeText = withStyles({
	root: {
		backgroundColor: 'rgba(27,31,35,.05)',
		fontFamily: 'Roboto Mono, monospace',
		minHeight: '1rem',
		padding: '0 8px',
	},
})(Typography)

const TopLeftButton = withStyles({
	root: {
		position: 'absolute',
		top: '0.75rem',
		right: '0.75rem',
	},
})(IconButton)

interface VariablesWindowProps {
	readonly args: Array<[string, string]>
	readonly variableDetails: Array<[string, string[]]>
	readonly returnValue: Option<string>
	readonly closeWindow: () => void
}

const VariablesWindow = ({
	args,
	variableDetails,
	returnValue,
	closeWindow,
}: VariablesWindowProps): JSX.Element => {
	const assignedVariables = variableDetails.filter(
		([, valList]) => valList.length > 0
	)

	return (
		<Box
			display="flex"
			flexDirection="column"
			margin="14px 8px"
			padding="14px 12px"
			position="relative"
		>
			<TopLeftButton onClick={closeWindow}>
				<CloseIcon />
			</TopLeftButton>
			<CodeText># Arguments</CodeText>
			{args.map(([name, val], i) => (
				<CodeText key={i}>{`${name} = ${val}`}</CodeText>
			))}
			{assignedVariables.length > 0 && (
				<>
					<CodeText />
					<CodeText># Variables</CodeText>
					{assignedVariables.map(([name, valList], i) => (
						<CodeText key={i}>{`${name} = ${
							valList[valList.length - 1]
						}`}</CodeText>
					))}
				</>
			)}
			<CodeText />
			<CodeText># Return Value</CodeText>
			<CodeText>
				{getOrElse(() => "# Function hasn't yet returned")(returnValue)}
			</CodeText>
		</Box>
	)
}

export default VariablesWindow
