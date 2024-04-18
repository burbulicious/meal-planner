<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import { ref, onMounted, watch } from 'vue'
import { ingredientsKey } from '@/utils/handleLocalStorage'

defineProps({
  buttonText: {
    type: String,
    default: 'Generate meal plan'
  }
})

const route = useRoute()
const router = useRouter()
const mealPlanStore = useMealPlanStore()
const ingredientsExists = ref<boolean>(false)

const generateMealPlan = (): void => {
  mealPlanStore.setMealPlan()
  if (route.path === '/') {
    router.push('/meal-plan')
  }
}

onMounted(async () => {
  if (localStorage.getItem(ingredientsKey)) {
    ingredientsExists.value = true
  }
})

watch(
  () => mealPlanStore.ingredients,
  (newValue) => {
    if (newValue) {
      ingredientsExists.value = true
    } else {
      ingredientsExists.value = false
    }
  }
)
</script>

<template>
  <button class="btn btn__yellow" :disabled="!ingredientsExists" @click="generateMealPlan">
    {{ buttonText }}
  </button>
</template>
