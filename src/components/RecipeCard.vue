<script setup lang="ts">
import { roundUpToNearestInteger } from '@/composables/calculations'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import { getMealNutrition } from '@/services/fetchRecipes'
import LabelComponent from '@/components/LabelComponent.vue'
import { RouterLink } from 'vue-router'

defineProps({
  item: {
    type: Object,
    required: true
  }
})

const mealPlanStore = useMealPlanStore()

const getMealCalories = (id: number): number => {
  return roundUpToNearestInteger(getMealNutrition(mealPlanStore.allRecipes, id).calories)
}
</script>

<template>
  <div class="recipe-card">
    <p class="w-full pb-3 text-[14px]">{{ item.title }}</p>
    <div class="flex flex-row">
      <LabelComponent :text="item.mealType" :type="item.mealType" class="mr-2" />
      <LabelComponent :text="getMealCalories(item.id).toString() + ' kCal'" type="calories" />
    </div>
    <RouterLink to="/recipes" class="view-recipe-link">View Recipe</RouterLink>
  </div>
</template>

<style scoped>
.view-recipe-link {
  @apply text-yellow text-[14px] absolute left-4 bottom-3 transition-all duration-300;
}
.recipe-card {
  @apply w-full rounded bg-black border border-grey-850 py-3 px-4 mb-2 flex flex-col transition-all duration-300;
  .view-recipe-link {
    @apply opacity-0;
  }
  &:hover {
    @apply pb-12 relative;
    .view-recipe-link {
      @apply opacity-100;
    }
  }
}
</style>
