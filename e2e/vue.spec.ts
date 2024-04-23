import { test, expect } from '@playwright/test'
import { mealPlanKey, ingredientsKey } from '../src/utils/handleLocalStorage.js'

// See here how to get started:
// https://playwright.dev/docs/intro
test('Generates meal plan', async ({ page }) => {
  await page.goto('/')

  const ingredientExist = await page.evaluate(
    ([ingredientsKey]) => {
      return localStorage.getItem(ingredientsKey) !== null
    },
    [ingredientsKey]
  )
  expect(ingredientExist).toBe(false)

  await expect(page.getByRole('listitem')).toHaveCount(0)

  const generateMealPlanBtn = page.getByRole('button', { name: 'Generate new meal plan' })
  let isDisabled = await generateMealPlanBtn.isDisabled()
  expect(isDisabled).toBe(true)

  await page.getByTestId('new-ingredient').fill('potatoe')
  const addBtn = page.getByRole('button', { name: '+ Add' })
  addBtn.click()

  await expect(page.getByRole('listitem')).toHaveCount(1)
  isDisabled = await generateMealPlanBtn.isDisabled()
  expect(isDisabled).toBe(false)

  await generateMealPlanBtn.click()
  await Promise.all([page.waitForEvent('response'), page.waitForEvent('framenavigated')])

  const mealPlanExists = await page.evaluate(
    ([mealPlanKey]) => {
      return localStorage.getItem(mealPlanKey) !== null
    },
    [mealPlanKey]
  )

  expect(mealPlanExists).toBe(true)
  expect(page.url()).toContain('/meal-plan')

  await page.getByRole('link', { name: 'Shopping list', exact: true }).click()
  expect(page.url()).toContain('/shopping-list')
})
