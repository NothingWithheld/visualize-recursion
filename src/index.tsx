/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import ReactDOM from 'react-dom'
import DistinctSubsequencesPage from './Pages/distinct_subsequences'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

const IntroWriting = (): JSX.Element => {
	return (
		<Box
			display="flex"
			flexDirection="column"
			maxWidth="900px"
			margin="48px auto"
		>
			<Typography component="h1" variant="h3" paragraph={true}>
				Under Construction
			</Typography>
			<Typography variant="body1" paragraph={true}>
				This is an incomplete, in progress effort. My goal is to share how I
				think about recursion<span>&mdash;</span>how it's more than a technique.
				It's a formula. Later, I'll also break down dynamic programming. To me,
				it doesn't require massive amounts of forethought to decide what
				information needs to be stored where. It's just a wrapper on recursion.
				To help visualize the recursive calls, I'm working on a "recursion
				debugger." There's a sneak peek of what's to come below.
			</Typography>
		</Box>
	)
}

ReactDOM.render(
	<>
		<IntroWriting />
		<DistinctSubsequencesPage />
	</>,
	document.getElementById('react')
)
