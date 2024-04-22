import { defineStore } from 'pinia'
import type {
  WeeklyMealPlan,
  RecipeExtended,
  MealType,
  Ingredient,
  CombinedIngredient
} from '@/types/recipes'
import { generateMealPlan, getFullRecipes, getFullIngredientList } from '@/services/fetchRecipes'
import {
  getDataFromLocalStorage,
  storeDataInLocalStorage,
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
const initialIngredients: string =
  (localStorage.getItem(ingredientsKey) as string) || ('' as string)
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

export const useMealPlanStore = defineStore({
  id: 'mealPlan',
  state: () => ({
    mealPlan: { ...initialmealPlan } as WeeklyMealPlan,
    ingredients: initialIngredients,
    allRecipes: initialRecipes as RecipeExtended[],
    caloriesLimit: initialCaloriesLimit as number,
    extractedIngredients: initialExtractedIngredients as Ingredient[],
    combinedIngredients: initialCombinedIngredients as CombinedIngredient[]
  }),

  actions: {
    setCombinedIngredients() {
      const updatedCombinedIngredients: CombinedIngredient[] = this.combinedIngredients.filter(
        (item) => item.name
      )
      const myIngredientsList: string[] = this.getIngredients
        .split(',')
        .map((item) => item.trim().toLowerCase())
      myIngredientsList.forEach((item) => {
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
    setIngredients(updatedIngredients: string) {
      this.ingredients = updatedIngredients
      localStorage.setItem(ingredientsKey, this.ingredients)
      this.setCombinedIngredients()
    },
    addIngredient(newIngredient: string) {
      const ingredientToAdd: string = newIngredient.trim().toLowerCase()
      let updatedIngredients: string = ''
      if (this.ingredients) {
        const ingredientsList: string[] = this.ingredients.toLowerCase().split(',')
        if (
          !ingredientsList.find((item) => item.trim() === ingredientToAdd) &&
          ingredientToAdd !== ''
        ) {
          updatedIngredients = this.ingredients + `, ${ingredientToAdd}`
        } else {
          updatedIngredients = this.ingredients
        }
      } else {
        updatedIngredients = ingredientToAdd
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
      const ingredientsList: string[] = this.ingredients.toLowerCase().split(',')
      if (ingredientsList.find((item) => item.trim().toLowerCase() === ingredientToRemove)) {
        const updatedIngredients: string = ingredientsList
          .map((item) => item.trim())
          .filter((item) => item !== ingredientToRemove)
          .join(', ')
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
      const extractedIngredients = getFullIngredientList(this.allRecipes)
      this.extractedIngredients = extractedIngredients
      storeDataInLocalStorage(allExtractedIngredientsKey, this.extractedIngredients)
      const updatedCombinedIngredients: CombinedIngredient[] = this.combinedIngredients
      const myIngredientsList: string[] = this.getIngredients
        .split(',')
        .map((item) => item.trim().toLowerCase())
      this.extractedIngredients.forEach((item) => {
        if (!myIngredientsList.includes(item.name) || item.name !== '') {
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
    getIngredients(): string {
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
