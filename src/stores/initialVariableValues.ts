import type {
  WeeklyMealPlan,
  RecipeExtended,
  Ingredient,
  CombinedIngredient
} from '@/types/recipes'
import {
  getDataFromLocalStorage,
  mealPlanKey,
  ingredientsKey,
  allRecipesKey,
  caloriesLimitKey,
  allExtractedIngredientsKey,
  combinedIngredientsKey
} from '@/utils/handleLocalStorage'

const initialMealPlanStructure = {
  monday: {
    meals: [],
    nutrients: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    }
  },
  tuesday: {
    meals: [],
    nutrients: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    }
  },
  wednesday: {
    meals: [],
    nutrients: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    }
  },
  thursday: {
    meals: [],
    nutrients: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    }
  },
  friday: {
    meals: [],
    nutrients: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    }
  },
  saturday: {
    meals: [],
    nutrients: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    }
  },
  sunday: {
    meals: [],
    nutrients: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    }
  }
}
const initialCaloriesLimit: number = getDataFromLocalStorage(caloriesLimitKey) || 2000
const initialmealPlan: WeeklyMealPlan =
  getDataFromLocalStorage(mealPlanKey) || initialMealPlanStructure
const initialIngredients: string[] = getDataFromLocalStorage(ingredientsKey) || []
const initialRecipes: RecipeExtended[] = getDataFromLocalStorage(allRecipesKey) || []
const initialExtractedIngredients: Ingredient[] =
  getDataFromLocalStorage(allExtractedIngredientsKey) || []
const initialCombinedIngredients: CombinedIngredient[] = getDataFromLocalStorage(
  combinedIngredientsKey
) || [
  {
    name: '',
    isChecked: false
  }
]

export {
  initialCaloriesLimit,
  initialmealPlan,
  initialIngredients,
  initialRecipes,
  initialExtractedIngredients,
  initialCombinedIngredients
}
