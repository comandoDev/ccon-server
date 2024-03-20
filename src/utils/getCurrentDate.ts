import moment from 'moment'

export const getCurrentDate = (): Date => {
  const date = new Date(moment().local().format('YYYY-MM-DD HH:mm:ss'))

  date.setHours(date.getHours() - 3)

  return date
}
