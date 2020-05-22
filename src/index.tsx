import CodePlayer from './CodePlayer'
import scopeFibonnaciGenerator from './recursive_modules/fibonacci'
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
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
	/>,
	document.getElementById('react')
)
