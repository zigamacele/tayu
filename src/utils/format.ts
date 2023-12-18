export const formatStats = (stat: string) => {
  const formatedStat = stat.replace(/[^0-9.]+/g, '')
  if (stat.includes('m')) {
    return Number(formatedStat + '000000')
  } else {
    return Number(formatedStat + '000')
  }
}
