import { defineStore } from 'pinia'
import type { WeeklyMealPlan, Recipe, RecipeExtended } from '@/types/recipes'
import { generateMealPlan, fetchRecipes, getSingleRecipe } from '@/services/fetchRecipes'
import {
  getDataFromLocalStorage,
  storeDataInLocalStorage,
  mealPlanKey,
  ingredientsKey,
  individualRecipesKey
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

const initialRecipes: RecipeExtended[] = getDataFromLocalStorage(individualRecipesKey) || []

export const useMealPlanStore = defineStore({
  id: 'mealPlan',
  state: () => ({
    mealPlan: { ...initialMealPlan } as WeeklyMealPlan,
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
    async setNewMealPlan() {
      const recipes: Recipe[] = await fetchRecipes(this.ingredients)
      const recipeIds: number[] = recipes.map((recipe) => recipe.id)
      this.mealPlan = await generateMealPlan(recipeIds)

      Object.keys(this.mealPlan.week).forEach((day, index) => {
        const meals = this.mealPlan.week[day].meals
        if (index === 0) {
          meals.forEach(async (meal, index) => {
            const hasRecipe = this.allRecipes.some((recipe) => recipe.id === meal.id)
            if (!hasRecipe && index < 2) {
              const fullRecipeData: RecipeExtended = await getSingleRecipe(meal.id)
              this.allRecipes.push(fullRecipeData)
              storeDataInLocalStorage(individualRecipesKey, this.allRecipes)
            }
          })
        }
      })
      storeDataInLocalStorage(mealPlanKey, this.mealPlan)
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
    }
  }
})
