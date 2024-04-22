import { it, expect } from 'vitest'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import { useMealPlanStore } from '../mealPlanStore'

const app = createApp(App)

app.use(createPinia())

const piniaStore = useMealPlanStore()

it('Adds ingredients correctly', () => {
  piniaStore.addIngredient('carrot')
  piniaStore.addIngredient('carrot')
  piniaStore.addIngredient('potato')
  piniaStore.addIngredient('')
  expect(piniaStore.ingredients).toBe('carrot, potato')
})
it('removes ingredients correctly', () => {
  piniaStore.removeIngredient('carrot')
  expect(piniaStore.ingredients).toBe('potato')
})
it('combines ingredients correctly', () => {
  expect(piniaStore.combinedIngredients).toEqual([
    { name: 'carrot', isChecked: false },
    { name: 'potato', isChecked: true }
  ])
})
it('sets and retrieves calories limit correctly', () => {
  expect(piniaStore.caloriesLimit).toEqual(2000)
  piniaStore.setCaloriesLimit(1800)
  expect(piniaStore.caloriesLimit).toEqual(1800)
})
