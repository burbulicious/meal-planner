<script setup lang="ts">
defineProps({
  iconColour: {
    type: String,
    required: true
  }
})
</script>
<template>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.87389 4L4 6.87389L5.46752 8.3414L9.09554 12.0306L5.46752 15.6586L4 17.065L6.87389 20L8.3414 18.5325L12.0306 14.8433L15.6586 18.5325L17.065 20L20 17.065L18.5325 15.6586L14.8433 12.0306L18.5325 8.3414L20 6.87389L17.065 4L15.6586 5.46752L12.0306 9.09554L8.3414 5.46752L6.87389 4Z"
      :fill="iconColour"
    />
  </svg>
</template>
