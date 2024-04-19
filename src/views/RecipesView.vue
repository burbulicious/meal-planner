<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { RecipeExtended } from '@/types/recipes'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import RecipeCard from '@/components/RecipeCard.vue'
import TabButton from '@/components/TabButton.vue'

const mealPlanStore = useMealPlanStore()
const allRecipes = computed<RecipeExtended[]>(() => mealPlanStore.allRecipes)

const breakfastMeals = computed<RecipeExtended[]>(() =>
  mealPlanStore.getMealsByMealType('breakfast')
)
const lunchMeals = computed<RecipeExtended[]>(() => mealPlanStore.getMealsByMealType('lunch'))
const dinnerMeals = computed<RecipeExtended[]>(() => mealPlanStore.getMealsByMealType('dinner'))

const allMealTypes = {
  all: 'All Recipes',
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner'
}

const selectedType = ref<keyof typeof allMealTypes>('all')

const sortedRecipes = ref<RecipeExtended[]>([
  ...breakfastMeals.value,
  ...lunchMeals.value,
  ...dinnerMeals.value
])

watch(
  () => selectedType.value,
  (newTypeValue) => {
    if (newTypeValue === 'breakfast') {
      sortedRecipes.value = [...breakfastMeals.value]
    } else if (newTypeValue === 'lunch') {
      sortedRecipes.value = [...lunchMeals.value]
    } else if (newTypeValue === 'dinner') {
      sortedRecipes.value = [...dinnerMeals.value]
    } else {
      sortedRecipes.value = [...breakfastMeals.value, ...lunchMeals.value, ...dinnerMeals.value]
    }
  }
)
</script>

<template>
  <main>
    <div class="container pb-10">
      <h1 class="h1 text-center">Recipes</h1>
    </div>
    <div v-if="allRecipes" class="container">
      <div class="pb-10 flex flex-row items-center justify-center">
        <TabButton
          v-for="(item, key) in allMealTypes"
          :key="item"
          :text="item"
          :isActive="selectedType === key"
          @click="selectedType = key"
        />
      </div>
      <ul class="grid grid-cols-4 gap-5">
        <RecipeCard
          v-for="item in sortedRecipes"
          :key="item.id"
          :item
          :hideLinkBtn="false"
          :showImage="true"
        />
      </ul>
    </div>
  </main>
</template>
