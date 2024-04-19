<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { WeeklyMealPlan } from '@/types/recipes'
import { roundUpToNearestInteger } from '@/composables/calculations'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import LabelComponent from '@/components/LabelComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import GenerateMealPlanBtn from '@/components/GenerateMealPlanBtn.vue'
import RecipeCard from '@/components/RecipeCard.vue'

const mealPlanStore = useMealPlanStore()
const mealPlan = computed<WeeklyMealPlan>(() => mealPlanStore.mealPlan)
const minCardWidth: string = 'min-w-[280px]'
</script>

<template>
  <main>
    <div class="container pb-10">
      <h1 class="h1 text-center">Your meal plan</h1>
    </div>
    <div class="pr-0 pb-4 pl-20 overflow-auto custom-scroll">
      <div class="flex flex-row items-start justify-start pb-3 min-w-fit">
        <div v-for="(dayInfo, day) in mealPlan" :key="day" class="pr-4" :class="minCardWidth">
          <div class="w-full rounded bg-grey-900 px-x py-5 mb-3">
            <h2 class="label w-full text-center uppercase">{{ day }}</h2>
          </div>
          <ul class="w-full">
            <li v-for="item in dayInfo.meals" :key="item.id">
              <RecipeCard :item="item" class="mb-2" />
            </li>
          </ul>
        </div>
      </div>
      <div class="flex flex-row items-start justify-start border-t border-grey-850 pt-5 min-w-fit">
        <div v-for="(dayInfo, day) in mealPlan" :key="day" class="pr-4" :class="minCardWidth">
          <ul>
            <p class="label pb-2 uppercase">Nutrition information:</p>
            <li v-for="(item, title) in dayInfo.nutrients" :key="title" class="label pb-1">
              <LabelComponent
                :text="`${roundUpToNearestInteger(item)} ${title === 'calories' ? 'kCal' : `g ${title === 'carbohydrates' ? 'carbs' : title}`} `"
                :type="title === 'calories' ? 'calories' : 'default'"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container pt-8 pb-12 flex flex-row items-center justify-center">
      <RouterLink to="/shopping-list" class="mx-2"
        ><ButtonComponent buttonText="See shopping list "
      /></RouterLink>
      <GenerateMealPlanBtn btnClasses="btn btn__white__outlined mx-2" />
    </div>
  </main>
</template>

<style scoped>
.custom-scroll {
  &::-webkit-scrollbar-track {
    @apply bg-grey-900;
  }

  &::-webkit-scrollbar {
    @apply h-2 w-2;
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-white bg-opacity-15  rounded-full;
  }
}
</style>
