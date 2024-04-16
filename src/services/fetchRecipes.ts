import axios from 'axios'
import type { Recipe, RecipeExtended, WeeklyMealPlan } from '@/types/recipes'

const apiKey = '45673fe7c19440788b8f4841be2d733e'

const fetchRecipes = async (ingredients: string): Promise<Recipe[]> => {
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients`, {
      params: {
        ingredients: ingredients,
        apiKey: apiKey,
        number: 2
      }
    })
    const recipes: Recipe[] = response.data
    return recipes
  } catch (error) {
    console.error('Error searching recipes:', error)
    throw error
  }
}

const getSingleRecipe = async (recipeId: number): Promise<RecipeExtended> => {
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${recipeId}/information`,
      {
        params: {
          apiKey: apiKey
        }
      }
    )
    const recipe = response.data
    return recipe
  } catch (error) {
    console.error('Error fetching recipe information:', error)
    throw error
  }
}

const generateMealPlan = async (selectedRecipes: number[]): Promise<WeeklyMealPlan> => {
  try {
    const response = await axios.get(`https://api.spoonacular.com/mealplanner/generate`, {
      params: {
        apiKey: apiKey,
        timeFrame: 'week',
        targetCalories: 2000,
        diet: 'none',
        exclude: [],
        include: selectedRecipes
      }
    })
    return response.data
  } catch (error) {
    console.error('Error generating meal plan:', error)
    throw error
  }
}

export { fetchRecipes, getSingleRecipe, generateMealPlan }
