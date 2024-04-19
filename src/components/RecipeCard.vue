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
  },
  showImage: {
    type: Boolean,
    default: false
  },
  hideLinkBtn: {
    type: Boolean,
    default: true
  }
})

const mealPlanStore = useMealPlanStore()

const getMealCalories = (id: number): number => {
  return roundUpToNearestInteger(getMealNutrition(mealPlanStore.allRecipes, id).calories)
}
</script>

<template>
  <div class="recipe-card" :class="hideLinkBtn ? 'show-link-on-hover' : ''">
    <div v-if="showImage">Image</div>
    <p class="w-full pb-3 text-[14px]">{{ item.title }}</p>
    <div class="flex flex-row">
      <LabelComponent :text="item.mealType" :type="item.mealType" class="mr-2" />
      <LabelComponent :text="getMealCalories(item.id).toString() + ' kCal'" type="calories" />
    </div>
    <RouterLink
      to="/recipes"
      class="recipe-link transition-all duration-300"
      :class="hideLinkBtn ? 'hidden-recipe-link' : 'visible-recipe-link'"
      >View Recipe</RouterLink
    >
  </div>
</template>

<style scoped>
.recipe-card {
  @apply w-full rounded bg-black border border-grey-850 py-3 px-4 mb-2 flex flex-col transition-all duration-300;
  .view-recipe-link {
    @apply opacity-0;
  }
}
.recipe-link {
  @apply text-yellow text-[14px] w-fit;
}

.show-link-on-hover {
  &:hover {
    @apply pb-12 relative;
    .hidden-recipe-link {
      @apply opacity-100;
    }
  }
}

.hidden-recipe-link {
  @apply absolute left-4 bottom-3 opacity-0;
}

.visible-recipe-link {
  @apply relative pt-4;
}
</style>
