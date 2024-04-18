<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import NavigationComponent from '@/components/NavigationComponent.vue'

const route = useRoute()
const showNav = ref<Boolean>(true)

onMounted(async () => {
  if (route.path === '/') {
    showNav.value = false
  }
})

watch(
  () => route.path,
  (newValue) => {
    if (newValue === '/') {
      showNav.value = false
    } else {
      showNav.value = true
    }
  }
)
</script>

<template>
  <NavigationComponent v-if="showNav" />
  <RouterView />
</template>
