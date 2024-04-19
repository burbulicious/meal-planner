<script setup lang="ts">
import { computed } from 'vue'
import type { RecipeExtended } from '@/types/recipes'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import RecipeCard from '@/components/RecipeCard.vue'

const mealPlanStore = useMealPlanStore()
const allRecipes = computed<RecipeExtended[]>(() => mealPlanStore.allRecipes)
</script>

<template>
  <main>
    <div class="container pb-10">
      <h1 class="h1 text-center">Recipes</h1>
    </div>
    <div v-if="allRecipes" class="container">
      <ul class="grid grid-cols-4">
        <RecipeCard v-for="item in allRecipes" :key="item.id" :item :hideLinkBtn="false" />
      </ul>
    </div>
  </main>
</template>
