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
  <div
    class="border border-grey-850 rounded-lg bg-black"
    :class="hideLinkBtn ? 'show-link-on-hover' : ''"
  >
    <div v-if="showImage" class="w-full h-[160px] rounded-lg overflow-hidden">
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.title"
        class="object-cover h-full w-full"
      />
    </div>
    <div class="recipe-card-info">
      <p class="w-full pb-3 text-[14px]">{{ item.title }}</p>
      <div class="flex flex-row">
        <LabelComponent :text="item.mealType" :type="item.mealType" class="mr-2" />
        <LabelComponent :text="getMealCalories(item.id).toString() + ' kCal'" type="calories" />
      </div>
      <RouterLink
        to="/recipes"
        class="recipe-link"
        :class="hideLinkBtn ? 'hidden-recipe-link' : 'visible-recipe-link'"
        >View Recipe</RouterLink
      >
    </div>
  </div>
</template>

<style scoped>
.recipe-card-info {
  @apply w-full py-3 px-4 flex flex-col transition-all duration-300;
  .view-recipe-link {
    @apply opacity-0;
  }
}
.recipe-link {
  @apply text-[14px] w-fit transition-all duration-300;
}

.show-link-on-hover {
  &:hover {
    .recipe-card-info {
      @apply pb-12 relative;
      .hidden-recipe-link {
        @apply opacity-100;
      }
    }
  }
}

.hidden-recipe-link {
  @apply absolute left-4 bottom-3 opacity-0 text-yellow;
}

.visible-recipe-link {
  @apply relative pt-4  mb-2 text-[14px] uppercase opacity-70;
  &:hover {
    @apply opacity-100;
  }
}
</style>
