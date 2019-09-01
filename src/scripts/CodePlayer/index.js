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
				step={step}
				functionInputObjs={functionInputObjs}
			/>
			<hr />
			<RecursionCanvas nodes={nodes} />
			<hr />
		</>
	)
}

export default CodePlayer
