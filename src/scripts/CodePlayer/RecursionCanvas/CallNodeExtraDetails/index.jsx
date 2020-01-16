import React from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { makeStyles, withStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	root: {
		position: 'absolute',
		left: props => props.x,
		top: props => props.y,
		transform: 'translate(-50%, -50%)',
	},
})

const CodeText = withStyles({
	root: {
		backgroundColor: 'rgba(27,31,35,.05)',
		fontFamily: 'Roboto Mono, monospace',
	},
})(Typography)

const CallNodeExtraDetails = ({ x, y, args, variableDetails, returnVal }) => {
	const classes = useStyles({ x, y })

	return (
		<Paper className={classes.root}>
			<Typography>Arguments</Typography>
			{Object.entries(args).map(([name, val], i) => (
				<CodeText key={i}>{`${name.toString()} = ${val.toString()}`}</CodeText>
			))}
			<CodeText>Some text here</CodeText>
			<h1>See this here</h1>
		</Paper>
	)
}

export default CallNodeExtraDetails
