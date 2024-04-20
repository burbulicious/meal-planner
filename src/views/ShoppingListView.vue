<script setup lang="ts">
import { computed } from 'vue'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import MyIngriedientsList from '@/components/MyIngriedientsList.vue'
import IngredientListItem from '@/components/IngredientListItem.vue'

const mealPlanStore = useMealPlanStore()
const ingredientsList = computed<string[]>(() => {
  const list = myIngredients.value.split(',')
  return list.map((item) => item.trim().toLowerCase())
})
const allIngredients = computed<string[]>(() => [
  ...mealPlanStore.extractedIngredients
    .filter((item) => !ingredientsList.value.includes(item.name))
    .map((item) => item.name)
])
const myIngredients = computed<string>(() => mealPlanStore.ingredients)
</script>

<template>
  <main>
    <div class="container pb-10">
      <h1 class="h1 text-center">Shopping List</h1>
    </div>
    <div class="container pb-20 grid gap-16 grid-cols-4" v-if="allIngredients">
      <div class="col-span-1">
        <h2 class="h3 mb-6">In your pantry</h2>
        <MyIngriedientsList />
      </div>
      <div class="col-span-3">
        <h2 class="h3 mb-6">All your need for the recipes</h2>
        <ul class="grid grid-cols-4 gap-2">
          <IngredientListItem
            v-for="(item, index) in allIngredients"
            :key="index"
            class="mb-2 h-full"
            :text="item"
            :isChecked="ingredientsList.includes(item)"
            :simple="true"
            :showMetrics="false"
          />
        </ul>
      </div>
    </div>
  </main>
</template>
