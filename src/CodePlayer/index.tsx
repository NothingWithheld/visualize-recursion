import React from 'react'
import useRecursionStepper from './useRecursionStepper'
import CodeController, { FunctionInputObj } from './CodeController'
import RecursionCanvas from './RecursionCanvas'
import { MakeNodeFunc, NodeGeneratorFunc } from '../nodes/useNodes/utils'

interface CodePlayerProps {
	readonly scopeGeneratorFunc: (makeNode: MakeNodeFunc) => NodeGeneratorFunc
	readonly functionInputObjs: FunctionInputObj[]
}

export const CodePlayer = ({
	scopeGeneratorFunc,
	functionInputObjs,
}: CodePlayerProps) => {
	const { treeRoot, ...codeControllerProps } = useRecursionStepper(
		scopeGeneratorFunc
	)

	return (
		<>
			<CodeController
				{...codeControllerProps}
				functionInputObjs={functionInputObjs}
			/>
			<RecursionCanvas treeRoot={treeRoot} />
		</>
	)
}

export default CodePlayer
