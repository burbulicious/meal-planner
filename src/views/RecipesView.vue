<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { WeeklyMealPlan } from '@/types/recipes'
import { roundUpToNearestInteger } from '@/composables/calculations'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import InputNewIngredient from '@/components/InputNewIngredient.vue'
import { getDataFromLocalStorage, mealPlanKey } from '@/utils/handleLocalStorage'

const mealPlanStore = useMealPlanStore()
const mealPlanExists = ref<boolean>(false)
const mealPlan = ref<WeeklyMealPlan>(mealPlanStore.mealPlan)

onMounted(async () => {
  if (getDataFromLocalStorage(mealPlanKey)) {
    mealPlanExists.value = true
  }
})

watch(
  () => mealPlanStore.mealPlan,
  (newMealPlan) => {
    mealPlan.value = newMealPlan
    if (newMealPlan) {
      mealPlanExists.value = true
    } else {
      mealPlanExists.value = false
    }
  }
)
</script>

<template>
  <div class="grid grid-cols-4" v-if="mealPlanExists">
    <div v-for="(dayInfo, title) in mealPlan" :key="title" class="p-10">
      <h2 class="h2">{{ title }}</h2>
      <ul v-for="(item, index) in dayInfo.meals" :key="item.id">
        <li>
          <span v-if="index === 0">Breakfast</span> <span v-else-if="index === 1">Lunch</span>
          <span v-else>Dinner</span> {{ item.title }}
          <span>{{ item.id }}</span>
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
