<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import { computed, ref, onMounted } from 'vue'
import type { RecipeExtended, CombinedIngredient } from '@/types/recipes'
import defaultMealImage from '../assets/images/defaultMeal.jpg'
import LabelComponent from '@/components/LabelComponent.vue'
import { roundUpToNearestInteger } from '@/composables/calculations'
import IngredientListItem from '@/components/IngredientListItem.vue'

const route = useRoute()
const router = useRouter()
const mealPlanStore = useMealPlanStore()
const allRecipes = computed<RecipeExtended[]>(() => mealPlanStore.allRecipes)
const currentRecipe = ref<RecipeExtended | undefined>(
  allRecipes.value.find((item) => item.title === route.params.title.toString().replace(/%2F/g, '/'))
)
const myIngredients = computed<CombinedIngredient[]>(() => mealPlanStore.combinedIngredients)

onMounted(() => {
  if (!currentRecipe.value) {
    router.push('/')
  }
})

const imageUrl = ref<string>(
  currentRecipe.value?.image ? currentRecipe.value.image : defaultMealImage
)
const handleImageError = () => {
  imageUrl.value = defaultMealImage
}

const roundAmount = (number: number | undefined): number => {
  if (number) {
    const decimalPart = number.toString().split('.')[1]
    if (decimalPart && decimalPart.length > 2) {
      return parseFloat(number.toFixed(1))
    }
    return number
  }
  return 0
}
</script>

<template>
  <main class="px-4 pb-20">
    <div
      class="grid grid-cols-2 gap-6 lg:gap-10 container mb-12 md:mb-20 rounded-2xl bg-grey-900 md:h-[440px]"
    >
      <div
        class="h-[220px] sm:h-[300px] md:h-full object-cover rounded-2xl overflow-hidden col-span-2 md:col-span-1"
      >
        <img
          :src="imageUrl"
          :alt="currentRecipe?.title"
          class="object-cover h-full w-full"
          @error="handleImageError"
        />
      </div>
      <div
        class="pb-12 px-4 sm:px-6 md:py-10 md:pr-10 flex flex-col justify-center col-span-2 md:col-span-1"
      >
        <div class="pb-4 md:pb-8">
          <LabelComponent
            :text="currentRecipe?.mealType"
            :type="currentRecipe?.mealType"
            class="mb-3"
          />
          <div class="flex flex-row items-center pb-1 md:pb-3 flex-wrap">
            <LabelComponent
              :text="
                roundUpToNearestInteger(currentRecipe!.nutrition.nutrients.calories).toString() +
                ' kCal'
              "
              type="calories"
              class="mr-2 mb-2 lg:mb-0"
            />
            <LabelComponent
              :text="
                roundUpToNearestInteger(currentRecipe!.nutrition.nutrients.protein).toString() +
                ' g protein'
              "
              type="default"
              class="mr-2 mb-2 lg:mb-0"
            />
            <LabelComponent
              :text="
                roundUpToNearestInteger(currentRecipe!.nutrition.nutrients.fat).toString() +
                ' g fat'
              "
              type="default"
              class="mr-2 mb-2 lg:mb-0"
            />
            <LabelComponent
              :text="
                roundUpToNearestInteger(
                  currentRecipe!.nutrition.nutrients.carbohydrates
                ).toString() + ' g carbs'
              "
              class="mb-2 lg:mb-0"
              type="default"
            />
          </div>
          <div class="flex flex-row items-center">
            <LabelComponent
              :text="`${currentRecipe?.servings} Servings`"
              type="info"
              class="mr-2"
            />
            <LabelComponent
              :text="`${currentRecipe?.readyInMinutes} min`"
              type="info"
              class="mr-2"
            />
          </div>
        </div>
        <h1 class="h2">
          {{ currentRecipe?.title }}
        </h1>
      </div>
    </div>
    <div class="container">
      <div class="max-w-7xl mx-auto grid grid-cols-10 gap-8 lg:gap-16">
        <div class="col-span-full sm:col-span-4 lg:col-span-3">
          <h3 class="h3 mb-6">Ingredients</h3>
          <ul>
            <IngredientListItem
              v-for="(item, index) in currentRecipe?.extendedIngredients"
              :key="index"
              class="mb-2"
              :text="item.name"
              :isChecked="
                myIngredients.find(
                  (ingredient) => ingredient.name === item.name && ingredient.isChecked
                )
                  ? true
                  : false
              "
              :amount="roundAmount(item.measures?.metric.amount)"
              :unit="item.measures?.metric.unitShort"
            />
          </ul>
        </div>
        <div class="col-span-full sm:col-span-6 lg:col-span-7">
          <h3 class="h3 mb-6">Method</h3>
          <div>
            <p
              v-for="(item, index) in currentRecipe?.analyzedInstructions[0].steps"
              :key="index"
              class="mb-6"
            >
              {{ item.step }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
