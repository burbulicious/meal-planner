const mealPlanKey: string = 'mealPlan'
const ingredientsKey: string = 'ingredients'
const allRecipesKey: string = 'allRecipes'
const caloriesLimitKey: string = 'caloriesLimit'
const allExtractedIngredientsKey: string = 'allExtractedIngredients'
const combinedIngredientsKey: string = 'combinedIngredients'

const storeDataInLocalStorage = (key: string, data: any): Boolean => {
  if (key && data) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}

const getDataFromLocalStorage = (key: string): any => {
  const storedData = localStorage.getItem(key)
  if (storedData) {
    try {
      return JSON.parse(storedData)
    } catch (error) {
      return false
    }
  } else {
    return false
  }
}

export {
  storeDataInLocalStorage,
  getDataFromLocalStorage,
  mealPlanKey,
  ingredientsKey,
  allRecipesKey,
  allExtractedIngredientsKey,
  caloriesLimitKey,
  combinedIngredientsKey
}
