import axios from 'axios'
import type {
  WeeklyMealPlan,
  RecipeExtended,
  Recipe,
  Nutrients,
  DailyMealPlan,
  MealType
} from '@/types/recipes'
import getFourRandomNumbers from '@/utils/getRandomNumber'

const apiKey = '45673fe7c19440788b8f4841be2d733e'
const maxCalories: number = 2000

//this generates a meal plan that has all the meals made from different recipes
const getApiMealPlan = async (ingredients: string): Promise<WeeklyMealPlan> => {
  try {
    const response = await axios.get(`https://api.spoonacular.com/mealplanner/generate`, {
      params: {
        apiKey: apiKey,
        timeFrame: 'week',
        targetCalories: maxCalories,
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
const getSingleMealRecipeIds = (mealPlan: WeeklyMealPlan, mealType: MealType): number[] => {
  const recipeIds: number[] = []
  let mealIndex: number
  if (mealType === 'breakfast') {
    mealIndex = 0
  } else if (mealType === 'lunch') {
    mealIndex = 1
  } else if (mealType === 'dinner') {
    mealIndex = 2
  }
  Object.keys(mealPlan.week).forEach((day) => {
    const meals = mealPlan.week[day].meals
    recipeIds.push(meals[mealIndex].id)
  })
  return recipeIds
}

const getSingleFullRecipe = (
  allRecipes: RecipeExtended[],
  recipeId: number
): RecipeExtended | undefined => {
  return allRecipes.find((item) => item.id === recipeId)
}

const getSingleShortRecipe = (mealPlan: WeeklyMealPlan, recipeId: number): Recipe => {
  const allMeals: Recipe[] = []
  Object.keys(mealPlan.week).forEach((day) => {
    const meals = mealPlan.week[day].meals
    meals.forEach((item: any) => {
      allMeals.push(item)
    })
  })
  return allMeals.find((item: Recipe) => item.id === recipeId) || mealPlan.week.monday.meals[0]
}

//selecting meals for simplified meal plan (has less recipes)
const selectMeals = (mealPlan: WeeklyMealPlan): { [key: string]: Recipe } => {
  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner']
  const selectedMeals: { [key: string]: Recipe } = {}

  mealTypes.forEach((type) => {
    const mealIds: number[] = getSingleMealRecipeIds(mealPlan, type)
    const randomIndexes = getFourRandomNumbers(mealIds.length - 1)
    randomIndexes.forEach((index, i) => {
      selectedMeals[`${type}${i + 1}`] = getSingleShortRecipe(mealPlan, mealIds[index])
    })
  })
  return selectedMeals
}

const buildMealsForEachDay = (
  mealPlan: WeeklyMealPlan,
  allRecipes: RecipeExtended[]
): WeeklyMealPlan => {
  const selectedMeals = selectMeals(mealPlan)
  const mealCombinations: DailyMealPlan = {
    monday: [selectedMeals.breakfast1, selectedMeals.lunch1, selectedMeals.dinner1],
    tuesday: [selectedMeals.breakfast1, selectedMeals.lunch1, selectedMeals.dinner2],
    wednesday: [selectedMeals.breakfast2, selectedMeals.lunch2, selectedMeals.dinner2],
    thursday: [selectedMeals.breakfast2, selectedMeals.lunch2, selectedMeals.dinner3],
    friday: [selectedMeals.breakfast2, selectedMeals.lunch3, selectedMeals.dinner3],
    saturday: [selectedMeals.breakfast3, selectedMeals.lunch3, selectedMeals.dinner4],
    sunday: [selectedMeals.breakfast3, selectedMeals.lunch4, selectedMeals.dinner4]
  }

  const newMealPlan: WeeklyMealPlan = {
    week: {
      monday: {
        meals: mealCombinations.monday,
        nutrients: getWholeDayNutrion(allRecipes, mealCombinations.monday)
      },
      tuesday: {
        meals: mealCombinations.tuesday,
        nutrients: getWholeDayNutrion(allRecipes, mealCombinations.tuesday)
      },
      wednesday: {
        meals: mealCombinations.wednesday,
        nutrients: getWholeDayNutrion(allRecipes, mealCombinations.wednesday)
      },
      thursday: {
        meals: mealCombinations.thursday,
        nutrients: getWholeDayNutrion(allRecipes, mealCombinations.thursday)
      },
      friday: {
        meals: mealCombinations.friday,
        nutrients: getWholeDayNutrion(allRecipes, mealCombinations.friday)
      },
      saturday: {
        meals: mealCombinations.saturday,
        nutrients: getWholeDayNutrion(allRecipes, mealCombinations.saturday)
      },
      sunday: {
        meals: mealCombinations.sunday,
        nutrients: getWholeDayNutrion(allRecipes, mealCombinations.sunday)
      }
    }
  }

  return newMealPlan
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

const getWholeDayNutrion = (allRecipes: RecipeExtended[], meals: Recipe[]): Nutrients => {
  const everyMealNutrition: Nutrients[] = []

  meals.forEach((item) => {
    everyMealNutrition.push(getMealNutrition(allRecipes, item.id))
  })
  const dayNutrionalInfo: Nutrients = everyMealNutrition.reduce(
    (total, mealNutrition) => {
      Object.keys(mealNutrition).forEach((key: string) => {
        total[key] = (total[key] || 0) + mealNutrition[key]
      })
      return total
    },
    {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    }
  )

  return dayNutrionalInfo
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

export {
  getApiMealPlan,
  getFullRecipes,
  getSingleMealRecipeIds,
  getSingleFullRecipe,
  getSingleShortRecipe,
  selectMeals,
  getMealNutrition,
  getWholeDayNutrion,
  buildMealsForEachDay
}
