export function isDateInNextMonth() {
  const currentDate = new Date()

  const futureDate = new Date(currentDate)
  futureDate.setDate(currentDate.getDate() + 7)

  const nextMonthDate = new Date()
  nextMonthDate.setMonth(nextMonthDate.getMonth())
  return futureDate.getMonth() !== nextMonthDate.getMonth()
}
