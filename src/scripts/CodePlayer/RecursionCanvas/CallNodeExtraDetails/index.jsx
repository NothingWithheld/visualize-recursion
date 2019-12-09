import React from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	root: {
		position: 'absolute',
		left: props => props.x,
		top: props => props.y,
		transform: 'translate(-50%, -50%)',
	},
})

const CallNodeExtraDetails = ({ x, y }) => {
	const classes = useStyles({ x, y })

	return (
		<Paper className={classes.root}>
			<Typography>Some text here</Typography>
			<h1>See this here</h1>
		</Paper>
	)
}

export default CallNodeExtraDetails
