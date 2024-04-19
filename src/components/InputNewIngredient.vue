<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import GenerateMealPlanBtn from './GenerateMealPlanBtn.vue'

const mealPlanStore = useMealPlanStore()
const ingredients = computed<string>(() => mealPlanStore.ingredients)
const ingredientsList = computed<string[]>(() => {
  const list = ingredients.value.split(', ')
  return list.map((item) => item.trim())
})

const newIngredient = ref<string>('')
const itemExistsInIngredients = computed<boolean>(() =>
  ingredientsList.value
    .map((item) => item.trim().toLowerCase())
    .includes(newIngredient.value.trim().toLowerCase())
)
const isAddButtonDisabled = computed<boolean>(
  () => newIngredient.value === '' || itemExistsInIngredients.value
)
const isRemoveButtonDisabled = computed<boolean>(
  () => newIngredient.value === '' || !itemExistsInIngredients.value
)

const addNewIngredient = () => {
  if (!itemExistsInIngredients.value) {
    mealPlanStore.addIngredient(newIngredient.value)
    newIngredient.value = ''
  }
}
const removeExistingIngredient = () => {
  if (itemExistsInIngredients.value) {
    mealPlanStore.removeIngredient(newIngredient.value)
    newIngredient.value = ''
  }
}
</script>

<template>
  <input type="text" class="bg-transparent border-white border mb-6" v-model="newIngredient" />
  <div v-if="!!ingredientsList">
    <ul v-for="item in ingredientsList" :key="item">
      <li>{{ item }}</li>
    </ul>
  </div>
  <button class="btn btn__yellow" :disabled="isAddButtonDisabled" @click="addNewIngredient">
    add ingredient
  </button>
  <button
    class="btn btn__yellow"
    v-if="ingredients"
    :disabled="isRemoveButtonDisabled"
    @click="removeExistingIngredient"
  >
    remove ingredient
  </button>
  <GenerateMealPlanBtn v-if="ingredients" />
</template>
