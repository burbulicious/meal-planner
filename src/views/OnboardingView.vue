<script setup lang="ts">
import MyIngriedientsList from '@/components/MyIngriedientsList.vue'
import { computed } from 'vue'
import { useMealPlanStore } from '@/stores/mealPlanStore'

const mealPlanStore = useMealPlanStore()
const ingredientsLength = computed<number>(() => mealPlanStore.ingredients.length)
</script>

<template>
  <main
    class="pb-32 flex flex-col items-center"
    :class="{ 'justify-center': ingredientsLength < 5 }"
  >
    <div class="container text-center">
      <h1 class="h1 pb-6">Let’s get something to eat, shall we?</h1>
      <h1 class="h2">
        First, tell me <span class="text-yellow">what you have in your pantry</span>
      </h1>
      <div class="max-w-xl mx-auto py-8">
        <MyIngriedientsList />
      </div>
    </div>
  </main>
</template>
