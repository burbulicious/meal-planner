<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import GenerateMealPlanBtn from './GenerateMealPlanBtn.vue'
import IngredientListItem from '@/components/IngredientListItem.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'

const mealPlanStore = useMealPlanStore()
const ingredientsList = computed<string[]>(() => {
  const list = myIngredients.value.split(',')
  return list.map((item) => item.trim().toLowerCase())
})
const allIngredients = computed<string[]>(() => [
  ...mealPlanStore.extractedIngredients.map((item) => item.name)
])
const myIngredients = computed<string>(() => mealPlanStore.ingredients)

const newIngredient = ref<string>('')
const inputExistsInIngredients = computed<boolean>(() => {
  const isFoundInMyIngredients: boolean = ingredientsList.value.includes(
    newIngredient.value.trim().toLowerCase()
  )
  const isFoundInAllIngredients: boolean = allIngredients.value
    .map((item) => item.trim().toLowerCase())
    .includes(newIngredient.value.trim().toLowerCase())

  return isFoundInMyIngredients || isFoundInAllIngredients
})
const isAddButtonDisabled = computed<boolean>(
  () => newIngredient.value === '' || inputExistsInIngredients.value
)

const addNewIngredient = () => {
  if (!inputExistsInIngredients.value) {
    mealPlanStore.addIngredient(newIngredient.value)
    newIngredient.value = ''
  }
}
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
    <GenerateMealPlanBtn v-if="myIngredients" buttonText="Generate new meal plan" />
  </div>
  <div v-if="myIngredients">
    <ul v-for="(item, index) in allIngredients" :key="index">
      <IngredientListItem
        v-if="ingredientsList.includes(item)"
        class="mb-2 h-full"
        :text="item"
        :showMetrics="false"
        :isChecked="ingredientsList.includes(item)"
      />
    </ul>
  </div>
</template>
