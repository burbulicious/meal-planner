<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMealPlanStore } from '@/stores/mealPlanStore'

const props = defineProps({
  text: {
    type: String
  },
  isChecked: {
    type: Boolean
  },
  simple: {
    type: Boolean,
    default: false
  },
  showMetrics: {
    type: Boolean,
    default: true
  },
  amount: {
    type: Number || String
  },
  unit: {
    type: String
  }
})

const mealPlanStore = useMealPlanStore()
const isActive = ref<boolean>(props.isChecked)

const updateIngredients = (event: any): void => {
  const ingredient = event.target.value
  isActive.value = !isActive.value
  if (isActive.value) {
    mealPlanStore.addIngredient(ingredient)
  } else {
    mealPlanStore.removeIngredient(ingredient)
  }
}

watch(
  () => isActive.value,
  (newValue) => {
    isActive.value = newValue
  }
)

watch(
  () => props.isChecked,
  (newValue) => {
    isActive.value = newValue
  }
)
</script>

<template>
  <li v-if="!simple">
    <label
      class="px-3 py-2 rounded border flex flex-row items-center"
      :class="isActive ? 'bg-grey-850  border-grey-850' : 'bg-grey-900  border-grey-800'"
    >
      <input
        type="checkbox"
        :value="text"
        class="mr-2 checkmark"
        :checked="isActive"
        @click="updateIngredients($event)"
      />
      <span class="custom-checkbox"></span>
      <span class="ingredient-title">{{
        `${showMetrics ? `${amount} ${unit}` : ''} ${text}`
      }}</span>
    </label>
  </li>
  <li v-else>
    <label class="flex flex-row items-start">
      <input
        type="checkbox"
        :value="text"
        class="mr-2 checkmark"
        :checked="isActive"
        @click="updateIngredients($event)"
      />
      <span class="custom-checkbox mt-1"></span>
      <span :class="{ 'text-green line-through': isActive }">{{ text }}</span>
    </label>
  </li>
</template>
<style scoped>
input[type='checkbox'] {
  @apply opacity-0 absolute;
}

.custom-checkbox {
  @apply relative inline-block w-4 h-4 border border-green rounded mr-2  flex-none;
}

.custom-checkbox::before {
  @apply absolute top-[2px] left-[4px] w-[5px] h-[8px] border-r-2 border-b-2 border-white opacity-0;
  content: '';
  transform: rotate(45deg);
}

input[type='checkbox']:checked + .custom-checkbox::before {
  opacity: 1;
}
input[type='checkbox']:checked + .custom-checkbox {
  @apply bg-green;
}
</style>
