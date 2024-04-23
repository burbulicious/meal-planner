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
  <button type="button" class="tab-item" :class="{ active: isActive }">
    {{ text }}
  </button>
</template>

<style scoped>
.tab-item {
  @apply pb-2 md:pb-4 px-2 md:px-5 border-b border-white text-white opacity-70 transition-all duration-300 text-[13px] md:text-[16px];
  &:hover,
  &.active {
    @apply text-yellow border-yellow opacity-100;
  }
}
</style>
