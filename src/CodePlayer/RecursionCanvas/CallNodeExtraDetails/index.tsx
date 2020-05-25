import React from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Option } from 'fp-ts/es6/Option'

interface StyleProps {
	readonly x: number
	readonly y: number
}

const useStyles = makeStyles({
	root: {
		position: 'absolute',
		left: (props: StyleProps) => props.x,
		top: (props: StyleProps) => props.y,
		transform: 'translate(-50%, -50%)',
	},
})

const CodeText = withStyles({
	root: {
		backgroundColor: 'rgba(27,31,35,.05)',
		fontFamily: 'Roboto Mono, monospace',
	},
})(Typography)

interface CallNodeExtraDetailsProps {
	readonly x: number
	readonly y: number
	readonly args: Array<[string, string]>
	readonly variableDetails: Array<[string, string[]]>
	readonly returnValue: Option<string>
}

const CallNodeExtraDetails = ({
	x,
	y,
	args,
	variableDetails,
	returnValue,
}: CallNodeExtraDetailsProps): JSX.Element => {
	const classes = useStyles({ x, y })

	return (
		<Paper className={classes.root}>
			<Typography>Arguments</Typography>
			{args.map(([name, val], i) => (
				<CodeText key={i}>{`${name} = ${val}`}</CodeText>
			))}
			<CodeText>Some text here</CodeText>
			<h1>See this here</h1>
		</Paper>
	)
}

export default CallNodeExtraDetails
