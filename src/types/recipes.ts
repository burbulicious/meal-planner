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
type Recipe = {
  id: number
  title: string
  readyInMinutes: number
  servings: number
}

type Nutrients = {
  [key: string]: number
}

type RecipeExtended = Recipe & {
  image: string
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
  nutrition: {
    nutrients: Nutrients
    caloricBreakdown: {
      percentCarbs: number
      percentFat: number
      percentProtein: number
    }
  }
}

type WeeklyMealPlan = {
  week: {
    [key: string]: {
      meals: Recipe[]
      nutrients: Nutrients
    }
  }
}

type DailyMealPlan = {
  [key: string]: Recipe[]
}

type MealType = 'breakfast' | 'lunch' | 'dinner'

export type { Recipe, RecipeExtended, WeeklyMealPlan, Nutrients, DailyMealPlan, MealType }
