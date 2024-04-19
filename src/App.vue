<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import NavigationComponent from '@/components/NavigationComponent.vue'

const route = useRoute()
const showNav = computed(() => route.path !== '/')
</script>

<template>
  <NavigationComponent v-if="showNav" />
  <RouterView />
</template>
