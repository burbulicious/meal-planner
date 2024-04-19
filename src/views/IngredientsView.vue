<script setup lang="ts">
import { computed } from 'vue'
import type { RecipeExtended } from '@/types/recipes'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import InputNewIngredient from '@/components/InputNewIngredient.vue'

const mealPlanStore = useMealPlanStore()
const allRecipes = computed<RecipeExtended[]>(() => mealPlanStore.allRecipes)
</script>

<template>
  <div class="grid grid-cols-3" v-if="allRecipes">
    <ul v-for="item in allRecipes" :key="item.id" class="p-10">
      <li>{{ item.title }}</li>
    </ul>
  </div>
  <InputNewIngredient />
</template>
