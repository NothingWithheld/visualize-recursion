import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardRounded'
import PlayArrowIcon from '@material-ui/icons/PlayArrowRounded'
import PauseIcon from '@material-ui/icons/PauseRounded'
import RefreshIcon from '@material-ui/icons/Refresh'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import FilledInput from '@material-ui/core/FilledInput'
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

const CodeController = ({
	play,
	pause,
	reset,
	isStepping,
	isCompleted,
	isStarted,
	start,
	startAndStepOnce,
	step,
	functionInputObjs,
}) => {
	const [delayMilliseconds, setDelayMilliseconds] = useState(500)
	const [functionInputDetails, setFunctionInputDetails] = useState(
		functionInputObjs
	)

	const functionArgs = functionInputDetails.map(
		inputDetails => inputDetails.value
	)

	return (
		<SpaceBetweenPaper>
			<ButtonGroup variant="contained" size="large">
				{isStepping ? (
					<MinWidthButton disabled={isCompleted} onClick={pause}>
						PAUSE
						<PauseIcon />
					</MinWidthButton>
				) : (
					<MinWidthButton
						disabled={isCompleted}
						onClick={
							isStarted ? play : () => start(delayMilliseconds, ...functionArgs)
						}
					>
						PLAY
						<PlayArrowIcon />
					</MinWidthButton>
				)}
				<MinWidthButton
					onClick={
						isStarted
							? step
							: () => startAndStepOnce(delayMilliseconds, ...functionArgs)
					}
					disabled={isStepping || isCompleted}
				>
					STEP
					<ForwardIcon />
				</MinWidthButton>
				<MinWidthButton onClick={reset} disabled={isStepping || !isStarted}>
					RESET
					<RefreshIcon />
				</MinWidthButton>
			</ButtonGroup>
			<span>
				{functionInputDetails.map((inputDetails, i) => {
					const { value, label, type, toValue, fromValue } = inputDetails
					return (
						<TextField
							type={type}
							label={label}
							value={fromValue ? fromValue(value) : value}
							onChange={event => {
								const updatedFunctionInputDetails = functionInputDetails.map(
									(details, j) =>
										i === j
											? toValue
												? { ...details, value: toValue(event.target.value) }
												: { ...details, value: event.target.value }
											: details
								)

								setFunctionInputDetails(updatedFunctionInputDetails)
							}}
							disabled={isStarted}
							key={i}
							variant="filled"
						/>
					)
				})}
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

export default CodeController

export const CodeControllerNew = ({
	play,
	pause,
	reset,
	isStepping,
	canStepForward,
	canStepBackward,
	stepForward,
	stepBackward,
	isReset,
	start,
	startAndStepOnce,
	functionInputObjs,
}) => {
	const [delayMilliseconds, setDelayMilliseconds] = useState(500)
	const [functionInputDetails, setFunctionInputDetails] = useState(
		functionInputObjs
	)

	const functionArgs = functionInputDetails.map(
		inputDetails => inputDetails.value
	)

	return (
		<SpaceBetweenPaper>
			<ButtonGroup variant="contained" size="large">
				{isStepping ? (
					<MinWidthButton disabled={!canStepForward} onClick={pause}>
						PAUSE
						<PauseIcon />
					</MinWidthButton>
				) : (
					<MinWidthButton
						disabled={!isReset && !canStepForward}
						onClick={
							!isReset ? play : () => start(functionArgs, delayMilliseconds)
						}
					>
						PLAY
						<PlayArrowIcon />
					</MinWidthButton>
				)}
				<MinWidthButton
					onClick={
						!isReset
							? stepForward
							: () => startAndStepOnce(functionArgs, delayMilliseconds)
					}
					disabled={!isReset && (isStepping || !canStepForward)}
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
				<MinWidthButton onClick={reset} disabled={isStepping || isReset}>
					RESET
					<RefreshIcon />
				</MinWidthButton>
			</ButtonGroup>
			<span>
				{functionInputDetails.map((inputDetails, i) => {
					const { value, label, type, toValue, fromValue } = inputDetails
					return (
						<TextField
							type={type}
							label={label}
							value={fromValue ? fromValue(value) : value}
							onChange={event => {
								const updatedFunctionInputDetails = functionInputDetails.map(
									(details, j) =>
										i === j
											? toValue
												? { ...details, value: toValue(event.target.value) }
												: { ...details, value: event.target.value }
											: details
								)

								setFunctionInputDetails(updatedFunctionInputDetails)
							}}
							disabled={!isReset}
							key={i}
							variant="filled"
						/>
					)
				})}
				<TextField
					type="number"
					label="Delay (seconds)"
					value={(delayMilliseconds / 1000).toString()}
					onChange={event => {
						setDelayMilliseconds(1000 * event.target.value)
					}}
					disabled={!isReset}
					variant="filled"
				/>
			</span>
		</SpaceBetweenPaper>
	)
}
