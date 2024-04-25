import type {
  WeeklyMealPlan,
  RecipeExtended,
  Nutrients,
  MealType,
  Ingredient
} from '@/types/recipes'

const formatMealPlan = (data: any): WeeklyMealPlan => {
  const newMealPlan: WeeklyMealPlan = {}
  Object.keys(data.week).forEach((day) => {
    newMealPlan[day] = data.week[day]
    const dayMeals = newMealPlan[day].meals
    dayMeals.forEach((meal, index) => {
      if (index === 0) {
        dayMeals[index]['mealType'] = 'breakfast'
      } else if (index === 1) {
        dayMeals[index]['mealType'] = 'lunch'
      } else if (index === 2) {
        dayMeals[index]['mealType'] = 'dinner'
      }
    })
  })
  return newMealPlan
}

const getRecipeIds = (mealPlan: WeeklyMealPlan): number[] => {
  const recipeIds: number[] = []
  Object.keys(mealPlan).forEach((day) => {
    const meals = mealPlan[day].meals
    meals.forEach((item: any) => {
      if (!recipeIds.includes(item.id)) recipeIds.push(item.id)
    })
  })

  return recipeIds
}

const getSingleFullRecipe = (allRecipes: RecipeExtended[], recipeId: number): RecipeExtended => {
  return allRecipes.find((item) => item.id === recipeId)!
}

const getMealNutrition = (allRecipes: RecipeExtended[], recipeId: number): Nutrients => {
  const recipe = allRecipes.find((item) => item.id === recipeId)
  return {
    calories: recipe?.nutrition?.nutrients?.calories || 0,
    protein: recipe?.nutrition?.nutrients?.protein || 0,
    fat: recipe?.nutrition?.nutrients?.fat || 0,
    carbohydrates: recipe?.nutrition?.nutrients?.carbohydrates || 0
  }
}

const getMealType = (mealPlan: WeeklyMealPlan, recipeId: number): MealType => {
  let mealType: MealType = 'breakfast'
  Object.values(mealPlan).forEach((day) => {
    const meal = day.meals.find((item) => item.id === recipeId)
    if (meal) mealType = meal.mealType
  })
  return mealType
}

const constructRecipesData = (data: any, mealPlan: WeeklyMealPlan): RecipeExtended[] => {
  const allRecipes: RecipeExtended[] = []

  data.forEach((item: any) => {
    const nutrients = {
      calories: item.nutrition.nutrients.find((nutrient: any) => nutrient.name === 'Calories')
        .amount,
      protein: item.nutrition.nutrients.find((nutrient: any) => nutrient.name === 'Protein')
        ?.amount,
      fat: item.nutrition.nutrients.find((nutrient: any) => nutrient.name === 'Fat')?.amount,
      carbohydrates: item.nutrition.nutrients.find(
        (nutrient: any) => nutrient.name === 'Carbohydrates'
      )?.amount
    }
    allRecipes.push({
      id: item.id,
      title: item.title,
      readyInMinutes: item.readyInMinutes,
      servings: item.servings,
      nutrition: {
        nutrients: nutrients,
        caloricBreakdown: item.nutrition.caloricBreakdown
      },
      mealType: getMealType(mealPlan, item.id),
      image: item.image,
      extendedIngredients: item.extendedIngredients,
      preparationMinutes: item.preparationMinutes,
      cookingMinutes: item.cookingMinutes,
      summary: item.summary,
      instructions: item.instructions,
      analyzedInstructions: item.analyzedInstructions
    })
  })
  return allRecipes
}

const getFullIngredientList = (allRecipes: RecipeExtended[]): Ingredient[] => {
  const allIngredients: Ingredient[] = []

  allRecipes.forEach((item) => {
    item.extendedIngredients.forEach((ingredient: Ingredient) => {
      if (!allIngredients.map((item) => item.name).includes(ingredient.name)) {
        allIngredients.push(ingredient)
      }
    })
  })

  return allIngredients
}

export {
  getSingleFullRecipe,
  getMealNutrition,
  getMealType,
  formatMealPlan,
  getRecipeIds,
  getFullIngredientList,
  constructRecipesData
}
