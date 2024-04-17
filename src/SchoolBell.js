import React, { useEffect, useState } from 'react';
import './SchoolBell.css';
import { FOCUSABLE_SELECTOR, isLabelWithInternallyDisabledControl } from '@testing-library/user-event/dist/utils';
import logo from './bannerlogo.webp';
import logo2 from './OIG1.jpg';

import axios from 'axios'; // Import Axios library for making HTTP requests
import * as days from "./utils/CalendarType"
import { specialCharMap } from '@testing-library/user-event/dist/keyboard';
import ShareButton from './ShareButton';
import { act } from 'react-dom/test-utils';

const SchoolBell = ({setQRCode, isQRCode}) => {
  const [scheduleData, setScheduleData] = useState([]);
  const [dayType, setDayType] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [currPeriod, setCurrPeriod] = useState("");
  const [selectedDate, setSelectedDate] = useState('Select A Date');
  const [updating, setUpdating] = useState(true);
  const [beforeDay, setBeforeDay] = useState("Today is");
  const [link, setLink] = useState("https://www.woodsidehs.org/");
  const [date, setDate] = useState("");
  const [dotw, setDOTW] = useState("");

  const url = 'https://anorakthegreat.github.io/WoodsideBell/';
  const title = 'ahhhhh';

  //special days
  const [indicatorArray, setIndicator] = useState([])



  const loggg = () => {
    // setDayType("AHAH")
    // console.log(dayType)
    // console.log(getDayy(true, new Date("2024-04-16")))
    // console.log(date)
    // let detee = new Date()
    // detee.setFullYear(2024)
    // detee.setMonth(4-1)
    // detee.setDate(15)

    // console.log(getDayy(true, detee))


    determineCurrentPeriod2(scheduleData)


    let currTime = new Date()
    currTime = currTime.getTime()

    if(dayType == " an A DAY " || dayType == " a B DAY " || dayType == " a B DAY Wed " || dayType == " an A DAY Wed "){
      for(let i = 0; i < scheduleData.length; i++){
        let gapStart = 0  
        let period = scheduleData[i].period

        if(period == "5th period" || period == "4th period"){
          const [startTime, endTime] = scheduleData[i].time.split(' - '); 
          const [time, meridiem] = startTime.split(' '); 
          const [hours, minutes] = time.split(':').map(Number); 
          if (startTime.includes("PM")) {
            gapStart += 43200000
          } else{
          }

          let date = new Date()
          date.setHours(hours);
          date.setMinutes(minutes);

          let startEpoch = date.getTime() + gapStart - 300000
          let endEpoch = startEpoch + 300000


          if(currTime > startEpoch){
            if(currTime < endEpoch){
              setLink("https://www.youtube.com/@woodsidehighschoolvideopro3460/live")
            }
          }
        }
      }

    }


  }

  // const loggg = () => {
  //   console.log(dayType)
  // }
  const fetchData = (day) => {
    // console.log("I AM RUNNNNINGGGG")
    let data = [];

    let isADay = false
    let lastPeriod = 0

    let calendar = {
      'Wed' : days.dayWed,
      "Wildcat" : days.dayWild,
      "Minimum" : days.dayMin,
      "Reg" : days.dayReg,
      "Break" : days.dayBreak,
      "Weekend" : days.dayWeekend,
      "Final" : days.finals

    }

    const [rawType, specialString] = day.split('/'); // Split the time range string into start time and end time
   

    if(day == "")
      return

    if(rawType == "Final"){
      data = calendar[rawType][specialString]
      let datav3 = calculateDuration(data, specialString)
      setDayType("Finals! ")
      setScheduleData(datav3);
      determineCurrentPeriod(datav3, day)
      setUpdating(true)
      return
    }
    
    data = calendar[specialString].data

    
    if(rawType != "None"){
      if(rawType == "A DAY "){
        isADay = true
        lastPeriod = 3
      } else{
        isADay = false
        lastPeriod = 2
      }
    }

    for(let i = 0; i < data.length; i++){
      if(data[i].period == "x"){
        if(lastPeriod == 3){
          data[i].period = "3rd period"
        } else if(lastPeriod == 2){
          data[i].period = "2nd period"
        } else{
          data[i].period = lastPeriod + "th period"
        }
        lastPeriod+=2
      }
    }

    if(specialString == "Weekend" || specialString == "Break"){
      setDayType("the " + specialString)
    }

    if(rawType == "A DAY "){
      if(specialString == "Reg" || specialString == "Wed"){
        setDayType("an A DAY")
      } else{
        setDayType("an A DAY " + specialString)
      }
    }

    if(rawType == "B DAY "){
      if(specialString == "Reg" || specialString == "Wed"){
        setDayType("a B DAY")
      } else{
        setDayType("a B DAY " + specialString)
      }
    }

    


    
    
    // if(day == ("Weekend")){
    //   setDayType("the Weekend")
    // } else if(day == ("Break")){
    //   setDayType("the Break")
    // }else if(day == ("B DAY ")){
    //   setDayType(" a " + day)
    // } else if(day == ("A DAY Wed")){
    //   setDayType(" an " + "A DAY")
    // }else if(day == ("B DAY Wed")){
    //   setDayType(" a " + "B DAY")
    // }else if(day == ("B DAY Minimum")){
    //   setDayType(" a " + "Minimum B DAY")
    // }else if(day == ("A DAY Minimum")){
    //   setDayType(" a " + "Minimum A DAY ")
    // }else if(day == ("B DAY Wildcat")){
    //   setDayType(" a " + "Wildcat B DAY ")
    // }else if(day == ("A DAY Wildcat")){
    //   setDayType(" a " + "Wildcat A DAY ")
    // }else if(day == ""){
    // } else {
    //   setDayType(" an " + day)

    // }

    let datav2 = calculateDuration(data, specialString)
   
    setScheduleData(datav2);

    determineCurrentPeriod(datav2, day)

    setUpdating(true)

  };

  const calculateDuration = (data, specialString) => {
    
    for(let i = 0; i < data.length; i++){

      if(specialString == "Weekend" || specialString == "Break"){
        data[i].duration = 0
        continue
      }

      const [startTime, endTime] = data[i].time.split(' - '); // Split the time range string into start time and end time

      let gapStart = 0;
      let gapEnd = 0;
      let timeString = startTime
      let startHours = 0
      let endHours = 0
  
      let endEpoch = 0
      let startEpoch = 0
  
      const [time, meridiem] = timeString.split(' '); // Split the time string into time and meridiem (AM/PM)
      const [hours, minutes] = time.split(':').map(Number); // Split hours and minutes and convert them to numbers
  
      if (timeString.includes("PM") && hours != 12) {
          gapStart += 43200000
      } else{
      }
  
      startHours = hours
  
      let date = new Date()
      date.setHours(startHours);
      date.setMinutes(minutes);
      startEpoch = date.getTime() + gapStart
  
      const [timeEnd, meridiemEnd] = endTime.split(' '); // Split the time string into time and meridiem (AM/PM)
      const [hoursEnd, minutesEnd] = timeEnd.split(':').map(Number); // Split hours and minutes and convert them to numbers
  
      if (endTime.includes("PM") && hoursEnd != 12) {
        gapEnd += 43200000
      } else{
      }
  
      endHours = hoursEnd
  
      let dateEnd = new Date()
      dateEnd.setHours(endHours);
      dateEnd.setMinutes(minutesEnd);
      endEpoch = dateEnd.getTime() + gapEnd

      let dur = endEpoch - startEpoch;
      // console.log(endEpoch)
      // console.log(sta)

      
      dur = dur / 60000
      data[i].duration = Math.round(dur);

    }

    return data
    


  }

  const getDayy = (withDate, date) => {
      // Get the current date
       // Clone the dates to avoid modifying the original dates
      //  console.log("THIS IS THE DAY 1")
      
      let isBreak = false

      let dateArray = ['2024-03-05T00:00:00-08:00', '2024-04-15T00:00:00-08:00'];

      let breakArray = ['2024-04-08T00:00:00-08:00', '2024-04-09T00:00:00-08:00', '2024-04-10T00:00:00-08:00', '2024-04-11T00:00:00-08:00', '2024-04-12T00:00:00-08:00']

      let wildcatArray = ['2024-04-05T00:00:00-08:00']

      let minimumArray = []

      let realStart

      let specialString = ""

      let index = -1

      if(withDate){
        realStart = date 

      } else {
        realStart = new Date()  

      }
      

      // console.log("INDICATOR ARAYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY" + indicatorArray)

      // realStart.setDate(2)

      
      realStart.setHours(0);
      realStart.setMinutes(0);
      realStart.setSeconds(0);
      realStart.setMilliseconds(0);

      if(realStart.getDay() == 3){
        specialString = "Wed"
      }

      



      if(indicatorArray.length == 0){
        return ""
      } else {
        for(let i = 0; i < indicatorArray.length; i++){
          for(let m = 0; m < indicatorArray[i].arr.length; m++){
            let currDate = new Date(indicatorArray[i].arr[m])
            currDate.setHours(0);
            currDate.setMinutes(0);
            currDate.setSeconds(0);
            currDate.setMilliseconds(0);

            if(realStart.getTime() == currDate.getTime()){
              // console.log(indicatorArray[i].ind)
              if(indicatorArray[i].ind == "A Day"){
                dateArray.push(indicatorArray[i].arr[m])
              }
              // if(indicatorArray[i].ind == "Break"){
              //   // return indicatorArray[i].ind
              //   // isBreak = true
              // }
              index = m
              specialString = indicatorArray[i].ind 

            }

          }
        }
      }


      if(specialString == "Break"){
        return "None/Break"
      }

      if(specialString == "Final"){
        index+=1

        let indexToWord = ""

        if(index == 1){
          indexToWord = "one"
        } else if(index == 2){
          indexToWord = "two"
        }else if(index == 3){
          indexToWord = "three"
        }else if(index == 4){
          indexToWord = "four"
        }else{
          indexToWord = "na"
        }
        return "Final/"+ indexToWord
      }
      

  



      // let realStart = new Date('2024-04-06T00:00:00-08:00')

      
      // console.log("REEEEL START " + realStart)
      
      let closestDate = findClosestPastDate(realStart, dateArray)
      // console.log("CLOSEST DATE: " + closestDate)
      
      let start = new Date(closestDate);
      // const end = new Date("2024-03-07T00:00:00-08:00");
      let end = realStart;

      const timeDiff = Math.abs(end.getTime() - start.getTime());
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      let weekends = Math.floor((daysDiff + start.getDay()) / 7) * 2;

      // console.log("WEEKENDS " + weekends)
      if (start.getDay() === 0) weekends--;
      if (end.getDay() === 6) weekends--;

      let businessDays = daysDiff - weekends;


      // for(let i = 0; i < breakArray.length; i++){
      //   let date = new Date(breakArray[i])
      //   date.setHours(0);
      //   date.setMinutes(0);
      //   date.setSeconds(0);
      //   date.setMilliseconds(0);

      //   if(realStart.getTime() == date.getTime()){
      //     return "Break"
      //   }
      // }

      

      if(realStart.getDay() == 0 || realStart.getDay() == 6){
        return "None/Weekend"
      }

      

      let rawType = ""
      if(businessDays %2 == 0){
        rawType = "A DAY "
      } else{
        rawType = "B DAY "
      }

      for(let i = 0; i < dateArray.length; i++){
        let iter = dateArray[i]

        iter = new Date(iter)

        iter.setHours(0)
        iter.setMinutes(0)
        iter.setSeconds(0)
        iter.setMilliseconds(0)

        let newNew = realStart
        newNew.setHours(0)
        newNew.setMinutes(0)
        newNew.setSeconds(0)
        newNew.setMilliseconds(0)

        if(iter.getTime() == newNew.getTime()){
          rawType = "A DAY "
          specialString = ""
        }

      }

      
      
      if(specialString == ""){
        specialString = "Reg"
      }
      return rawType + "/" + specialString




  }

  const getDayy2 = (withDate, date) => {
    // Get the current date
     // Clone the dates to avoid modifying the original dates

    let dateArray = ['2024-03-05T00:00:00-08:00', '2024-04-15T00:00:00-08:00'];

    let breakArray = ['2024-04-08T00:00:00-08:00', '2024-04-09T00:00:00-08:00', '2024-04-10T00:00:00-08:00', '2024-04-11T00:00:00-08:00', '2024-04-12T00:00:00-08:00']

    let wildcatArray = ['2024-04-05T00:00:00-08:00']

    let minimumArray = []

    let realStart

    let specialString = ""

    if(withDate){
      realStart = date 

    } else {
      realStart = new Date()  

    }

    // console.log("THIS IS THE DAY 2")


    for(const arr of indicatorArray){
      for(const dater of arr){
        let currDate = new Date(dater)
        dater.setHours(0);
        dater.setMinutes(0);
        dater.setSeconds(0);
        dater.setMilliseconds(0);

        if(realStart.getTime() == dater.getTime()){
          // console.log("AHAHAH I FOUND ITTTTT")
          return arr.indicator
        }

      }
    }

    // let realStart = new Date('2024-04-06T00:00:00-08:00')

    realStart.setHours(0);
    realStart.setMinutes(0);
    realStart.setSeconds(0);
    realStart.setMilliseconds(0);
    
    // console.log("REEEEL START " + realStart)
    
    let closestDate = findClosestPastDate(realStart, dateArray)
    // console.log("CLOSEST DATE: " + closestDate)
    
    let start = new Date(closestDate);
    // const end = new Date("2024-03-07T00:00:00-08:00");
    let end = realStart;

    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    let weekends = Math.floor((daysDiff + start.getDay()) / 7) * 2;

    // console.log("WEEKENDS " + weekends)
    if (start.getDay() === 0) weekends--;
    if (end.getDay() === 6) weekends--;

    let businessDays = daysDiff - weekends;


    for(let i = 0; i < breakArray.length; i++){
      let date = new Date(breakArray[i])
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      if(realStart.getTime() == date.getTime()){
        return "Break"
      }
    }

    

    if(realStart.getDay() == 0 || realStart.getDay() == 6){
      return "Weekend"
    }

    

    let rawType = ""
    if(businessDays %2 == 0){
      rawType = "A DAY "
    } else{
      rawType = "B DAY "
    }

    for(let i = 0; i < dateArray.length; i++){
      let iter = dateArray[i]

      iter = new Date(iter)

      iter.setHours(0)
      iter.setMinutes(0)
      iter.setSeconds(0)
      iter.setMilliseconds(0)

      let newNew = realStart
      newNew.setHours(0)
      newNew.setMinutes(0)
      newNew.setSeconds(0)
      newNew.setMilliseconds(0)

      if(iter.getTime() == newNew.getTime()){
        rawType = "A DAY "
      }

    }

    if(realStart.getDay() == 3){
      specialString = "Wed"
    }

    for(let i = 0; i < wildcatArray.length; i++){
      let date = new Date(wildcatArray[i])
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      if(realStart.getTime() == date.getTime()){
        specialString = "Wildcat"
      }
    }

    for(let i = 0; i < minimumArray.length; i++){
      let date = new Date(minimumArray[i])
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      if(realStart.getTime() == date.getTime()){
        specialString = "Minimum"
      }
    }

    return rawType + specialString




}

const getDayy3 = (withDate, date) => {
  // Get the current date
   // Clone the dates to avoid modifying the original dates

  let dateArray = ['2024-03-05T00:00:00-08:00', '2024-04-15T00:00:00-08:00'];

  let breakArray = ['2024-04-08T00:00:00-08:00', '2024-04-09T00:00:00-08:00', '2024-04-10T00:00:00-08:00', '2024-04-11T00:00:00-08:00', '2024-04-12T00:00:00-08:00']

  let wildcatArray = ['2024-04-05T00:00:00-08:00']

  let minimumArray = []

  let realStart

  let specialString = ""

  if(withDate){
    realStart = date 

  } else {
    realStart = new Date()  

  }

  // console.log("THIS IS THE INDICATOR")

  // console.log(indicatorArray)

  for(const arr of indicatorArray){
    for(const dater of arr){
      let currDate = new Date(dater)
      dater.setHours(0);
      dater.setMinutes(0);
      dater.setSeconds(0);
      dater.setMilliseconds(0);

      if(realStart.getTime() == dater.getTime()){
        // console.log("AHAHAH I FOUND ITTTTT")
        return arr.indicator
      }

    }
  }

  // let realStart = new Date('2024-04-06T00:00:00-08:00')

  realStart.setHours(0);
  realStart.setMinutes(0);
  realStart.setSeconds(0);
  realStart.setMilliseconds(0);
  
  // console.log("REEEEL START " + realStart)
  
  let closestDate = findClosestPastDate(realStart, dateArray)
  // console.log("CLOSEST DATE: " + closestDate)
  
  let start = new Date(closestDate);
  // const end = new Date("2024-03-07T00:00:00-08:00");
  let end = realStart;

  const timeDiff = Math.abs(end.getTime() - start.getTime());
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  let weekends = Math.floor((daysDiff + start.getDay()) / 7) * 2;

  // console.log("WEEKENDS " + weekends)
  if (start.getDay() === 0) weekends--;
  if (end.getDay() === 6) weekends--;

  let businessDays = daysDiff - weekends;


  for(let i = 0; i < breakArray.length; i++){
    let date = new Date(breakArray[i])
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    if(realStart.getTime() == date.getTime()){
      return "Break"
    }
  }

  

  if(realStart.getDay() == 0 || realStart.getDay() == 6){
    return "Weekend"
  }

  

  let rawType = ""
  if(businessDays %2 == 0){
    rawType = "A DAY "
  } else{
    rawType = "B DAY "
  }

  for(let i = 0; i < dateArray.length; i++){
    let iter = dateArray[i]

    iter = new Date(iter)

    iter.setHours(0)
    iter.setMinutes(0)
    iter.setSeconds(0)
    iter.setMilliseconds(0)

    let newNew = realStart
    newNew.setHours(0)
    newNew.setMinutes(0)
    newNew.setSeconds(0)
    newNew.setMilliseconds(0)

    if(iter.getTime() == newNew.getTime()){
      rawType = "A DAY "
    }

  }

  if(realStart.getDay() == 3){
    specialString = "Wed"
  }

  for(let i = 0; i < wildcatArray.length; i++){
    let date = new Date(wildcatArray[i])
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    if(realStart.getTime() == date.getTime()){
      specialString = "Wildcat"
    }
  }

  for(let i = 0; i < minimumArray.length; i++){
    let date = new Date(minimumArray[i])
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    if(realStart.getTime() == date.getTime()){
      specialString = "Minimum"
    }
  }

  return rawType + specialString




}

  

  const determineCurrentPeriod = (data, day) => {
    if(day.includes("the Weekend") || day.includes("the Break")){
      setTimeLeft("No School Scheduled")
      setCurrPeriod("")
      return
    }

    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    for(let i = 0; i < data.length; i++){
      const [startTime, endTime] = data[i].time.split(' - '); // Split the time range string into start time and end time

      let period = data[i].period

      let gapStart = 0;
      let gapEnd = 0;
      let timeString = startTime
      let startHours = 0
      let endHours = 0

      let endEpoch = 0
      let startEpoch = 0


      const [time, meridiem] = timeString.split(' '); // Split the time string into time and meridiem (AM/PM)
      const [hours, minutes] = time.split(':').map(Number); // Split hours and minutes and convert them to numbers

      if (timeString.includes("PM")) {
          startHours = hours + 12;
          gapStart += 43200000
      } else{
          startHours = hours
      }

      startHours = hours

      let date = new Date()
      // date.setHours(startHours);
      date.setHours(startHours);

      date.setMinutes(minutes);
      // console.log(date)
      // console.log(date.getTime() + gapStart)
      startEpoch = date.getTime() + gapStart

      const [timeEnd, meridiemEnd] = endTime.split(' '); // Split the time string into time and meridiem (AM/PM)
      const [hoursEnd, minutesEnd] = timeEnd.split(':').map(Number); // Split hours and minutes and convert them to numbers

      if (endTime.includes("PM")) {
        endHours = hoursEnd + 12;
        gapEnd += 43200000
      } else{
        endHours = hoursEnd
      }

      let dateEnd = new Date()
      dateEnd.setHours(endHours);
      dateEnd.setMinutes(minutesEnd);
      // console.log(dateEnd)
      // console.log(dateEnd.getTime() + gapEnd)
      endEpoch = dateEnd.getTime() + gapEnd

      let actualDate = new Date()
      // actualDate.setHours(11)
      // actualDate.setMinutes(20)

      let actualTime = actualDate.getTime()
      
      if(actualTime < endEpoch){
        if(startEpoch < actualTime){
          // console.log("I FOUND IT")
          // console.log(actualDate)
          // console.log(date)
          // console.log(period)
          setTimeLeft(endEpoch - actualTime)

        }
      }

    }



  };

  const findClosestPastDate = (current, dates) => {
      // Get the current date
      const currentDate = current;
    
      // Initialize variables to keep track of the closest date and the time difference
      let closestDate = null;
      let minTimeDifference = Infinity;
    
      // Iterate through the array of dates
      dates.forEach(dateString => {
        // Convert the date string to a Date object
        const date = new Date(dateString);

        // Check if the date is in the past
        if (date < currentDate) {
          // Calculate the time difference
          const timeDifference = currentDate - date;
    
          // Update the closest date if the current date is closer
          if (timeDifference < minTimeDifference) {

            closestDate = date;
            minTimeDifference = timeDifference;
          }
        }
      });
    
      return closestDate;
  }

  const determineCurrentPeriod2 = (data) => {
    // console.log(dayType == "")
    // console.log(dayType)
    // setSchedleData(data)
    // setDayType(dayType)
    // console.log(dayType)
    

    if(dayType.includes("the Weekend") || dayType.includes("the Break")){
      setTimeLeft("No School Scheduled")
      setCurrPeriod("")
      return
    }


    let datep = new Date();

    let hours24 = 0
    let minutes24 = 0
    try{
      hours24 = date.getHours();
      minutes24 = date.getMinutes();
    } catch{
      return
    }
    
    // if(scheduleData[2] == undefined){
    //   return

    // }

    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    for(let i = 0; i < data.length; i++){
      const [startTime, endTime] = data[i].time.split(' - '); // Split the time range string into start time and end time

      let period = data[i].period
      let gapStart = 0;
      let gapEnd = 0;
      let timeString = startTime
      let startHours = 0
      let endHours = 0

      let endEpoch = 0
      let startEpoch = 0


      const [time, meridiem] = timeString.split(' '); // Split the time string into time and meridiem (AM/PM)
      const [hours, minutes] = time.split(':').map(Number); // Split hours and minutes and convert them to numbers

      if (timeString.includes("PM") && hours != 12) {
        if(period == "Lunch"){
          console.log("I INCREASED START")
        }

          startHours = hours + 12;
          gapStart += 43200000
      } else{
          startHours = hours
      }

      startHours = hours

      let date = new Date()
      date.setHours(startHours);
      date.setMinutes(minutes);
      // console.log(date)
      // console.log(date.getTime() + gapStart)
      startEpoch = date.getTime() + gapStart

      const [timeEnd, meridiemEnd] = endTime.split(' '); // Split the time string into time and meridiem (AM/PM)
      const [hoursEnd, minutesEnd] = timeEnd.split(':').map(Number); // Split hours and minutes and convert them to numbers

      if (endTime.includes("PM") && hoursEnd != 12) {
        // endHours = hoursEnd + 12;
        if(period == "Lunch"){
          console.log("I INCREASED END")
        }
        gapEnd += 43200000
      } else{
        // endHours = hoursEnd
      }

      endHours = hoursEnd

      let dateEnd = new Date()
      dateEnd.setHours(endHours);
      dateEnd.setMinutes(minutesEnd);
      dateEnd.setSeconds(0)
      dateEnd.setMilliseconds(0)

      // console.log(dateEnd)
      // console.log(dateEnd.getTime() + gapEnd)
      endEpoch = dateEnd.getTime() + gapEnd

      let actualDate = new Date()
      
      actualDate.setHours(hours24)
      actualDate.setMinutes(minutes24)

      // actualDate.setHours(11)
      // actualDate.setMinutes(25)

      let actualTime = actualDate.getTime()
      
      // actualTime.setHours(11)
      if(actualTime <= endEpoch){
        if(period == "Lunch"){
          // console.log("AHAH")
          // console.log("ACTUAL DATE" + actualDate)
          // console.log("DATE START" + date)
          // console.log(actualTime - startEpoch)
        }
        if(startEpoch <= actualTime){
          let x = (endEpoch - actualTime)/1000/60
          // x = (endEpoch - actualTime)
          // x = 1812777821991 - actualTime
          // console.log(x)
          x = x.toFixed(3)
          // console.log("AHH")
          // console.log(endEpoch)
          // console.log(actualTime)
          // console.log(endEpoch)

          setTimeLeft(x + " minutes left in ")
          setCurrPeriod(period)
          return

        }
      }

    }

    setTimeLeft("No School Scheduled")
    setCurrPeriod("")

  };

  const setDOTWW = (datee) => {
    if(datee.getDay() == 0){
      setDOTW("Sunday")
    } else if(datee.getDay() == 1){
      setDOTW("Monday")
    }else if(datee.getDay() == 2){
      setDOTW("Tuesday")
    }else if(datee.getDay() == 3){
      setDOTW("Wednesday")
    }else if(datee.getDay() == 4){
      setDOTW("Thursday")
    }else if(datee.getDay() == 5){
      setDOTW("Friday")
    }else{
      setDOTW("Saturday")
    }
  }

  const parseTextFile = (data) => {

  } 


  // setInterval(loggg, 10)

  const fetchData2 = async () => {
    // try {

    //   let glo = []

    //   // Make asynchronous request using Axios
    //   // console.log("I RAN IT=----------------------------------------------------------------------------------------------------------------------------------------------------------------------")
    //   // const response = await axios.get('https://script.google.com/macros/s/AKfycbwx6yUfh5uOTJ2XNGQVRYNpJrCBY4xE-GtudHcsq2EMo7GESKo843_KzntaWhRd8mb4dw/exec');

    //   const response2 = await fetch('./datar.txt');
    //   const text = await response2.text();
    //   // Assuming data is separated by newlines in the text file
    //   const lines = text.replace(/\r/g, '').split('\n');

    //   console.log("RESPONSE: " + text)

    //   // console.log("DATA ARRAY------------------------------------------------------ " + dataArray[0][0] )

    //   // const parsedArrays = lines.map(line => JSON.parse(line));

    //   for (const line of lines) {
    //     // console.log(line)

    //     const [array, indicatorr] = line.split(' = '); 
    //     // console.log("BLLLLLLLLLLLLLAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    //     // console.log(indicatorr)

    //     let validJSONString = array.replace(/'/g, '"');
    //     console.log("VALID " + validJSONString)
    //     let dateArray = JSON.parse(validJSONString);

    //     let obj = {
    //       arr: dateArray,
    //       ind: indicatorr
    //     };
    //     // console.log("ARRYYAY")

    //     // console.log(array)
    //     // console.log(array[0])

    //     glo.push(obj)


    //   }

    //   // for(let i = 0; i < glow.length; i++){

    //   // }

    //   // console.log("NEW NEW NEW NEW ++++++++++++++++++++++++++++++++++++++++++++++")
    //   // console.log(glo)
    //   setIndicator(glo)

      
    //   // console.log("I HAVE FINSIEHD=----------------------------------------------------------------------------------------------------------------------------------------------------------------------")

    //   return "BAHAHAHFIFILSRIBHRIRWHLIWBRIL"

      


    // } catch (error) {
    //   console.error('Error fetching data:', error);
    // }

    let datta = [
      { arr: ['2024-04-08T00:00:00-08:00', '2024-04-09T00:00:00-08:00', '2024-04-10T00:00:00-08:00', '2024-04-11T00:00:00-08:00', '2024-04-12T00:00:00-08:00', '2024-05-27T00:00:00-08:00'], ind: "Break"},
      { arr: ['2024-03-05T00:00:00-08:00', '2024-04-15T00:00:00-08:00', '2024-05-28T00:00:00-08:00'], ind: "A Day"},
      { arr: ['2024-04-05T00:00:00-08:00'], ind: "Wildcat"},
      { arr: ['2024-04-17T00:00:00-08:00'], ind: "Minimum"},
      { arr: ['2024-06-03T00:00:00-08:00', '2024-06-04T00:00:00-08:00', '2024-06-05T00:00:00-08:00', '2024-06-06T00:00:00-08:00'], ind: "Final"}

    ]

    setIndicator(datta)
  };

  

  useEffect(() => {
    console.log("Initial Render")

    fetchData2()

    fetch('https://script.google.com/macros/s/AKfycbwx6yUfh5uOTJ2XNGQVRYNpJrCBY4xE-GtudHcsq2EMo7GESKo843_KzntaWhRd8mb4dw/exec')
    .then(() => {
    // Request was successful, do nothing
    // console.log('Request successful');
    })
    .catch(error => {
    // Handle errors
    console.error('There was a problem with the fetch operation:', error);
    });

  },[]); 


  useEffect(() => {
    
   
    const today = new Date();
    let startDate = new Date(today);
    setDate(startDate)
      
    let string = getDayy(true, new Date(startDate))
    setDOTWW(startDate)
    fetchData(string);

    

  },[indicatorArray ]); 

  useEffect(() => {
    
    

    let string = getDayy(true, new Date(date))
    fetchData(string);
    setDOTWW(new Date(date))

    document.addEventListener('visibilitychange', reload);

    
    const intervalId = setInterval(loggg, 1);

    return () => clearInterval(intervalId);
  },[date, dayType]); 

  const reload = () => {
    console.log("I RAN")
    let string = getDayy(true, new Date(date))
    fetchData(string);
    setDOTWW(new Date(date))
  };

  // useEffect(() => {

  //   let string = getDayy()
  //   console.log(string)
  //   fetchData(string);

  //   const intervalId = setInterval(loggg, 10);

  //   // Cleanup function to clear the interval when component unmounts
  //   return () => clearInterval(intervalId);

  // }, [dayType]); 

  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 100; i++) {
      let date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0)
      date.setMinutes(0)
      dates.push(date.toISOString().slice(0, 10)); // Format: YYYY-MM-DD
    }
    dates.unshift("TODAY")
    return dates;
  };

  const handleClicke = () => {
    // Handle click event, such as navigating to another page
    console.log('Heading clicked!');

    setQRCode(true)
  };

  const update = () => {
    // Handle click event, such as navigating to another page
    let x = 0.6
    console.log('UPDATE VERSION: ' + x);

  };



  // Define a function to handle the change in the dropdown selection
  const handleSelectChange = (event) => {
    setSelectedDate(event.target.value);
    // console.log(event.target.value)
    // console.log(new Date(event.target.value + "T00:00:00Z"))

    let dateString = event.target.value   
    let date = new Date()

    if(dateString == "TODAY"){
      let datem = new Date()
      dateString = datem.toISOString().slice(0, 10)
    }
    let components = dateString.split("-");

    let year = (components[0])
    let month = (components[1])
    let day = (components[2])

    date.setFullYear(year)
    date.setMonth(month-1)
    date.setDate(day)


    // console.log(date)
    setBeforeDay("Your Selected Date is")
    setUpdating(false)

    setDate(date)
    // let string = getDayy(true, date)
    // // setDayType(string)
    // // console.log("A DAY WED" == ("A DAY "))
    // console.log("YOUR DAY IS" + string)
    // fetchData(string)


  };

  // Generate the array of dates
  const dates = generateDates();


  return (
    <div className="schedule-container">

      {/* <a href="https://www.google.com/">
      <img
        src={logo}
        alt="Your image"
        style={{
          position: 'fixed',
          top: '10px', 
          right: '20px', 
          width: '100px',
          height: 'auto', 
          zIndex: -1 
        }}
      />
      </a> */}
      <a href={link} target="_blank" rel="noreferrer">
        <img
          src={logo}
          alt="a"
          style={{
            position: 'absolute',
            top: '10px', 
            right: '20px', 
            zIndex: 9999 
          }}
        />
      </a>

      
      

      
      <div class = "text-container">
        <a href="#" onClick={handleClicke} className="heading-link">

          <h2 className="heading" >Woodside High School Bell Schedule</h2>
        </a>

      </div>

      <p>{beforeDay} {dayType}: {dotw}</p>
      
      {/* <h3>{timeLeft}</h3> */}

      <div class="h3-container">
        <h3>{timeLeft} {currPeriod}</h3>
      </div>

      <div className="dropdown-container">
        <select value={selectedDate} onChange={handleSelectChange} className="dropdown-select">
          <option value="">{selectedDate}</option>
          {dates.map((date, index) => (
            <option key={index} value={date}>{date}</option>
          ))}
        </select>
      </div>

      <table className="schedule-table">
        <thead>
          <tr>
            <th>Period</th>
            <th>Time</th>
            <th>Duration</th>
          </tr>
        </thead>
        {/* <tbody>
          {scheduleData.map((entry, index) => (
            <tr key={index} style={{ backgroundColor: entry.period == currPeriod ? '#c68522' : 'white' }} className={entry.period == currPeriod ? 'highlighted' : 'nonhigh'}>
              <td>{entry.period}</td>
              <td>{entry.time}</td>
              <td>{entry.duration} minutes</td>

            </tr>
          ))}
        </tbody> */}
        <tbody>
          {scheduleData.map((entry, index) => (
            <tr key={index}  className={entry.period == currPeriod ? 'highlighted' : 'nonhigh'}>
              <td>{entry.period}</td>
              <td>{entry.time}</td>
              <td>{entry.duration} minutes</td>

            </tr>
          ))}
        </tbody>

        {/* <tbody>
          {scheduleData.map((entry, index) => (
            <tr key={index} style={{ backgroundColor:'white'}}>
              <td>{entry.period}</td>
              <td>{entry.time}</td>
              <td>{entry.duration} minutes</td>

            </tr>
          ))}
        </tbody> */}
      </table>
      
      <ShareButton url={url} title={title} />

      <a target="_blank" rel="noreferrer">
        <img
          className='logo2'
          src={logo2}
          alt="a"
          style={{
            position: 'absolute',
            right: '20px', 
            zIndex: 9999 
          }}
          onClick={update}
        />
      </a>


    </div>
  );
};

export default SchoolBell;
