import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import PlayArrowIcon from '@material-ui/icons/PlayArrowRounded'
import PauseIcon from '@material-ui/icons/PauseRounded'
import RefreshIcon from '@material-ui/icons/Refresh'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import ForwardIcon from '@material-ui/icons/Forward'

const MinWidthButton = withStyles({
	root: {
		minWidth: 150,
	},
	label: {
		display: 'flex',
		alignItems: 'flex-start',
	},
})(Button)

const SpaceBetweenPaper = withStyles({
	root: {
		display: 'flex',
		justifyContent: 'space-between',
		margin: '14px 8px',
		padding: '14px 12px',
	},
})(Paper)

const TreeCodeController = ({
	treeRoot,
	play,
	pause,
	reset,
	isStepping,
	isInitialized,
	canStepForward,
	canStepBackward,
	start,
	startAndStepOnce,
	stepForward,
	stepBackward,
}) => {
	const [delayMilliseconds, setDelayMilliseconds] = useState(500)

	return (
		<SpaceBetweenPaper>
			<ButtonGroup variant="contained" size="large">
				{isStepping ? (
					<MinWidthButton onClick={pause}>
						PAUSE
						<PauseIcon />
					</MinWidthButton>
				) : (
					<MinWidthButton
						disabled={isInitialized && !canStepForward}
						onClick={isInitialized ? play : () => start(treeRoot)}
					>
						PLAY
						<PlayArrowIcon />
					</MinWidthButton>
				)}
				<MinWidthButton
					onClick={
						isInitialized ? stepForward : () => startAndStepOnce(treeRoot)
					}
					disabled={isInitialized && (isStepping || !canStepForward)}
				>
					STEP FORWARD
					<ForwardIcon />
				</MinWidthButton>
				<MinWidthButton
					onClick={stepBackward}
					disabled={isStepping || !canStepBackward}
				>
					STEP BACKWARD
					<ForwardIcon />
				</MinWidthButton>
				<MinWidthButton onClick={reset} disabled={isStepping || !isInitialized}>
					RESET
					<RefreshIcon />
				</MinWidthButton>
			</ButtonGroup>
			<span>
				<TextField
					type="number"
					label="Delay (seconds)"
					value={(delayMilliseconds / 1000).toString()}
					onChange={event => {
						setDelayMilliseconds(1000 * event.target.value)
					}}
					disabled={isStepping}
					variant="filled"
				/>
			</span>
		</SpaceBetweenPaper>
	)
}

export default TreeCodeController
