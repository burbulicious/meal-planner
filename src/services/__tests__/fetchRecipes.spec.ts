import { it, expect, describe } from 'vitest'
import { formatMealPlan, getRecipeIds, getSingleFullRecipe } from '../fetchRecipes'
import type { MealType, RecipeExtended, WeeklyMealPlan } from '@/types/recipes'

const apiReturnedData = {
  week: {
    moday: {
      meals: [
        {
          id: 1,
          title: 'Ricotta Chocolate Chips Scones',
          readyInMinutes: 45,
          servings: 4
        },
        {
          id: 2,
          title: 'Crispy-Crowned Guacamole Fish Fillets',
          readyInMinutes: 30,
          servings: 2
        },
        {
          id: 3,
          title: 'Baked Ravioli & Meat Sauce',
          readyInMinutes: 45,
          servings: 8
        }
      ],
      nutrients: {
        calories: 1999.91,
        protein: 115.85,
        fat: 103.61,
        carbohydrates: 169.02
      }
    }
  }
}
const recipes: RecipeExtended[] = [
  {
    id: 1,
    title: 'Ricotta Chocolate Chips Scones',
    readyInMinutes: 45,
    servings: 4,
    mealType: 'breakfast' as MealType,
    nutrition: {
      nutrients: {
        calories: 307.15,
        protein: 5.92,
        fat: 12.18,
        carbohydrates: 43.85
      },
      caloricBreakdown: {
        percentProtein: 7.67,
        percentFat: 35.51,
        percentCarbs: 56.82
      }
    },
    image: 'https://img.spoonacular.com/recipes/658326-556x370.jpg',
    extendedIngredients: [
      {
        id: 19334,
        aisle: 'Baking',
        name: 'milk to brush and brown sugar',
        originalName: 'milk to brush and brown sugar to top',
        amount: 4,
        unit: 'servings'
      }
    ],
    preparationMinutes: -1,
    cookingMinutes: -1,
    summary:
      'The recipe Ricotta Chocolate Chips Scones can be made <b>in about 45 minutes</b>. This recipe serves 4. One portion of this dish contains roughly <b>6g of protein</b>, <b>12g of fat</b>, and a total of <b>292 calories</b>. For <b>36 cents per serving</b>, this recipe <b>covers 6%</b> of your daily requirements of vitamins and minerals. This recipe from Foodista requires chocolate chips, sugar, baking powder, and milk ricotta cheese. 1 person were impressed by this recipe. It works well as an inexpensive breakfast. This recipe is typical of European cuisine. Taking all factors into account, this recipe <b>earns a spoonacular score of 19%</b>, which is not so super. If you like this recipe, you might also like recipes such as <a href="https://spoonacular.com/recipes/pumpkin-scones-with-chocolate-chips-931116">Pumpkin Scones with Chocolate Chips</a>, <a href="https://spoonacular.com/recipes/paleo-almond-flour-chocolate-chips-scones-1178587">Paleo Almond Flour Chocolate Chips Scones</a>, and <a href="https://spoonacular.com/recipes/strawberry-ricotta-scones-548184">Strawberry Ricotta Scones</a>.',
    instructions:
      'Preheat the oven to 400F degress. Line a baking sheet with parchment paper.\nIn a bowl whisk together the flour, the sugar, the baking powder, the baking soda and the salt.\nCut in the ricotta and butter and lightly work with your fingers until the mixture resembles coarse sand. Gently stir in the buttermilk, the vanilla extract and the chocolate chips.\nTurn the dough out onto a floured surface. Knead gently for 1  2 minutes, the dough should hold together but be a bit crumbly.\nPlace the dough on the prepared baking sheet lined with parchment paper. Pat the dough into a 3/4-inch-thick circle.\nCut  the dough into 4 wedges without separating them. Use a pastry brush to brush the surface of the dough with milk and then sprinkle with brown sugar.\nBake for about 15 minutes or until lightly browned. Let them cool on a cooling  rack.',
    analyzedInstructions: [
      {
        name: '',
        steps: [
          {
            number: 1,
            step: 'Preheat the oven to 400F degress. Line a baking sheet with parchment paper.'
          }
        ]
      }
    ]
  }
]
const mealPlan: WeeklyMealPlan = {
  monday: {
    meals: [
      {
        id: 1,
        title: 'Breakfast Recipe',
        readyInMinutes: 30,
        servings: 2,
        mealType: 'breakfast' as MealType
      },
      {
        id: 2,
        title: 'Breakfast Recipe',
        readyInMinutes: 30,
        servings: 2,
        mealType: 'lunch' as MealType
      },
      {
        id: 3,
        title: 'Breakfast Recipe',
        readyInMinutes: 30,
        servings: 2,
        mealType: 'dinner' as MealType
      }
    ],
    nutrients: {
      calories: 1999.91,
      protein: 115.85,
      fat: 103.61,
      carbohydrates: 169.02
    }
  },
  tuesday: {
    meals: [
      {
        id: 1,
        title: 'Breakfast Recipe',
        readyInMinutes: 30,
        servings: 2,
        mealType: 'breakfast' as MealType
      },
      {
        id: 2,
        title: 'Breakfast Recipe',
        readyInMinutes: 30,
        servings: 2,
        mealType: 'lunch' as MealType
      },
      {
        id: 3,
        title: 'Breakfast Recipe',
        readyInMinutes: 30,
        servings: 2,
        mealType: 'dinner' as MealType
      }
    ],
    nutrients: {
      calories: 1999.91,
      protein: 115.85,
      fat: 103.61,
      carbohydrates: 169.02
    }
  }
}
it('return correct meal plan format based on api data', () => {
  const expectedData: WeeklyMealPlan = {
    moday: {
      meals: [
        {
          id: 1,
          title: 'Ricotta Chocolate Chips Scones',
          readyInMinutes: 45,
          servings: 4,
          mealType: 'breakfast'
        },
        {
          id: 2,
          title: 'Crispy-Crowned Guacamole Fish Fillets',
          readyInMinutes: 30,
          servings: 2,
          mealType: 'lunch'
        },
        {
          id: 3,
          title: 'Baked Ravioli & Meat Sauce',
          readyInMinutes: 45,
          servings: 8,
          mealType: 'dinner'
        }
      ],
      nutrients: {
        calories: 1999.91,
        protein: 115.85,
        fat: 103.61,
        carbohydrates: 169.02
      }
    }
  }

  expect(formatMealPlan(apiReturnedData)).toEqual(expectedData)
})

it('gets all different recipe IDs', () => {
  expect(getRecipeIds(mealPlan)).toEqual([1, 2, 3])
})

describe('fetched single full recipe', () => {
  it('gets the correct recipe by id if recipe exists', () => {
    expect(getSingleFullRecipe(recipes, 1)).toEqual(recipes[0])
  })
  it('return undefined is recipe doesnt exist', () => {
    expect(getSingleFullRecipe(recipes, 2)).toEqual(undefined)
  })
})
