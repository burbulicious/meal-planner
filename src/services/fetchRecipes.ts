import axios from 'axios'
import type { WeeklyMealPlan, RecipeExtended } from '@/types/recipes'
import {
  formatMealPlan,
  getRecipeIds,
  constructRecipesData
} from '@/composables/recipeDataManipulation'

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY

const findSimilarIngredients = async (ingredients: string[]): Promise<string[]> => {
  const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
    params: {
      apiKey: API_KEY,
      ingredients: ingredients.join(', '),
      number: 5,
      ignorePantry: true
    }
  })
  const recipeIngredients: string[] = []
  response.data.forEach((item: any) => {
    item.usedIngredients.forEach((ingredient: any) => {
      recipeIngredients.push(ingredient.name)
    })
    item.unusedIngredients.forEach((ingredient: any) => {
      recipeIngredients.push(ingredient.name)
    })
  })
  return recipeIngredients
}

const generateMealPlan = async (
  ingredients: string[],
  calories: number
): Promise<WeeklyMealPlan> => {
  try {
    const similarIngredients: string[] = await findSimilarIngredients(ingredients)
    const response = await axios.get(`https://api.spoonacular.com/mealplanner/generate`, {
      params: {
        apiKey: API_KEY,
        timeFrame: 'week',
        targetCalories: calories,
        diet: 'balanced',
        includeIngredients: similarIngredients.join(', '),
        ignorePantry: true
      }
    })

    return formatMealPlan(response.data)
  } catch (error) {
    console.error('Error generating meal plan:', error)
    throw error
  }
}

const getFullRecipes = async (mealPlan: WeeklyMealPlan): Promise<RecipeExtended[]> => {
  const recipeIds = getRecipeIds(mealPlan)

  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/informationBulk', {
      params: {
        ids: recipeIds.join(','),
        apiKey: API_KEY,
        includeNutrition: true
      }
    })

    return constructRecipesData(response.data, mealPlan)
  } catch (error) {
    console.error('Error generating meal plan:', error)
    throw error
  }
}

export { generateMealPlan, getFullRecipes }
