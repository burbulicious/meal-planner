import { test } from '@playwright/test';
<script setup lang="ts">
import { computed } from 'vue'
import SelectIconComponent from '@/components/SelectIconComponent.vue'

const props = defineProps({
  text: {
    type: String
  },
  type: {
    type: String,
    default: 'default'
  }
})

const bgColour = computed<string>(() => {
  if (props.type === 'breakfast') {
    return 'bg-green'
  } else if (props.type === 'lunch') {
    return 'bg-violet'
  } else if (props.type === 'dinner') {
    return 'bg-magenta'
  } else if (props.type === 'info') {
    return 'bg-grey-800'
  } else {
    return 'bg-white bg-opacity-10'
  }
})

const iconName = computed<string | false>(() => {
  if (props.type === 'breakfast' || props.type === 'lunch' || props.type === 'dinner') {
    return props.type
  } else if (props.type === 'calories') {
    return 'fire'
  } else {
    return false
  }
})

const isAllCaps = computed<boolean>(
  () =>
    props.type === 'breakfast' ||
    props.type === 'lunch' ||
    props.type === 'dinner' ||
    props.type === 'info'
)
</script>
<template>
  <div
    :class="[bgColour, isAllCaps ? 'uppercase' : '']"
    class="px-2 py-1 rounded w-fit flex flex-row items-center label"
  >
    <SelectIconComponent
      v-if="iconName"
      class="w-4 h-4 mr-1"
      iconColour="white"
      :iconName="iconName"
    /><span class="label mt-[3px]">{{ text }}</span>
  </div>
</template>
