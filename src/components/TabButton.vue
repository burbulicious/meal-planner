<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  text: {
    type: String
  },
  isActive: {
    type: Boolean
  }
})

const isActive = computed<boolean>(() => props.isActive)
</script>

<template>
  <button type="button" class="tab-item" :class="isActive ? 'active' : ''">
    {{ text }}
  </button>
</template>

<style scoped>
.tab-item {
  @apply pb-4 px-5 border-b border-white text-white opacity-70 transition-all duration-300;
  &:hover,
  &.active {
    @apply text-yellow border-yellow opacity-100;
  }
}
</style>
