import { defineStore } from 'pinia'
import type { WeeklyMealPlan, Recipe } from '@/types/recipes'
import { generateMealPlan, fetchRecipes } from '@/services/fetchRecipes'
import {
  getDataFromLocalStorage,
  storeDataInLocalStorage,
  mealPlanKey,
  ingredientsKey
} from '@/utils/handleLocalStorage'
import itemExists from '@/utils/existsInList'

const initialMealPlan: WeeklyMealPlan = getDataFromLocalStorage(mealPlanKey) || {
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
const initialIngredients: string =
  (localStorage.getItem(ingredientsKey) as string) || ('' as string)

export const useMealPlanStore = defineStore({
  id: 'mealPlan',
  state: () => ({
    mealPlan: { ...initialMealPlan } as WeeklyMealPlan,
    ingredients: initialIngredients
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
    async setNewMealPlan() {
      const recipes: Recipe[] = await fetchRecipes(this.ingredients)
      const recipeIds: number[] = recipes.map((recipe) => recipe.id)
      this.mealPlan = await generateMealPlan(recipeIds)
      storeDataInLocalStorage(mealPlanKey, this.mealPlan)
    }
  },
  getters: {
    getMealPlan(): WeeklyMealPlan {
      return this.mealPlan
    },
    getIngredients(): string {
      return this.ingredients
    }
  }
})
