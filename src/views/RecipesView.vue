<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { WeeklyMealPlan } from '@/types/recipes'
import { roundUpToNearestInteger } from '@/composables/calculations'
import { useMealPlanStore } from '@/stores/mealPlanStore'

const mealPlanStore = useMealPlanStore()
const mealPlan = ref<WeeklyMealPlan>(mealPlanStore.mealPlan)

onMounted(async () => {
  await mealPlanStore.setMealPlan('carrot')
  mealPlanStore.getMealPlan
  mealPlan.value = mealPlanStore.mealPlan
  await console.log(mealPlan.value.week.monday.meals[0].title)
})
</script>

<template>
  <div class="grid grid-cols-4">
    <div v-for="(dayInfo, title) in mealPlan.week" :key="title" class="p-10">
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
</template>
