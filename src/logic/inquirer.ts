import inquirer from 'inquirer'

import { promptQuestions } from '../constants/inquirer'
import { Answers } from '../types/inquirer'

export const getSessionConfig = async () => {
  return await inquirer
    .prompt(promptQuestions)
    .then((answers: Answers) => {
      return answers
    })
    .catch((error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.isTtyError) {
        console.error("Prompt couldn't be rendered in the current environment")
      } else {
        console.error('Something else went wrong')
      }
    })
}
