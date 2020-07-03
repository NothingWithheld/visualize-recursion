import React from 'react'
import { Option, getOrElse } from 'fp-ts/es6/Option'
import Box from '@material-ui/core/Box'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const CodeText = withStyles({
	root: {
		backgroundColor: 'rgba(27,31,35,.05)',
		fontFamily: 'Roboto Mono, monospace',
	},
})(Typography)

interface VariablesWindowProps {
	readonly args: Array<[string, string]>
	readonly variableDetails: Array<[string, string[]]>
	readonly returnValue: Option<string>
}

const VariablesWindow = ({
	args,
	variableDetails,
	returnValue,
}: VariablesWindowProps): JSX.Element => {
	const assignedVariables = variableDetails.filter(
		([, valList]) => valList.length > 0
	)

	return (
		<Box display="flex" flexDirection="column" margin="14px 8px" padding="20px">
			<Typography>Arguments</Typography>
			{args.map(([name, val], i) => (
				<CodeText key={i}>{`${name} = ${val}`}</CodeText>
			))}
			{assignedVariables.length > 0 && (
				<>
					<Typography>Variables</Typography>
					{assignedVariables.map(([name, valList], i) => (
						<CodeText key={i}>{`${name} = ${
							valList[valList.length - 1]
						}`}</CodeText>
					))}
				</>
			)}
			<Typography>Return Value</Typography>
			<CodeText>
				{getOrElse(() => "Function hasn't yet returned")(returnValue)}
			</CodeText>
		</Box>
	)
}

export default VariablesWindow
