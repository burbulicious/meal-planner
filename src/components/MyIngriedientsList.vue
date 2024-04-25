<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMealPlanStore } from '@/stores/mealPlanStore'
import type { CombinedIngredient } from '@/types/recipes'
import GenerateMealPlanBtn from './GenerateMealPlanBtn.vue'
import IngredientListItem from '@/components/IngredientListItem.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import handleKeyDown from '@/utils/keyDownHandler'

defineProps({
  wide: {
    type: Boolean,
    default: true
  },
  showBtn: {
    type: Boolean,
    default: true
  }
})

const mealPlanStore = useMealPlanStore()
const ingredientsList = ref<CombinedIngredient[]>(mealPlanStore.combinedIngredients)
const myIngredients = computed<string[]>(() => mealPlanStore.ingredients)
const checkedIngredients = computed<CombinedIngredient[]>(() =>
  ingredientsList.value.filter((item) => item.isChecked && item.name)
)

const newIngredient = ref<string>('')

const isAddButtonDisabled = computed<boolean>(
  () =>
    newIngredient.value === '' ||
    checkedIngredients.value
      .map((item) => item.name)
      .includes(newIngredient.value.trim().toLowerCase()) ||
    myIngredients.value.includes(newIngredient.value)
)
const addNewIngredient = () => {
  mealPlanStore.addIngredient(newIngredient.value)
  newIngredient.value = ''
}

handleKeyDown(addNewIngredient, 'Enter')

watch(
  () => mealPlanStore.combinedIngredients,
  (newValue) => {
    ingredientsList.value = newValue
  }
)
</script>

<template>
  <div class="mb-8 flex" :class="wide ? 'flex-row' : 'flex-col'">
    <div class="flex flex-row justify-center relative large-new-habit-card w-full mr-3">
      <label class="w-full pr-3 flex" for="new-ingredient">
        <input
          data-testid="new-ingredient"
          type="text"
          v-model="newIngredient"
          placeholder="Your ingredient"
          id="new-ingredient"
        />
      </label>
      <ButtonComponent
        btnClasses="btn-inline btn-inline__yellow flex-none"
        :disabled="isAddButtonDisabled"
        @click="addNewIngredient"
        buttonText="+ Add"
      />
    </div>
    <GenerateMealPlanBtn
      buttonText="Generate new meal plan"
      class="flex-none h-[52px] flex"
      v-if="showBtn"
    />
  </div>
  <ul v-if="checkedIngredients.length !== 0">
    <IngredientListItem
      v-for="(item, index) in ingredientsList"
      :key="index"
      class="mb-2 h-full"
      :class="{ hidden: !item.isChecked }"
      :text="item.name"
      :showMetrics="false"
      :isChecked="item.isChecked"
    />
  </ul>
</template>

<style scoped>
.large-new-habit-card {
  @apply px-3 py-3 rounded bg-grey-900 transition-all duration-300;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='white' stroke-width='1' stroke-dasharray='6%2c6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
}

input[type='text'] {
  @apply bg-transparent text-white outline-none w-full text-base leading-tight font-semibold tracking-widest;
}
</style>
@/utils/keyDownHandler
