import React from 'react'
import useRecursionStepper from './useRecursionStepper'
import CodeController from './CodeController'
import RecursionCanvas from './RecursionCanvas'

const CodePlayer = ({ scopeGeneratorFunc, functionInputObjs }) => {
	const {
		play,
		pause,
		reset,
		isStepping,
		isCompleted,
		isStarted,
		start,
		startAndStepOnce,
		step,
		nodes,
	} = useRecursionStepper(scopeGeneratorFunc)

	return (
		<>
			<CodeController
				play={play}
				pause={pause}
				reset={reset}
				isStepping={isStepping}
				isCompleted={isCompleted}
				isStarted={isStarted}
				start={start}
				startAndStepOnce={startAndStepOnce}
				step={step}
				functionInputObjs={functionInputObjs}
			/>
			<RecursionCanvas nodes={nodes} />
		</>
	)
}

export default CodePlayer
