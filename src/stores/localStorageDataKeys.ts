import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDataKeysStore = defineStore({
  id: 'dataKeys',
  state: () => ({
    mealPlanKey: ref<string>('mealPlan'),
    ingredientsKey: ref<string>('ingredients')
  })
})
