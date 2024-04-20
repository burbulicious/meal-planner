import axios from 'axios'
import type {
  WeeklyMealPlan,
  RecipeExtended,
  Nutrients,
  MealType,
  Ingredient
} from '@/types/recipes'

const apiKey = '45673fe7c19440788b8f4841be2d733e'

const findSimilarIngredients = async (ingredients: string): Promise<string> => {
  const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
    params: {
      apiKey: apiKey,
      ingredients: ingredients,
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
  return recipeIngredients.join(', ')
}

const formatMealPlan = (data: any): WeeklyMealPlan => {
  const newMealPlan: WeeklyMealPlan = {}
  Object.keys(data.week).forEach((day) => {
    newMealPlan[day] = data.week[day]
    const dayMeals = newMealPlan[day].meals
    dayMeals.forEach((meal, index) => {
      if (index === 0) {
        dayMeals[index]['mealType'] = 'breakfast'
      } else if (index === 1) {
        dayMeals[index]['mealType'] = 'lunch'
      } else if (index === 2) {
        dayMeals[index]['mealType'] = 'dinner'
      }
    })
  })
  return newMealPlan
}

const generateMealPlan = async (ingredients: string, calories: number): Promise<WeeklyMealPlan> => {
  try {
    const similarIngredients: string = await findSimilarIngredients(ingredients)
    const response = await axios.get(`https://api.spoonacular.com/mealplanner/generate`, {
      params: {
        apiKey: apiKey,
        timeFrame: 'week',
        targetCalories: calories,
        diet: 'balanced',
        includeIngredients: similarIngredients,
        ignorePantry: true
      }
    })

    return formatMealPlan(response.data)
  } catch (error) {
    console.error('Error generating meal plan:', error)
    throw error
  }
}

const getRecipeIds = (mealPlan: WeeklyMealPlan): number[] => {
  const recipeIds: number[] = []
  Object.keys(mealPlan).forEach((day) => {
    const meals = mealPlan[day].meals
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

const getMealType = (mealPlan: WeeklyMealPlan, recipeId: number): MealType => {
  let mealType: MealType = 'breakfast'
  Object.values(mealPlan).forEach((day) => {
    const meal = day.meals.find((item) => item.id === recipeId)
    if (meal) mealType = meal.mealType
  })
  return mealType
}

const constructRecipesData = (data: any, mealPlan: WeeklyMealPlan): RecipeExtended[] => {
  const allRecipes: RecipeExtended[] = []

  data.forEach((item: any) => {
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
      mealType: getMealType(mealPlan, item.id),
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
}

const getFullRecipes = async (mealPlan: WeeklyMealPlan): Promise<RecipeExtended[]> => {
  const recipeIds = getRecipeIds(mealPlan)

  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/informationBulk', {
      params: {
        ids: recipeIds.join(','),
        apiKey: apiKey,
        includeNutrition: true
      }
    })

    return constructRecipesData(response.data, mealPlan)
  } catch (error) {
    console.error('Error generating meal plan:', error)
    throw error
  }
}

const getFullIngredientList = (allRecipes: RecipeExtended[]): Ingredient[] => {
  const allIngredients: Ingredient[] = []
  allRecipes.forEach((item) => {
    item.extendedIngredients.forEach((ingredient: Ingredient) => {
      if (!allIngredients.map((item) => item.name).includes(ingredient.name)) {
        allIngredients.push(ingredient)
      }
    })
  })

  return allIngredients
}

export {
  generateMealPlan,
  getFullRecipes,
  getSingleFullRecipe,
  getMealNutrition,
  getMealType,
  getFullIngredientList
}
