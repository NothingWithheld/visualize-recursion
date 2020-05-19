import React from 'react'
import useRecursionStepper, {
	useRecursionStepperNew,
} from './useRecursionStepper'
import CodeController, { CodeControllerNew } from './CodeController'
import RecursionCanvas, { RecursionCanvasNew } from './RecursionCanvas'

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

export const CodePlayerNew = ({ scopeGeneratorFunc, functionInputObjs }) => {
	const { treeRoot, ...codeControllerProps } = useRecursionStepperNew(
		scopeGeneratorFunc
	)

	return (
		<>
			<CodeControllerNew
				{...codeControllerProps}
				functionInputObjs={functionInputObjs}
			/>
			<RecursionCanvasNew treeRoot={treeRoot} />
		</>
	)
}
