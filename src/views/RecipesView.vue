<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { RecipeExtended } from '@/types/recipes'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import InputNewIngredient from '@/components/InputNewIngredient.vue'
import { getDataFromLocalStorage, allRecipesKey } from '@/utils/handleLocalStorage'

const mealPlanStore = useMealPlanStore()
const recipesExist = ref<boolean>(false)
const allRecipes = ref<RecipeExtended[]>(mealPlanStore.allRecipes)

onMounted(async () => {
  if (getDataFromLocalStorage(allRecipesKey)) {
    recipesExist.value = true
  }
})

watch(
  () => mealPlanStore.allRecipes,
  (newRecipes) => {
    allRecipes.value = newRecipes
    if (newRecipes) {
      recipesExist.value = true
    } else {
      recipesExist.value = false
    }
  }
)
</script>

<template>
  <div class="grid grid-cols-3" v-if="recipesExist">
    <ul v-for="item in allRecipes" :key="item.id" class="p-10">
      <li>{{ item.title }}</li>
    </ul>
  </div>
  <InputNewIngredient />
</template>
