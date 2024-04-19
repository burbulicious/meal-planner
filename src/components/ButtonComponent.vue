<script setup lang="ts">
defineProps({
  buttonText: {
    type: String,
    default: 'Generate meal plan'
  },
  btnClasses: {
    type: String,
    default: 'btn btn__yellow'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button :class="btnClasses" :disabled="disabled">
    {{ buttonText }}
  </button>
</template>
