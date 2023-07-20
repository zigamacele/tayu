import dayjs from 'dayjs'

export const getCurrentTable = () => {
  return `${dayjs().month() + 1}-${dayjs().year()}`
}
