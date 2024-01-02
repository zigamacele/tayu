import { green } from '../styles/chalk'

export const formatStats = (stat: string) => {
  const formattedStat = stat.replace(/[^0-9.]+/g, '')
  if (stat.includes('m')) {
    return Number(formattedStat + '000000')
  } else {
    return Number(formattedStat + '000')
  }
}

export const greenTextParenthesis = (text?: string | number) => {
  if (!text) return ''

  return green(`(${text})`)
}

const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumSignificantDigits: 3,
})

export const formatCurrency = (value: number | undefined) => {
  if (!value) {
    return ''
  }

  return USDollar.format(value)
}
