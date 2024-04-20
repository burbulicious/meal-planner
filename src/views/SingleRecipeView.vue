<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import { computed, ref, onMounted } from 'vue'
import type { RecipeExtended } from '@/types/recipes'
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
const myIngredients = computed<string>(() => mealPlanStore.ingredients)

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
</script>

<template>
  <main>
    <div class="grid grid-cols-2 gap-10 container mb-20 rounded-2xl bg-grey-900 h-[440px]">
      <div class="h-full object-cover rounded-2xl overflow-hidden">
        <img
          :src="imageUrl"
          :alt="currentRecipe?.title"
          class="object-cover h-full w-full"
          @error="handleImageError"
        />
      </div>
      <div class="py-10 pr-10 flex flex-col justify-center">
        <div class="pb-8">
          <LabelComponent
            :text="currentRecipe?.mealType"
            :type="currentRecipe?.mealType"
            class="mb-3"
          />
          <div class="flex flex-row items-center pb-3">
            <LabelComponent
              :text="
                roundUpToNearestInteger(currentRecipe!.nutrition.nutrients.calories).toString() +
                ' kCal'
              "
              type="calories"
              class="mr-2"
            />
            <LabelComponent
              :text="
                roundUpToNearestInteger(currentRecipe!.nutrition.nutrients.protein).toString() +
                ' g protein'
              "
              type="default"
              class="mr-2"
            />
            <LabelComponent
              :text="
                roundUpToNearestInteger(currentRecipe!.nutrition.nutrients.fat).toString() +
                ' g fat'
              "
              type="default"
              class="mr-2"
            />
            <LabelComponent
              :text="
                roundUpToNearestInteger(
                  currentRecipe!.nutrition.nutrients.carbohydrates
                ).toString() + ' g carbs'
              "
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
    <div class="container pb-20">
      <div class="max-w-7xl mx-auto grid grid-cols-10 gap-16">
        <div class="col-span-3">
          <h3 class="h3 mb-6">Ingredients</h3>
          <ul>
            <IngredientListItem
              v-for="(item, index) in currentRecipe?.extendedIngredients"
              :key="index"
              class="mb-2"
              :item
              :text="item.name"
              :isChecked="myIngredients.includes(item.name)"
              :amount="item.measures?.metric.amount"
              :unit="item.measures?.metric.unitShort"
            />
          </ul>
        </div>
        <div class="col-span-7">
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
