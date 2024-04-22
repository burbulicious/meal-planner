<script setup lang="ts">
import { computed } from 'vue'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import MyIngriedientsList from '@/components/MyIngriedientsList.vue'
import type { CombinedIngredient } from '@/types/recipes'
import IngredientListItem from '@/components/IngredientListItem.vue'

const mealPlanStore = useMealPlanStore()
const ingredientsList = computed<CombinedIngredient[]>(() =>
  mealPlanStore.combinedIngredients.filter((item) => item.name)
)
</script>

<template>
  <main>
    <div class="container pb-10">
      <h1 class="h1 text-center">Shopping List</h1>
    </div>
    <div class="container pb-20 grid gap-16 grid-cols-4">
      <div class="col-span-1">
        <h2 class="h3 mb-6">In your pantry</h2>
        <MyIngriedientsList :wide="false" :showBtn="false" />
      </div>
      <div class="col-span-3">
        <h2 class="h3 mb-6">All your need for the recipes</h2>
        <div class="grid gap-2 grid-cols-4">
          <ul v-for="(item, index) in ingredientsList" :key="index">
            <IngredientListItem
              :key="index"
              class="mb-2 h-full"
              :text="item.name"
              :isChecked="item.isChecked"
              :simple="true"
              :showMetrics="false"
            />
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>
