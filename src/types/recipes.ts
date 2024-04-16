type Ingredient = {
  id: number
  amount: number
  unit: string
  unitLong?: string
  unitShort?: string
  name: string
  originalName: string
  extendedName?: string
  measures?: {
    metric: {
      amount: number
      unitShort: string
      unitLong: string
    }
  }
}

type RecipeBase = {
  id: number
  title: string
  image: string
}

export type Recipe = RecipeBase & {
  missedIngredients: Ingredient[]
  unusedIngredients: Ingredient[]
}

export type RecipeExtended = RecipeBase & {
  extendedIngredients: Ingredient[]
  preparationMinutes: number
  cookingMinutes: number
  readyInMinutes: number
  servings: number
  summary: string
  instructions: string
  analyzedInstructions: {
    name: string
    steps: {
      number: number
      step: string
    }[]
  }[]
}

interface Meal {
  id: number
  title: string
  readyInMinutes: number
  servings: number
}

interface Nutrients {
  calories: number
  protein: number
  fat: number
  carbohydrates: number
}

interface DailyMealPlan {
  meals: Meal[]
  nutrients: Nutrients
}

export type WeeklyMealPlan = {
  week: {
    monday: DailyMealPlan
    tuesday: DailyMealPlan
    wednesday: DailyMealPlan
    thursday: DailyMealPlan
    friday: DailyMealPlan
    saturday: DailyMealPlan
    sunday: DailyMealPlan
  }
}

const initialSelectedRecipe = {
  id: 0,
  title: '',
  image: '',
  extendedIngredients: [],
  preparationMinutes: 0,
  cookingMinutes: 0,
  readyInMinutes: 0,
  servings: 0,
  summary: '',
  instructions: '',
  analyzedInstructions: []
}

export { initialSelectedRecipe }
