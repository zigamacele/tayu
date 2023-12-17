export const getCurrentTable = () => {
  const currentDate = new Date()
  const previousMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  if (!previousMonth) {
    return `12-${currentYear - 1}`
  }

  return `${previousMonth}-${currentYear}`
}
