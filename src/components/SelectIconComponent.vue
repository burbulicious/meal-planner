<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  iconColour: {
    type: String,
    required: true
  },
  iconName: {
    type: String,
    required: true
  }
})

import IconBreakfast from './icons/IconBreakfast.vue'
import IconLunch from './icons/IconLunch.vue'
import IconDinner from './icons/IconDinner.vue'
import IconFire from './icons/IconFire.vue'
import IconArrowLeft from './icons/IconArrowLeft.vue'
import IconCheckmark from './icons/IconCheckmark.vue'
import IconClose from './icons/IconClose.vue'

const iconComponent = computed(() => {
  switch (props.iconName) {
    case 'breakfast':
      return IconBreakfast
    case 'lunch':
      return IconLunch
    case 'dinner':
      return IconDinner
    case 'fire':
      return IconFire
    case 'arrow-left':
      return IconArrowLeft
    case 'checkmark':
      return IconCheckmark
    case 'close':
      return IconClose
    default:
      return null
  }
})
</script>

<template>
  <component v-if="iconComponent" :is="iconComponent" :iconColour="iconColour" />
</template>
