import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import { createStore } from 'vuex'
import calendar from 'calendar'
var getMyanmarDate = require('english-myanmar-date-converter');
import calendarData from './calendarData'

const d = new Date();

const cal = new calendar.Calendar(); 

const store = createStore({
    state () {
      return {
        hoverIndex: NaN,
        errorMessage: 'search year and month here',
        nextdata: [],
        // nextMMdata: [],
        previousdata: [],
        // totalyear of previous years
        previoustotalyear: d.getFullYear() - 1964,

        thisYear: d.getFullYear(),
        thisMonth: d.getMonth(),
        todayIndex: [],

        todayDate: d.getDate(),
        todayMDate: '',
        hoverDate: NaN,
        // for data inserting to getAllMonthInNextYear in mutations
        calculateYear: 0,
        calculateMonth: d.getMonth(),
        engMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      }
    },
    mutations: {
      getAllMonthInNextYears(state){
        let year = state.thisYear
        for(var y = 0; y < 50; y++){
          let yearData = [{Eyear: year, Edata: []}]

          for(var m = 0; m < 12; m++){
            var monthData = cal.monthDays(year,m);
            yearData[0].Edata.push(monthData)
          }
          state.nextdata.push(yearData)

          // for next year loop
          year = year + 1
        }

      },
      getAllMonthInNextMYears(state){
        // [[year]]
        
        // [[{}, {}], [{}, {}], [{}, {}], [{}, {}]]
        state.nextdata.forEach(year => {
          var currentYear = year[0].Eyear
          // var yearData = {Mdata: []}
          var yearData = []
          
          year[0].Edata.forEach((month, index) => {
            let monthData = []
            var currentMonth = index + 1
            
            month.forEach((week, weekIndex) => {
              let weekData = []
              week.forEach((day, dayIndex) => {
                var d
                if(day != 0){
                  let mmDate = getMyanmarDate(currentYear + "-" + currentMonth + "-" + day,0).split(" ")
                  if(mmDate[5] == "လကွယ်၊" || mmDate[5] == "လပြည့်၊"){
                    d = {day: mmDate[5].split("၊")[0], moon: mmDate[5], month: mmDate[4], year: mmDate[3].split("ခု၊")[0]}
                  }else{       
                    d = {day: mmDate[6].split("ရက်၊")[0], moon: mmDate[5], month: mmDate[4], year: mmDate[3].split("ခု၊")[0]}
                  }
                }else{
                  d = 0
                }
                
                // get today mmdate and todayIndex
                if(currentYear == state.thisYear && currentMonth == (state.thisMonth + 1) && day == state.todayDate){
                  state.todayIndex = [weekIndex, dayIndex]
                  state.todayMDate = d
                  state.hoverDate = d
                }
                weekData.push(d)
              })
              monthData.push(weekData)
            })
            yearData.push(monthData)
          })
          year.push({Mdata: yearData})
        })

        // console.log(state.nextdata)
      },
      getAllMonthInPreviousYears(state){
        let year = state.thisYear
        for(var y = 0; y < 51 + 1; y++){
          let yearData = [{Eyear: year, Edata: []}]

          for(var m = 0; m < 12; m++){
            var monthData = cal.monthDays(year,m);
            yearData[0].Edata.push(monthData)
          }
          state.previousdata.push(yearData)

          // for next year loop
          year = year - 1
        }
        state.previousdata.push(...calendarData)
      },
      getAllMonthInPreviousMYears(state){
        state.previousdata.forEach(year => {
          var currentYear = year[0].Eyear
          // var yearData = {Mdata: []}
          var yearData = []
          
          year[0].Edata.forEach((month, index) => {
            let monthData = []
            var currentMonth = index + 1
            
            month.forEach(week => {
              let weekData = []
              week.forEach(day => {
                var d
                if(day != 0){
                  let mmDate = getMyanmarDate(currentYear + "-" + currentMonth + "-" + day,0).split(" ")
                  if(mmDate[5] == "လကွယ်၊" || mmDate[5] == "လပြည့်၊"){
                    d = {day: mmDate[5].split("၊")[0], moon: mmDate[5], month: mmDate[4], year: mmDate[3].split("ခု၊")[0]}
                  }else{       
                    d = {day: mmDate[6].split("ရက်၊")[0], moon: mmDate[5], month: mmDate[4], year: mmDate[3].split("ခု၊")[0]}
                  }
                }else{
                  d = 0
                }
                weekData.push(d)
              })
              monthData.push(weekData)
            })
            yearData.push(monthData)
          })
          year.push({Mdata: yearData})
        })
        // console.log(state.previousdata)
      },
      hoverToDate(state, weekIndex){
        state.hoverIndex = weekIndex
        state.hoverDate = weekIndex[2]
      },

      searchMonth(state, inputData){
        if(inputData[1] > 12 || inputData[1] < 1){
          inputData[1] = 1
        }
        if(inputData[0] < state.thisYear + 49 && inputData[0] >= 1964){
          if(state.thisYear > inputData[0]){
            state.calculateYear = -(state.thisYear - parseInt(inputData[0]))
            state.calculateMonth = inputData[1] - 1
          }else if(state.thisYear < inputData[0]){
            state.calculateYear = parseInt(inputData[0]) - state.thisYear
            state.calculateMonth = inputData[1] - 1
          }else{
            state.calculateYear = 0
            state.calculateMonth = inputData[1] - 1
          }
        }else if(inputData[0] > state.thisYear + 49 || inputData[0] < 1964){
          state.errorMessage = "Year must be between 1964 and " + (state.thisYear + 49)
        }
        
      },

      increaseMonth(state){
        if(state.calculateMonth == 11 && state.calculateYear == 49){
          return 0;
        }
        if(state.calculateMonth == 11){
          state.calculateYear += 1
          state.calculateMonth = 0
        }else if(state.calculateMonth < 11){
          state.calculateMonth += 1
        }
      },
      decreaseMonth(state){
        if(state.calculateMonth == 0 && state.calculateYear == -(state.previoustotalyear)){
          return 0;
        }
        if(state.calculateMonth == 0){
          state.calculateMonth = 11
          state.calculateYear -= 1
        }else if(state.calculateMonth > 0){
          state.calculateMonth -= 1
        }
      },

      increaseYear(state){
        if(state.calculateYear >= -state.previoustotalyear && state.calculateYear < 49){
          state.calculateYear += 1
        }
      },
      decreaseYear(state){
        if(state.calculateYear > -state.previoustotalyear){
          state.calculateYear -= 1
        }
      }
    },
    getters: {
      getCurrentMonth(state){
        // first-arr -> year // second-arr -> eng or myan // third-arr -> month
        let edata, mdata
        if(state.calculateYear < 0){
          edata = state.previousdata[-(state.calculateYear)][0].Edata[state.calculateMonth]
          mdata = state.previousdata[-(state.calculateYear)][1].Mdata[state.calculateMonth]
        }else{
          edata = state.nextdata[state.calculateYear][0].Edata[state.calculateMonth]
          mdata = state.nextdata[state.calculateYear][1].Mdata[state.calculateMonth]
        }
        return {eCal: edata, mCal: mdata}
      }
    }
})

const app = createApp(App)

app.use(store)

app.mount('#app')

