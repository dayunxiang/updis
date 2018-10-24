export function getOneDay() {
  let startTime = "00:00:00"
  let endTime = "23:59:59"
  let date = new Date;
  let year = date.getFullYear()
  let month = date.getMonth()+1
  let day = date.getDate()
  if(day < 10) {
    day = `0${day}`
  }
  let scopeDate = []
  let scopeDateByHour = []
  for(let i=1; i<=24; i++) {
    let hour = i
    scopeDateByHour.push(`${i}时`)
    if(i<10) {
      hour = `0${i}`
    }
    scopeDate.push(`${hour}:00:00`)
  }

  return {
    startDate:`${year}-${month}-${day} ${startTime}`,
    endDate:`${year}-${month}-${day} ${endTime}`,
    scopeDate,
    scopeDateByHour,
  }
}

export function getOneMonth() {
	  let startTime = "00:00:00"
    let endTime = "23:59:59"
    let startDay = "01"
    let endDay = null
    let date = new Date;
    let year = date.getFullYear()
    let month = date.getMonth()+1
    let bigMonths = [1,3,5,7,8,10,12]
    let scopeDate = []

    if( parseInt(month) < 10 ) {
      month = `0${month}`
    }
    
    if( parseInt(month) === 2 ) {
      if( (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0) ) {
        endDay = "29"
      }else{
        endDay = "28"
      }
    } else if( bigMonths.includes(parseInt(month)) ) {
        endDay = "31"
    } else {
        endDay = "30"
    }

    for(let i=1; i<=endDay; i++) {
      if( i<10 ) {
        i = `0${i}`
      }
      scopeDate.push(`${year}-${month}-${i}`)
    } 

    return {
      startDate:`${year}-${month}-${startDay} ${startTime}`,
      endDate:`${year}-${month}-${endDay} ${endTime}`,
      scopeDate,
    }
}

export function getOneWeek() {

}

export function getOneYear() {

}