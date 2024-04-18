<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import itemExists from '@/utils/existsInList'
import { ingredientsKey } from '@/utils/handleLocalStorage'

const mealPlanStore = useMealPlanStore()
const newIngredient = ref<string>('')
const ingredientsExists = ref<boolean>(false)
const ingredientsList = computed<string[]>(() => {
  return mealPlanStore.ingredients.split(',').map((ingredient) => ingredient.trim())
})
const isAddButtonDisabled = computed(() => newIngredient.value === '')
const isRemoveButtonDisabled = computed(
  () => !itemExists(newIngredient.value, mealPlanStore.ingredients)
)

const addIngredient = () => {
  if (!itemExists(newIngredient.value, mealPlanStore.ingredients)) {
    mealPlanStore.addIngredient(newIngredient.value)
    newIngredient.value = ''
  }
}
const removeIngredient = () => {
  if (itemExists(newIngredient.value, mealPlanStore.ingredients)) {
    mealPlanStore.removeIngredient(newIngredient.value)
    newIngredient.value = ''
    console.log(newIngredient.value)
  }
}

onMounted(async () => {
  if (localStorage.getItem(ingredientsKey)) {
    ingredientsExists.value = true
  }
})

watch(
  () => mealPlanStore.ingredients,
  (newValue) => {
    if (newValue) {
      ingredientsExists.value = true
    } else {
      ingredientsExists.value = false
    }
  }
)
</script>

<template>
  <input type="text" class="bg-transparent border-white border mb-6" v-model="newIngredient" />
  <button class="btn btn__yellow" @click="addIngredient" :disabled="isAddButtonDisabled">
    add ingredient
  </button>
  <button
    class="btn btn__yellow"
    v-if="ingredientsExists"
    @click="removeIngredient"
    :disabled="isRemoveButtonDisabled"
  >
    remove ingredient
  </button>
  <div v-if="ingredientsExists">
    <ul v-for="item in ingredientsList" :key="item">
      <li>{{ item }}</li>
    </ul>
  </div>
  <button class="btn btn__yellow" v-if="ingredientsExists" @click="mealPlanStore.setApiMealPlan">
    generate new meal plan
  </button>
</template>
