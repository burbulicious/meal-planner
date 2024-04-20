<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import GenerateMealPlanBtn from './GenerateMealPlanBtn.vue'
import IngredientListItem from '@/components/IngredientListItem.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'

const mealPlanStore = useMealPlanStore()
const ingredients = computed<string>(() => mealPlanStore.ingredients)
const ingredientsList = computed<string[]>(() => {
  const list = ingredients.value.split(',')
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
// const isRemoveButtonDisabled = computed<boolean>(
//   () => newIngredient.value === '' || !itemExistsInIngredients.value
// )

const addNewIngredient = () => {
  if (!itemExistsInIngredients.value) {
    mealPlanStore.addIngredient(newIngredient.value)
    newIngredient.value = ''
  }
}
// const removeExistingIngredient = () => {
//   if (itemExistsInIngredients.value) {
//     mealPlanStore.removeIngredient(newIngredient.value)
//     newIngredient.value = ''
//   }
// }
</script>

<template>
  <div class="mb-8">
    <input type="text" class="bg-transparent border-white border mb-6" v-model="newIngredient" />
    <ButtonComponent
      btnClasses="btn-inline btn-inline__yellow"
      :disabled="isAddButtonDisabled"
      @click="addNewIngredient"
      buttonText="+ Add"
    />
    <GenerateMealPlanBtn v-if="ingredients" buttonText="Generate new meal plan" />
  </div>
  <div v-if="!!ingredients">
    <ul>
      <IngredientListItem
        v-for="(item, index) in ingredientsList"
        :key="index"
        class="mb-2 h-full"
        :text="item"
        :showMetrics="false"
        :isChecked="ingredients.includes(item)"
      />
    </ul>
  </div>
</template>
