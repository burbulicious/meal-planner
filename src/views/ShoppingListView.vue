<script setup lang="ts">
import { computed } from 'vue'
import type { Ingredient } from '@/types/recipes'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import MyIngriedientsList from '@/components/MyIngriedientsList.vue'
import IngredientListItem from '@/components/IngredientListItem.vue'

const mealPlanStore = useMealPlanStore()
const allIngredients = computed<Ingredient[]>(() => mealPlanStore.extractedIngredients)
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
        <h2 class="h3 mb-6">All ingredients</h2>
        <ul class="grid grid-cols-4 gap-2">
          <IngredientListItem
            v-for="item in allIngredients"
            :key="item.id"
            class="mb-2 h-full"
            :text="item.name"
            :isChecked="myIngredients.includes(item.name)"
            :simple="true"
            :showMetrics="false"
          />
        </ul>
      </div>
    </div>
  </main>
</template>
