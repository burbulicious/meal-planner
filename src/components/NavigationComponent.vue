<script setup lang="ts">
import NavLink from './NavLink.vue'
</script>
<template>
  <nav
    class="flex flex-row items-center justify-between sm:justify-center py-3 md:py-5 px-3 md:px-6 w-full fixed bg-black z-10"
  >
    <NavLink text="Meal Plan" link="/meal-plan" />
    <NavLink text="Recipes" link="/recipes" />
    <NavLink text="Shopping list" link="/shopping-list" />
  </nav>
</template>
