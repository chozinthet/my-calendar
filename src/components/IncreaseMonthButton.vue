<template>
    <div>
        <button v-on:click="increaseMonth()" class="text-blue-300 hover:text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        </button>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'IncreaseMonthButton',
  methods: {
    ...mapMutations(['increaseMonth'])
  },
}
</script>