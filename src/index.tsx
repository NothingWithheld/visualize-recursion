import React from 'react'
import ReactDOM from 'react-dom'
import CodePlayer from './CodePlayer'
import scopeFibonnaciGenerator from './recursive_modules/fibonacci'
import scopeEditDistGenerator from './recursive_modules/edit_distance'
import scopeDistinctSubsequences from './recursive_modules/distinct_subsequences'

ReactDOM.render(
	<>
		<CodePlayer
			scopeGeneratorFunc={scopeDistinctSubsequences}
			functionInputObjs={[
				{ value: 'babgbag', label: 'To Use', type: 'string' },
				{ value: 'bag', label: 'Target', type: 'string' },
			]}
		/>
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
