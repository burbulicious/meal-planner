<script setup lang="ts">
import { computed } from 'vue'
import type { WeeklyMealPlan } from '@/types/recipes'
import { roundUpToNearestInteger } from '@/composables/calculations'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import { getMealNutrition } from '@/services/fetchRecipes'
import InputNewIngredient from '@/components/InputNewIngredient.vue'

const mealPlanStore = useMealPlanStore()
const mealPlan = computed<WeeklyMealPlan>(() => mealPlanStore.mealPlan)

const getMealCalories = (id: number): number => {
  return roundUpToNearestInteger(getMealNutrition(mealPlanStore.allRecipes, id).calories)
}
</script>

<template>
  <div class="grid grid-cols-4" v-if="mealPlan">
    <div v-for="(dayInfo, title) in mealPlan" :key="title" class="p-10">
      <h2 class="h2">{{ title }}</h2>
      <ul v-for="item in dayInfo.meals" :key="item.id">
        <li>
          <span>{{ item.mealType }}</span> {{ item.title }} <span>{{ item.id }}</span
          ><br />
          <span>{{ getMealCalories(item.id) }}</span>
        </li>
      </ul>
      <ul v-for="(item, title) in dayInfo.nutrients" :key="title">
        <li>
          <span>{{ roundUpToNearestInteger(item) }} </span>
          <span v-if="title === 'calories'"> kCal</span> <span v-else> g {{ title }}</span>
        </li>
      </ul>
    </div>
  </div>
  <InputNewIngredient />
</template>
