import inquirer from 'inquirer'

import { Answers } from '../types/inquirer'
import { greenTextParenthesis } from '../utils/format'
import { getCurrentTable } from '../utils/timeDate'

const timeoutChoices = [
  { name: '0.25 min', value: 0.25 },
  { name: '0.5 min', value: 0.5 },
  { name: '1 min', value: 1 },
]

const modeChoices = [
  { name: 'Full', value: 'full' },
  { name: 'Partial', value: 'partial' },
]

const promptQuestions = [
  {
    name: 'mode',
    type: 'list',
    message: 'In what mode do you want to run Tayu:',
    choices: modeChoices,
  },
  {
    name: 'partial',
    type: 'input',
    message: 'Enter array of game IDs to run:',
    when: (answers: Answers) => answers.mode === 'partial',
  },
  {
    name: 'defaultTimeout',
    type: 'confirm',
    message: `Default timeout? ${greenTextParenthesis(
      timeoutChoices[1]?.name,
    )}`,
  },
  {
    name: 'timeout',
    type: 'list',
    message: 'Timeout between games:',
    choices: timeoutChoices,
    when: (answers: Answers) => !answers.defaultTimeout,
  },
  {
    name: 'currentTable',
    type: 'confirm',
    message: `Current months table? ${greenTextParenthesis(getCurrentTable())}`,
  },
  {
    name: 'table',
    type: 'input',
    message: 'Enter table name:',
    when: (answers: Answers) => !answers.currentTable,
  },
  {
    name: 'perms',
    type: 'confirm',
    message: 'Test database permissions?',
  },
]

export const getSessionConfig = () => {
  return inquirer
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
