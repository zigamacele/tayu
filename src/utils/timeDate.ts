import dayjs from 'dayjs'

export const getCurrentTable = () => {
  if (!dayjs().month()) {
    return `11-${dayjs().year() - 1}`
  }

  return `${dayjs().month()}-${dayjs().year()}`
}
