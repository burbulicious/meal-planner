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
  <main class="px-4 pb-20">
    <div class="container pb-8">
      <h1 class="h1 text-center">Shopping List</h1>
    </div>
    <div class="container md:grid gap-8 xl:gap-16 md:grid-cols-12 w-full">
      <div class="col-span-5 lg:col-span-3 md:block hidden w-full">
        <h2 class="h3 mb-6">In your pantry</h2>
        <MyIngriedientsList :wide="false" :showBtn="false" />
      </div>
      <div class="w-full md:col-span-7 lg:col-span-9">
        <h2 class="h3 mb-6">All your need for the recipes</h2>
        <div class="grid gap-2 sm:gap-3 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ul v-for="(item, index) in ingredientsList" :key="index">
            <IngredientListItem
              :key="index"
              class="h-full"
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
