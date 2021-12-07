<template>
    <div class="bg-gray-50 py-12">
      <Header></Header>
      <Card>
          {{ todayMDate.year + " " + todayMDate.month + " " + todayMDate.moon + " " + todayMDate.day + "ရက်"}}
      </Card>
     
      <div class="flex flex-col justify-center items-center pt-20">
        <div class="flex items-center space-x-8">
          <input 
          class="py-2 px-4 rounded-lg outline-none border-2 border-red-300 text-red-400 hover:border-red-400 font-bold"
          type="number" placeholder="year" min="1964" v-bind:max="thisYear + 49" v-model="yearInput">

          <input 
            class="py-2 px-4 rounded-lg outline-none border-2 border-red-300 text-red-400 hover:border-red-400 font-bold"
            type="number" 
            placeholder="month" 
            min="1" 
            v-bind:max="12" 
            v-model="monthInput"
          >

          <button 
          class="bg-red-400 py-2 px-4 rounded-lg text-white hover:bg-red-500 text-lg font-bold"
          v-on:click="searchMonth([yearInput, monthInput])"
          >Search
          </button>
        </div>
        <p class="text-gray-500 mt-4">{{ errorMessage }}</p>
      </div>

      <div class="calendar-container lg:flex lg:justify-around w-full pt-20">
        <div class="e-calendar w-11/12 m-auto lg:w-2/6 lg:m-0">
          <div class="calendar-header flex justify-between items-center pb-8">
            <DecreaseMonthButton />

            <div class="flex flex-col items-center justify-center">
              <IncreaseYearButton />
              <Title1>{{ thisYear + calculateYear }}</Title1>
              <DecreaseYearButton />
              <Title2>{{ engMonths[calculateMonth] }}</Title2>
            </div>

            <IncreaseMonthButton />
          </div>
          <div class="calendar-body">
            <TableHeader />

            <div v-for="(week, weekIndex) in getCurrentMonth.eCal" v-bind:key="week" class="grid grid-cols-7 ">
              <div v-for="(day, dayIndex) in week" v-bind:key="day" class="py-1 rounded-full flex justify-center items-center">
                <p v-if="day == 0"></p>
                <p
                  v-if="day !== 0"
                  class="text-center text-gray-600 text-lg w-14 h-14  flex justify-center items-center rounded-full cursor-pointer"
                  @mouseover="hoverToDate([weekIndex, dayIndex, getCurrentMonth.mCal[4][0]])" 
                  @mouseleave="hoverToDate([NaN, NaN, NaN])"
                  v-bind:class="[(calculateYear == 0 && calculateMonth == thisMonth && weekIndex == todayIndex[0] && dayIndex == todayIndex[1]) ? 'bg-red-400 text-red-100' : '',
                  (weekIndex == hoverIndex[0] && dayIndex == hoverIndex[1] ? 'bg-blue-300 text-yellow-100' : '')]">
                  {{ day }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- M Calendar -->
        <div class="m-calendar w-11/12 m-auto lg:w-2/6 lg:m-0">
          <div class="calendar-header flex justify-between items-center pb-8">
            <DecreaseMonthButton />

            <div class="flex flex-col items-center justify-center">
              <IncreaseYearButton />
              <Title1>
                {{ getCurrentMonth.mCal[2][0].year }}
              </Title1>
              <DecreaseYearButton />
              <Title2>
                <span v-if="hoverDate">
                  {{ hoverDate.month + " " + hoverDate.moon + " " + hoverDate.day }}
                </span>
                
                <span v-if="!hoverDate">
                  {{ getCurrentMonth.mCal[2][0].month}}
                </span>
              </Title2>
            </div>

            <IncreaseMonthButton />
          </div>
          <div class="calendar-body">
            <TableHeader />
            <div v-for="(week, weekIndex) in getCurrentMonth.mCal" v-bind:key="week"  class="grid grid-cols-7 ">
              <div v-for="(day, dayIndex) in week" v-bind:key="day" class="relative py-1 rounded-full flex justify-center items-center">
                <!-- If today -> bg-blue-500 -->
                <p v-if="day == 0"></p>
                <p 
                v-if="day != 0"
                class="text-center text-gray-600 text-lg w-14 h-14 flex justify-center items-center rounded-full cursor-pointer"
                @mouseover="hoverToDate([weekIndex, dayIndex, day])" 
                @mouseleave="hoverToDate([NaN, NaN, NaN])"
                v-bind:class="[(calculateYear == 0 && calculateMonth == thisMonth && weekIndex == todayIndex[0] && dayIndex == todayIndex[1]) ? 'bg-red-400 text-red-100': '',
                (weekIndex == hoverIndex[0] && dayIndex == hoverIndex[1] ? 'bg-blue-300 text-yellow-100' : '')]">
                  {{ day.day }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import DecreaseMonthButton from './components/DecreaseMonthButton.vue'
import IncreaseMonthButton from './components/IncreaseMonthButton.vue'
import DecreaseYearButton from './components/DecreaseYearButton.vue'
import IncreaseYearButton from './components/IncreaseYearButton.vue'
import Title1 from './components/Title1.vue'
import Title2 from './components/Title2.vue'
import TableHeader from './components/TableHeader.vue'
import Header from './components/Header.vue'
import Card from './components/Card.vue'

export default {
  name: 'App',
  data(){
    return {
      'yearInput': '',
      'monthInput': ''
    }
  },
  components: {
    DecreaseMonthButton,
    IncreaseMonthButton,
    DecreaseYearButton,
    IncreaseYearButton,
    Title1,
    Title2,
    TableHeader,
    Header,
    Card
  },
  computed: {
    ...mapState(['todayIndex', 'errorMessage', 'hoverIndex', 'hoverDate', 'todayMDate', 'nextdata', 'previousdata', 'thisYear', 'thisMonth', 'todayDate', 'calculateYear', 'calculateMonth', 'engMonths']),
    ...mapGetters(['getCurrentMonth'])
  },
  methods: {
    ...mapMutations(['increaseMonth', 'searchMonth', 'hoverToDate', 'decreaseYear', 'increaseYear', 'decreaseMonth', 'getAllMonthInNextYears', 'getAllMonthInPreviousYears', 'getAllMonthInNextMYears', 'getAllMonthInPreviousMYears'])
  },
  created(){
    // this.getCurrentData()
    this.getAllMonthInNextYears()
    this.getAllMonthInPreviousYears()
    if(this.nextdata.length > 0){
      this.getAllMonthInNextMYears()
    }
    if(this.previousdata.length > 0){
      this.getAllMonthInPreviousMYears()
    }
  }
}
</script>

<style>
  h1, p, button{
    font-family: 'Padauk', sans-serif;
  }
  h2{
    font-family: 'Arima Madurai', cursive;
  }
</style>
