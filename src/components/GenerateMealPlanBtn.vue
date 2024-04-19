<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import { computed } from 'vue'

defineProps({
  buttonText: {
    type: String,
    default: 'Generate meal plan'
  }
})

const route = useRoute()
const router = useRouter()
const mealPlanStore = useMealPlanStore()
const ingredientsExists = computed<boolean>(() => !!mealPlanStore.ingredients)

const generateMealPlan = (): void => {
  mealPlanStore.setMealPlan()
  if (route.path === '/') {
    router.push('/meal-plan')
  }
}
</script>

<template>
  <button class="btn btn__yellow" :disabled="!ingredientsExists" @click="generateMealPlan">
    {{ buttonText }}
  </button>
</template>
