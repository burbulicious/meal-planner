<script setup lang="ts">
import { ref } from 'vue'
import { roundUpToNearestInteger } from '@/composables/calculations'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import { getMealNutrition } from '@/composables/recipeDataManipulation'
import LabelComponent from '@/components/LabelComponent.vue'
import { RouterLink } from 'vue-router'
import defaultMealImage from '../assets/images/defaultMeal.jpg'

const props = defineProps({
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
const imageUrl = ref<string>(props.item.image ? props.item.image : defaultMealImage)
const handleImageError = () => {
  imageUrl.value = defaultMealImage
}

const getMealCalories = (id: number): number => {
  return roundUpToNearestInteger(getMealNutrition(mealPlanStore.allRecipes, id).calories)
}
</script>

<template>
  <RouterLink :to="`/recipes/${item.title.replace(/\//g, '%2F')}`" class="h-full">
    <div
      class="border border-grey-850 rounded-lg bg-black h-full relative"
      :class="hideLinkBtn ? 'show-link-on-hover' : 'show-link'"
    >
      <div v-if="showImage" class="w-full h-[160px] rounded-lg overflow-hidden">
        <img
          :src="imageUrl"
          :alt="item.title"
          class="object-cover h-full w-full"
          @error="handleImageError"
        />
      </div>
      <div class="recipe-card-info" :class="!hideLinkBtn ? 'pb-14' : 'pb-3'">
        <p class="w-full pb-3 text-[14px]">{{ item.title }}</p>
        <div class="flex flex-row flex-wrap">
          <LabelComponent :text="item.mealType" :type="item.mealType" class="mr-2 mb-2 md:mb-0" />
          <LabelComponent :text="getMealCalories(item.id).toString() + ' kCal'" type="calories" />
        </div>
        <button
          class="recipe-link"
          :class="hideLinkBtn ? 'hidden-recipe-link' : 'visible-recipe-link'"
        >
          View Recipe
        </button>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.recipe-card-info {
  @apply w-full pt-3 px-3 flex flex-col transition-all duration-300;
  .view-recipe-link {
    @apply opacity-0;
  }
}
.recipe-link {
  @apply text-[14px] w-fit transition-all duration-300 absolute left-4;
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

.show-link {
  &:hover {
    .visible-recipe-link {
      @apply text-yellow opacity-100;
    }
  }
}

.hidden-recipe-link {
  @apply opacity-0 text-yellow bottom-3;
}

.visible-recipe-link {
  @apply text-[14px] uppercase opacity-70 bottom-4;
  &:hover {
    @apply opacity-100;
  }
}
</style>
