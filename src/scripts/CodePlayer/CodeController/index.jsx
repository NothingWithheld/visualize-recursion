import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardRounded'
import ForwardIcon from '@material-ui/icons/Forward30Rounded'
import PlayArrowIcon from '@material-ui/icons/PlayArrowRounded'
import PauseIcon from '@material-ui/icons/PauseRounded'
import ReplayIcon from '@material-ui/icons/Replay30Outlined'
import TextField from '@material-ui/core/TextField'

const CodeController = ({
	play,
	pause,
	reset,
	isStepping,
	isCompleted,
	isStarted,
	start,
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
		<div>
			<span>
				{isStepping ? (
					<Button disabled={isCompleted} onClick={pause}>
						PAUSE
						<PauseIcon />
					</Button>
				) : (
					<Button
						disabled={isCompleted}
						onClick={
							isStarted ? play : () => start(delayMilliseconds, ...functionArgs)
						}
					>
						PLAY
						<PlayArrowIcon />
					</Button>
				)}
				<Button
					onClick={
						isStarted ? step : () => start(delayMilliseconds, ...functionArgs)
					}
					disabled={isStepping || isCompleted}
				>
					STEP
					<ForwardIcon />
				</Button>
				<Button onClick={reset} disabled={isStepping || !isStarted}>
					RESET
					<ReplayIcon />
				</Button>
			</span>
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
							key={i}
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
				/>
			</span>
		</div>
	)
}

export default CodeController
