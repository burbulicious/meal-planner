import { defineStore } from 'pinia'
import type { WeeklyMealPlan, RecipeExtended } from '@/types/recipes'
import {
  getApiMealPlan,
  getFullRecipes,
  // getWholeDayNutrion,
  buildMealsForEachDay
} from '@/services/fetchRecipes'
import {
  getDataFromLocalStorage,
  storeDataInLocalStorage,
  apiMealPlanKey,
  ingredientsKey,
  allRecipesKey,
  simplifiedMealPlanKey
} from '@/utils/handleLocalStorage'
import itemExists from '@/utils/existsInList'

const initialMealPlanStructure = {
  week: {
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
}
const initialApiMealPlan: WeeklyMealPlan =
  getDataFromLocalStorage(apiMealPlanKey) || initialMealPlanStructure

const initialSimplifiedMealPlan: WeeklyMealPlan =
  getDataFromLocalStorage(simplifiedMealPlanKey) || initialMealPlanStructure

const initialIngredients: string =
  (localStorage.getItem(ingredientsKey) as string) || ('' as string)

const initialRecipes: RecipeExtended[] = getDataFromLocalStorage(allRecipesKey) || []

export const useMealPlanStore = defineStore({
  id: 'mealPlan',
  state: () => ({
    apiMealPlan: { ...initialApiMealPlan } as WeeklyMealPlan,
    simplifiedMealPlan: { ...initialSimplifiedMealPlan } as WeeklyMealPlan,
    ingredients: initialIngredients,
    allRecipes: initialRecipes as RecipeExtended[]
  }),

  actions: {
    setIngredients(updatedIngredients: string) {
      this.ingredients = updatedIngredients
      localStorage.setItem(ingredientsKey, this.ingredients)
    },
    addIngredient(newIngredient: string) {
      const ingredientToAdd: string = newIngredient.trim()
      if (!itemExists(ingredientToAdd, this.ingredients)) {
        if (this.ingredients) {
          this.ingredients += `, ${ingredientToAdd}`
        } else {
          this.ingredients = ingredientToAdd
        }
        localStorage.setItem(ingredientsKey, this.ingredients)
        return true
      }
      return false
    },
    removeIngredient(inputIngredient: string) {
      const ingredientToRemove: string = inputIngredient.trim()
      if (itemExists(ingredientToRemove, this.ingredients)) {
        this.ingredients = this.ingredients
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item !== ingredientToRemove)
          .join(', ')

        localStorage.setItem(ingredientsKey, this.ingredients)
        return true
      }
      return false
    },
    async setApiMealPlan() {
      this.apiMealPlan = await getApiMealPlan(this.ingredients)
      storeDataInLocalStorage(apiMealPlanKey, this.apiMealPlan)
      this.allRecipes = await getFullRecipes(this.apiMealPlan)
      console.log(this.allRecipes)
      storeDataInLocalStorage(allRecipesKey, this.allRecipes)
    },
    generateSimplifiedMealPlan() {
      this.simplifiedMealPlan = buildMealsForEachDay(this.apiMealPlan, this.allRecipes)
      console.log(this.simplifiedMealPlan)
      storeDataInLocalStorage(simplifiedMealPlanKey, this.simplifiedMealPlan)
    }
  },
  getters: {
    getApiMealPlan(): WeeklyMealPlan {
      return this.apiMealPlan
    },
    getSimplifiedMealPlan(): WeeklyMealPlan {
      return this.simplifiedMealPlan
    },
    getIngredients(): string {
      return this.ingredients
    },
    getAllrecipes(): RecipeExtended[] {
      return this.allRecipes
    }
  }
})
