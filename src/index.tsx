import CodePlayer from './CodePlayer'
import scopeFibonnaciGenerator from './recursive_modules/fibonacci'
import scopeEditDistGenerator from './recursive_modules/edit_distance'
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
	<>
		<CodePlayer
			scopeGeneratorFunc={scopeFibonnaciGenerator}
			functionInputObjs={[
				{
					value: 7,
					label: 'Fibonacci Number of',
					type: 'number',
					toValue: (val) => val.toString(),
					fromValue: (val) => parseInt(val, 10),
				},
			]}
		/>
		<CodePlayer
			scopeGeneratorFunc={scopeEditDistGenerator}
			functionInputObjs={[
				{ value: 'horse', label: 'To Change', type: 'string' },
				{ value: 'ros', label: 'To Match', type: 'string' },
			]}
		/>
	</>,
	document.getElementById('react')
)
