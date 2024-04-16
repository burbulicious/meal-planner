import { defineStore } from 'pinia'
import type { WeeklyMealPlan, Recipe } from '@/types/recipes'
import { generateMealPlan, fetchRecipes } from '@/services/fetchRecipes'
import { getDataFromLocalStorage, storeDataInLocalStorage } from '@/utils/handleLocalStorage'
import { useDataKeysStore } from '@/stores/localStorageDataKeys'

const initialMealPlan: WeeklyMealPlan = {
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

export const useMealPlanStore = defineStore({
  id: 'mealPlan',
  state: () => ({
    mealPlan: { ...initialMealPlan } as WeeklyMealPlan,
    ignredients:
      (localStorage.getItem(useDataKeysStore().ingredientsKey) as string) || ('' as string)
  }),

  actions: {
    async setMealPlan(updatedIngredients: string) {
      const dataKey: string = useDataKeysStore().mealPlanKey
      const ingredientKey: string = useDataKeysStore().ingredientsKey
      if (
        localStorage.getItem(ingredientKey) == updatedIngredients &&
        getDataFromLocalStorage(dataKey)
      ) {
        this.mealPlan = getDataFromLocalStorage(dataKey)
      } else {
        const recipes: Recipe[] = await fetchRecipes(updatedIngredients)
        const recipeIds: number[] = recipes.map((recipe) => recipe.id)
        this.mealPlan = await generateMealPlan(recipeIds)
        storeDataInLocalStorage(dataKey, this.mealPlan)
        this.ignredients = updatedIngredients
        localStorage.setItem(ingredientKey, this.ignredients)
      }
    }
  },
  getters: {
    getMealPlan(): WeeklyMealPlan {
      return this.mealPlan
    },
    getIngredients(): string {
      return this.ignredients
    }
  }
})
