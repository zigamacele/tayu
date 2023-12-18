import { green } from '../styles/chalk'

export const formatStats = (stat: string) => {
  const formatedStat = stat.replace(/[^0-9.]+/g, '')
  if (stat.includes('m')) {
    return Number(formatedStat + '000000')
  } else {
    return Number(formatedStat + '000')
  }
}

export const greenTextParenthesis = (text?: string | number) => {
  if (!text) return ''

  return green(`(${text})`)
}
