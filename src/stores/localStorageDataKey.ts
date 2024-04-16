import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDataKeyStore = defineStore({
  id: 'dataKeys',
  state: () => ({
    dataKey: ref<string>('mealPlan'),
    ingredientsKey: ref<string>('ingredients')
  })
})
