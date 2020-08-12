import React from 'react'
import scopeDistinctSubsequences from '../../recursive_modules/distinct_subsequences'
import CodeDisplay from '../../CodeDisplay'
import CodePlayer from '../../CodePlayer'
import { TextWrapper } from './../components'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Writing from './Writing'

const pythonCode = `
def solve_distinct_subsequences(to_use, target):
    def solve_with_inds(to_use_ind, target_ind):
        if target_ind == len(target):
            return 1
        elif to_use_ind == len(to_use):
            return 0

        ways_from_not_using_char = solve_with_inds(to_use_ind + 1, target_ind)		

        to_use_char = to_use[to_use_ind]
        target_char = target[target_ind]
        if to_use_char == target_char:
            ways_from_using_char = solve_with_inds(to_use_ind + 1, target_ind + 1)

            return ways_from_not_using_char + ways_from_using_char

        return ways_from_not_using_char

    return solve_with_inds(0, 0)
`

const Page = (): JSX.Element => {
	return (
		<>
			<TextWrapper>
				<Typography component="h1" variant="h4" paragraph={true}>
					<Link
						href="https://leetcode.com/problems/distinct-subsequences/"
						target="_blank"
						rel="noopener"
					>
						115. Distinct Subsequences
					</Link>
				</Typography>
				<Writing />
				<CodeDisplay pythonCode={pythonCode} />
			</TextWrapper>
			<CodePlayer
				scopeGeneratorFunc={scopeDistinctSubsequences}
				functionInputObjs={[
					{ value: 'babgbag', label: 'To Use', type: 'string' },
					{ value: 'bag', label: 'Target', type: 'string' },
				]}
			/>
		</>
	)
}

export default Page
