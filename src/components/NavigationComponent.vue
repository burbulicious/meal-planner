<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeLink = ref<String>('')

const navLinkClasses: string = 'uppercase px-6 opacity-70'
</script>
<template>
  <nav class="flex flex-row items-center justify-center py-5 px-6">
    <RouterLink to="/meal-plan" :class="navLinkClasses">Meal plan</RouterLink>
    <!-- <RouterLink to="/ingredients">Ingredients</RouterLink> -->
    <RouterLink to="/recipes" :class="navLinkClasses">Recipes</RouterLink>
  </nav>
</template>
