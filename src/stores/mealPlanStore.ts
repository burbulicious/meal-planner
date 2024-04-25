import { defineStore } from 'pinia'
import type {
  WeeklyMealPlan,
  RecipeExtended,
  MealType,
  Ingredient,
  CombinedIngredient
} from '@/types/recipes'
import { generateMealPlan, getFullRecipes } from '@/services/fetchRecipes'
import { getFullIngredientList } from '@/composables/recipeDataManipulation'
import {
  storeDataInLocalStorage,
  mealPlanKey,
  ingredientsKey,
  allRecipesKey,
  caloriesLimitKey,
  allExtractedIngredientsKey,
  combinedIngredientsKey
} from '@/utils/handleLocalStorage'
import {
  initialCaloriesLimit,
  initialmealPlan,
  initialIngredients,
  initialRecipes,
  initialExtractedIngredients,
  initialCombinedIngredients
} from './initialVariableValues'

export const useMealPlanStore = defineStore({
  id: 'mealPlan',
  state: () => ({
    mealPlan: { ...initialmealPlan },
    ingredients: initialIngredients,
    allRecipes: initialRecipes,
    caloriesLimit: initialCaloriesLimit,
    extractedIngredients: initialExtractedIngredients,
    combinedIngredients: initialCombinedIngredients
  }),

  actions: {
    setCombinedIngredients() {
      const updatedCombinedIngredients: CombinedIngredient[] = this.combinedIngredients.filter(
        (item) => item.name
      )
      this.getIngredients.forEach((item) => {
        const currentItem: CombinedIngredient | undefined = updatedCombinedIngredients.find(
          (ingredient) => ingredient.name === item
        )
        if (!currentItem) {
          updatedCombinedIngredients.push({ name: item, isChecked: true })
        }
      })
      this.combinedIngredients = updatedCombinedIngredients.reduce(
        (uniqueItems: CombinedIngredient[], currentItem: CombinedIngredient) => {
          const isDuplicate = uniqueItems.some((item) => item.name === currentItem.name)
          if (!isDuplicate) {
            uniqueItems.push(currentItem)
          }

          return uniqueItems
        },
        []
      )
      storeDataInLocalStorage(combinedIngredientsKey, this.combinedIngredients)
    },
    setIngredients(updatedIngredients: string[]) {
      this.ingredients = updatedIngredients
      storeDataInLocalStorage(ingredientsKey, this.ingredients)
      this.setCombinedIngredients()
    },
    addIngredient(newIngredient: string) {
      const ingredientToAdd: string = newIngredient.trim().toLowerCase()
      let updatedIngredients: string[] = []
      if (this.ingredients) {
        updatedIngredients = this.ingredients
        if (
          !this.ingredients.find((item) => item.trim() === ingredientToAdd) &&
          ingredientToAdd !== ''
        ) {
          updatedIngredients.push(ingredientToAdd)
        }
      } else {
        updatedIngredients = [ingredientToAdd]
      }
      this.setIngredients(updatedIngredients)
      this.combinedIngredients = this.combinedIngredients.map((item) => {
        if (item.name === newIngredient) {
          return { name: item.name, isChecked: true }
        }
        return item
      })
      this.setCombinedIngredients()
    },
    removeIngredient(inputIngredient: string) {
      const ingredientToRemove: string = inputIngredient.trim().toLowerCase()
      if (this.ingredients.find((item) => item.trim().toLowerCase() === ingredientToRemove)) {
        const updatedIngredients: string[] = this.ingredients.filter(
          (item) => item !== ingredientToRemove
        )
        this.setIngredients(updatedIngredients)
        this.combinedIngredients = this.combinedIngredients.map((item) => {
          if (item.name === inputIngredient) {
            return { name: item.name, isChecked: false }
          }
          return item
        })
        this.setCombinedIngredients()
      }
    },
    async setMealPlan(): Promise<void> {
      this.mealPlan = await generateMealPlan(this.ingredients, this.caloriesLimit)
      storeDataInLocalStorage(mealPlanKey, this.mealPlan)
      this.allRecipes = await getFullRecipes(this.mealPlan)
      storeDataInLocalStorage(allRecipesKey, this.allRecipes)
      this.setExtractedIngredients()
    },
    setCaloriesLimit(newCaloriesLimit: number): void {
      this.caloriesLimit = newCaloriesLimit
      storeDataInLocalStorage(caloriesLimitKey, this.caloriesLimit)
    },
    getMealsByMealType(mealType: MealType): RecipeExtended[] {
      return this.allRecipes.filter((meal) => meal.mealType === mealType)
    },
    setExtractedIngredients() {
      this.extractedIngredients = getFullIngredientList(this.allRecipes)
      storeDataInLocalStorage(allExtractedIngredientsKey, this.extractedIngredients)

      const updatedCombinedIngredients: CombinedIngredient[] = this.combinedIngredients
      this.extractedIngredients.forEach((item) => {
        if (!this.getIngredients.includes(item.name) || item.name !== '') {
          updatedCombinedIngredients.push({ name: item.name, isChecked: false })
        }
      })
      this.combinedIngredients = updatedCombinedIngredients
    }
  },
  getters: {
    getMealPlan(): WeeklyMealPlan {
      return this.mealPlan
    },
    getIngredients(): string[] {
      return this.ingredients
    },
    getAllrecipes(): RecipeExtended[] {
      return this.allRecipes
    },
    getCaloriesLimit(): number {
      return this.caloriesLimit
    },
    getExtractedIngredients(): Ingredient[] {
      return this.extractedIngredients
    }
  }
})
