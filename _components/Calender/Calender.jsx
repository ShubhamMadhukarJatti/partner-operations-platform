import { isDateInNextMonth } from '../utils/isDateInNextMonth'

const Calendar = ({ setSelectedDate, selectedDate, disabledToday = false }) => {
  const firstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const renderMonth = (month, year) => {
    const currentDate = new Date()

    function generateDateRangeArray(startDate, endDate) {
      const dateArray = []
      let currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        )
        dateArray.push({
          startDate: new Date(currentDate),
          endDate: endOfMonth < endDate ? endOfMonth : new Date(endDate)
        })

        currentDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          1
        )
      }

      return dateArray
    }

    const twoWeeksFromNow = new Date()
    twoWeeksFromNow.setDate(currentDate.getDate() + 14)

    const dateArray = generateDateRangeArray(currentDate, twoWeeksFromNow)
    const firstDay =
      currentDate.getMonth() === month
        ? currentDate.getDay()
        : firstDayOfMonth(month, year) +
          dateArray[1].startDate.getDay() -
          firstDayOfMonth(month, year)

    function getDayOfMonth(date) {
      return date.getDate()
    }

    function generateNumberArray(start, end) {
      const numberArray = []

      for (let i = start; i < end + currentDate.getDay(); i++) {
        numberArray.push(i)
      }

      return numberArray
    }

    const monthArray =
      currentDate.getMonth() === month
        ? generateNumberArray(
            getDayOfMonth(dateArray[0].startDate) - 1,
            getDayOfMonth(dateArray[0].endDate)
          )
        : generateNumberArray(
            getDayOfMonth(dateArray[1].startDate) - 1,
            getDayOfMonth(dateArray[1].endDate)
          )

    const checkDisable = (date) => {
      let isDisable = false
      const currentDate = new Date()

      if (
        date.getFullYear() < currentDate.getFullYear() ||
        (date.getFullYear() === currentDate.getFullYear() &&
          date.getMonth() < currentDate.getMonth()) ||
        (date.getFullYear() === currentDate.getFullYear() &&
          date.getMonth() === currentDate.getMonth() &&
          date.getDate() <= currentDate.getDate())
      ) {
        if (disabledToday) {
          isDisable = true
        }
      }

      const twoWeeksFromNow = new Date()
      twoWeeksFromNow.setDate(currentDate.getDate() + 14)

      if (
        date.getDay() === 6 ||
        date.getDay() === 0 ||
        date >= twoWeeksFromNow
      ) {
        isDisable = true
      }

      return isDisable
    }

    return (
      <div className='w-[325px]'>
        {monthArray.map((day, index) => {
          if (index < firstDay) {
            return (
              <div
                key={index}
                className='inline-flex h-[45px] w-[45px] items-center justify-center'
              >
                <div className='inline-flex h-[45px] w-[45px] items-center justify-center p-[3px]'>
                  <div className='inline-flex h-[39px] w-[39px] items-center justify-center rounded-[15px]'>
                    <div className="h-[39px] w-[39px] text-center font-['Inter'] text-base font-normal text-white">
                      {day - firstDay + 1}
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          const date = new Date(year, month, day - firstDay + 1)
          const isDisable = checkDisable(date)
          const isSelected = isDisable
            ? false
            : date.toDateString() === selectedDate.toDateString()

          return (
            <>
              {isSelected ? (
                <div className='inline-flex h-[45px] w-[45px] items-center justify-center'>
                  <div className='inline-flex h-[45px] w-[45px] items-center justify-center p-[3px]'>
                    <div className='flex h-[39px] w-[39px] items-center justify-center rounded-[15px] bg-primary'>
                      <div className="text-center font-['Inter'] text-base font-normal text-white">
                        {day - firstDay + 1}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={isDisable ? undefined : () => setSelectedDate(date)}
                  className='inline-flex h-[45px] w-[45px] cursor-pointer items-center
                  justify-center'
                >
                  <div className='inline-flex h-[45px] w-[45px] items-center justify-center p-[3px]'>
                    <div className='inline-flex h-[39px] w-[39px] items-center justify-center rounded-[15px]'>
                      <div
                        className={` text-center font-['Inter'] text-base font-normal ${
                          isDisable ? 'text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {day - firstDay + 1}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )
        })}
      </div>
    )
  }

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  return (
    <div className='xm-sm:w-[440px] container flex  flex-col justify-center'>
      <div className='mb-[10px] flex w-[380px] flex-row justify-center border-b px-[77px]'>
        {daysOfWeek.map((i) => (
          <div
            key={i}
            className='inline-flex h-[45px] w-[45px] items-center justify-center'
          >
            <div className='inline-flex h-[45px] w-[45px] items-center justify-center p-[3px]'>
              <div className='inline-flex items-center justify-center rounded-[15px]'>
                <div className="text-center font-['Inter'] text-[15px] font-normal text-slate-800">
                  {i}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex w-[380px] flex-row justify-center border-b  pb-3'>
        {isDateInNextMonth() ? (
          <div className='flex flex-col'>
            {renderMonth(new Date().getMonth(), new Date().getFullYear())}
            {renderMonth(new Date().getMonth() + 1, new Date().getFullYear())}
          </div>
        ) : (
          renderMonth(new Date().getMonth(), new Date().getFullYear())
        )}
      </div>
    </div>
  )
}

export default Calendar
