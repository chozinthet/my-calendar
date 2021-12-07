<template>
  <div>
    <button v-on:click="decreaseMonth()" class="text-blue-300 hover:text-blue-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'DecreaseMonthButton',
  methods: {
    ...mapMutations(['decreaseMonth'])
  },
}
</script>