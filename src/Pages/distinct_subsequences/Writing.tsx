/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { InlineCode } from '../components'
import Typography from '@material-ui/core/Typography'

const Writing = (): JSX.Element => {
	return (
		<>
			<Typography variant="body1" paragraph={true}>
				<b>Problem:</b> Given a string <InlineCode code="S" /> and a string{' '}
				<InlineCode code="T" />, count the number of distinct subsequences of{' '}
				<InlineCode code="S" /> which equals <InlineCode code="T" />.
			</Typography>
			<Typography variant="body1" paragraph={true}>
				From here on, I'll refer to <InlineCode code="S" /> as{' '}
				<InlineCode code="toUse" /> and <InlineCode code="T" /> as{' '}
				<InlineCode code="target" />.
			</Typography>
			<Typography variant="body1" paragraph={true}>
				<b>Example:</b> The number of distinct subsequences of{' '}
				<InlineCode code={'toUse = "aab"'} /> which equals{' '}
				<InlineCode code={'target = "ab"'} /> is <InlineCode code="2" />. The
				subsequences are <InlineCode code="(a)a(b)" /> and{' '}
				<InlineCode code="a(ab)" /> (characters used for the subsequence are in
				parentheses).
			</Typography>
			<Typography variant="body1" paragraph={true}>
				We're using the power of computers, so naturally a first approach is to
				try all possibilities. This would be generating all subsequences of{' '}
				<InlineCode code="toUse" /> and seeing how many are equal to{' '}
				<InlineCode code="target" />. It'll work, but these subsequence problems
				usually seem to have a recursive implementation that we can easily
				optimize (later) via memoization.
			</Typography>
			<Typography variant="body1" paragraph={true}>
				Let's try to find some subproblems. Looking again at{' '}
				<InlineCode code={'toUse = "aab"'} /> and{' '}
				<InlineCode code={'target = "ab"'} />, I see both strings share the same
				first character. In one of the matching subsequences, this first{' '}
				<InlineCode code="a" /> from <InlineCode code="toUse" /> was used, but
				it wasn't in the other matching subsequence. So how do we know whether
				or not to use a character? Easily, we can try both possibilities with
				recursion!
			</Typography>
			<Typography variant="body1" paragraph={true}>
				Continuing with our example, the number subsequences from choosing to
				use the first <InlineCode code="a" /> will be the number of subsequences
				from the subproblem with <InlineCode code={'toUse = "ab"'} /> and{' '}
				<InlineCode code={'target = "b"'} />. We use the first character from{' '}
				<InlineCode code="toUse" /> to fill the spot of the first character of{' '}
				<InlineCode code="target" />. We move both strings "up a character."
			</Typography>
			<Typography variant="body1" paragraph={true}>
				The number of subsequences from choosing not to use the first{' '}
				<InlineCode code="a" /> will be the number of subsequences from the
				subproblem with <InlineCode code={'toUse = "ab"'} /> and{' '}
				<InlineCode code={'target = "ab"'} />. We skip the first character of{' '}
				<InlineCode code="toUse" /> to not use it. Here, we only move{' '}
				<InlineCode code="toUse" /> "up a character."
			</Typography>
			<Typography variant="body1" paragraph={true}>
				Naturally, trying both possibilities only works when both first
				characters match. If there's no match, we just have to move{' '}
				<InlineCode code="toUse" /> "up a character."
			</Typography>
			<Typography variant="body1" paragraph={true}>
				What if <InlineCode code={'target = ""'} />? There won't be a first
				character to compare. In this case, it means we've matched all the
				characters in <InlineCode code="target" /> and the choices of characters
				we've used will be <InlineCode code="1" /> subsequence.
			</Typography>
			<Typography variant="body1" paragraph={true}>
				If <InlineCode code={'toUse = ""'} /> and{' '}
				<InlineCode code={'target != ""'} />, then we've run out of characters
				to use for a subsequence. We won't be able to create a matching
				subsequence. The choices of characters we've used will be{' '}
				<InlineCode code="0" /> subsequences.
			</Typography>
			<Typography variant="body1" paragraph={true}>
				That should cover all the cases for any two strings. The code below uses
				an index to represent a substring of an initial input string (to save
				time by not generating substrings). For example,{' '}
				<InlineCode code="toUseInd = 3" /> with{' '}
				<InlineCode code={'toUse = "testString"'} /> represents the substring{' '}
				<InlineCode code={'tString'} />.
			</Typography>
		</>
	)
}

export default Writing
