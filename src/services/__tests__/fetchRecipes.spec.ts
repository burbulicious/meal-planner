import axios from 'axios'
import { describe, it, expect } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import { fetchRecipes, getSingleRecipe, generateMealPlan } from '../fetchRecipes'

const mock = new MockAdapter(axios)

mock.reset()

describe('fetchRecipes', () => {
  it('fetches recipes correctly', async () => {
    mock.onGet('https://api.spoonacular.com/recipes/findByIngredients').reply(200, [
      { id: 1, title: 'Recipe 1' },
      { id: 2, title: 'Recipe 2' }
    ])
    const recipes = await fetchRecipes('ingredient1,ingredient2')
    expect(recipes).toEqual([
      { id: 1, title: 'Recipe 1' },
      { id: 2, title: 'Recipe 2' }
    ])
  })

  it('handles errors correctly', async () => {
    mock.onGet('https://api.spoonacular.com/recipes/findByIngredients').networkError()
    await expect(fetchRecipes('ingredient1,ingredient2')).rejects.toThrowError()
  })
})

describe('getSingleRecipe', () => {
  it('fetches single recipe correctly', async () => {
    mock
      .onGet('https://api.spoonacular.com/recipes/1/information')
      .reply(200, { id: 1, title: 'Recipe 1' })

    const recipe = await getSingleRecipe(1)
    expect(recipe).toEqual({ id: 1, title: 'Recipe 1' })
  })

  it('handles errors correctly', async () => {
    mock.onGet('https://api.spoonacular.com/recipes/1/information').networkError()
    await expect(getSingleRecipe(1)).rejects.toThrowError()
  })
})

describe('generateMealPlan', () => {
  it('generates meal plan correctly', async () => {
    mock
      .onGet('https://api.spoonacular.com/mealplanner/generate')
      .reply(200, { week: { monday: {}, tuesday: {} } })

    const mealPlan = await generateMealPlan([1, 2])
    expect(mealPlan).toEqual({ week: { monday: {}, tuesday: {} } })
  })

  it('handles errors correctly', async () => {
    mock.onGet('https://api.spoonacular.com/mealplanner/generate').networkError()
    await expect(generateMealPlan([1, 2])).rejects.toThrowError()
  })
})
