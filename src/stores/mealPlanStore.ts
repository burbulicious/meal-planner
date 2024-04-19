import { defineStore } from 'pinia'
import type { WeeklyMealPlan, RecipeExtended } from '@/types/recipes'
import { getMealPlan, getFullRecipes } from '@/services/fetchRecipes'
import {
  getDataFromLocalStorage,
  storeDataInLocalStorage,
  mealPlanKey,
  ingredientsKey,
  allRecipesKey,
  caloriesLimitKey
} from '@/utils/handleLocalStorage'
import itemExists from '@/utils/existsInList'

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

const initialIngredients: string =
  (localStorage.getItem(ingredientsKey) as string) || ('' as string)

const initialRecipes: RecipeExtended[] = getDataFromLocalStorage(allRecipesKey) || []

export const useMealPlanStore = defineStore({
  id: 'mealPlan',
  state: () => ({
    mealPlan: { ...initialmealPlan } as WeeklyMealPlan,
    ingredients: initialIngredients,
    allRecipes: initialRecipes as RecipeExtended[],
    caloriesLimit: initialCaloriesLimit as number
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
      return
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
    async setMealPlan() {
      this.mealPlan = await getMealPlan(this.ingredients, this.caloriesLimit)
      storeDataInLocalStorage(mealPlanKey, this.mealPlan)
      this.allRecipes = await getFullRecipes(this.mealPlan)
      storeDataInLocalStorage(allRecipesKey, this.allRecipes)
    },
    setCaloriesLimit(newCaloriesLimit: number) {
      this.caloriesLimit = newCaloriesLimit
      storeDataInLocalStorage(caloriesLimitKey, this.caloriesLimit)
    }
  },
  getters: {
    getMealPlan(): WeeklyMealPlan {
      return this.mealPlan
    },
    getIngredients(): string {
      return this.ingredients
    },
    getAllrecipes(): RecipeExtended[] {
      return this.allRecipes
    },
    getCaloriesLimit(): number {
      return this.caloriesLimit
    }
  }
})
