<script setup lang="ts">
import { computed } from 'vue'
import type { Ingredient } from '@/types/recipes'
import { useMealPlanStore } from '@/stores/mealPlanStore'
// import InputNewIngredient from '@/components/InputNewIngredient.vue'
import IngredientListItem from '@/components/IngredientListItem.vue'

const mealPlanStore = useMealPlanStore()
const allIngredients = computed<Ingredient[]>(() => mealPlanStore.extractedIngredients)
</script>

<template>
  <main>
    <div class="container pb-10">
      <h1 class="h1 text-center">Shopping List</h1>
    </div>
    <!-- <InputNewIngredient /> -->
    <div class="container pb-20" v-if="allIngredients">
      <ul class="grid grid-cols-6 gap-4">
        <IngredientListItem
          v-for="item in allIngredients"
          :key="item.id"
          class="mb-2 h-full"
          :item
          :isChecked="mealPlanStore.ingredients.includes(item.nameClean!)"
          :simple="true"
        />
      </ul>
    </div>
  </main>
</template>
