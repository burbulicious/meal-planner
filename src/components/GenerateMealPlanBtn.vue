<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import { computed } from 'vue'
import ButtonComponent from '@/components/ButtonComponent.vue'

const props = defineProps({
  buttonText: {
    type: String,
    default: 'Generate meal plan'
  },
  redirectToMealPlan: {
    type: Boolean,
    default: true
  },
  btnClasses: {
    type: String,
    default: 'btn btn__yellow'
  }
})

const route = useRoute()
const router = useRouter()
const mealPlanStore = useMealPlanStore()
const ingredientsExists = computed<boolean>(() => !!mealPlanStore.ingredients)

const generateMealPlan = (): void => {
  mealPlanStore.setMealPlan()
  if (route.path !== '/meal-plan' && props.redirectToMealPlan) {
    router.push('/meal-plan')
  }
}
</script>

<template>
  <ButtonComponent
    :btnClasses="btnClasses"
    :disabled="!ingredientsExists"
    @click="generateMealPlan"
    :buttonText="buttonText"
  />
</template>
