import axios from 'axios'
import type { WeeklyMealPlan, RecipeExtended, Nutrients } from '@/types/recipes'

const apiKey = '45673fe7c19440788b8f4841be2d733e'
const maxCalories: number = 2000

const getMealPlan = async (ingredients: string): Promise<WeeklyMealPlan> => {
  try {
    const response = await axios.get(`https://api.spoonacular.com/mealplanner/generate`, {
      params: {
        apiKey: apiKey,
        timeFrame: 'week',
        // targetCalories: maxCalories,
        minCalories: maxCalories / 3 - 100,
        maxCalories: maxCalories / 3 + 100,
        diet: 'balanced',
        includeIngredients: ingredients
      }
    })
    return response.data
  } catch (error) {
    console.error('Error generating meal plan:', error)
    throw error
  }
}

const getRecipeIds = (mealPlan: WeeklyMealPlan): number[] => {
  const recipeIds: number[] = []
  Object.keys(mealPlan.week).forEach((day) => {
    const meals = mealPlan.week[day].meals
    meals.forEach((item: any) => {
      recipeIds.push(item.id)
    })
  })
  return recipeIds
}

const getSingleFullRecipe = (
  allRecipes: RecipeExtended[],
  recipeId: number
): RecipeExtended | undefined => {
  return allRecipes.find((item) => item.id === recipeId)
}

const getMealNutrition = (allRecipes: RecipeExtended[], recipeId: number): Nutrients => {
  const recipe = allRecipes.find((item) => item.id === recipeId)
  return {
    calories: recipe?.nutrition?.nutrients?.calories || 0,
    protein: recipe?.nutrition?.nutrients?.protein || 0,
    fat: recipe?.nutrition?.nutrients?.fat || 0,
    carbohydrates: recipe?.nutrition?.nutrients?.carbohydrates || 0
  }
}

const getFullRecipes = async (mealPlan: WeeklyMealPlan): Promise<RecipeExtended[]> => {
  const recipeIds = getRecipeIds(mealPlan)

  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/informationBulk', {
      params: {
        ids: recipeIds.join(','),
        apiKey: apiKey,
        includeNutrition: true,
        maxCalories: 850,
        minCalories: 600
      }
    })

    const allRecipes: RecipeExtended[] = []

    response.data.forEach((item: any) => {
      const nutrients = {
        calories: item.nutrition.nutrients.find((nutrient: any) => nutrient.name === 'Calories')
          .amount,
        protein: item.nutrition.nutrients.find((nutrient: any) => nutrient.name === 'Protein')
          ?.amount,
        fat: item.nutrition.nutrients.find((nutrient: any) => nutrient.name === 'Fat')?.amount,
        carbohydrates: item.nutrition.nutrients.find(
          (nutrient: any) => nutrient.name === 'Carbohydrates'
        )?.amount
      }
      allRecipes.push({
        id: item.id,
        title: item.title,
        readyInMinutes: item.readyInMinutes,
        servings: item.servings,
        nutrition: {
          nutrients: nutrients,
          caloricBreakdown: item.nutrition.caloricBreakdown
        },
        image: item.image,
        extendedIngredients: item.extendedIngredients,
        preparationMinutes: item.preparationMinutes,
        cookingMinutes: item.cookingMinutes,
        summary: item.summary,
        instructions: item.instructions,
        analyzedInstructions: item.analyzedInstructions
      })
    })

    return allRecipes
  } catch (error) {
    console.error('Error generating meal plan:', error)
    throw error
  }
}

export { getMealPlan, getFullRecipes, getSingleFullRecipe, getMealNutrition }
