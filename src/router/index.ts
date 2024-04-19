import { createRouter, createWebHistory } from 'vue-router'
import RecipesView from '../views/RecipesView.vue'
import MealPlanView from '../views/MealPlanView.vue'
import ShoppingListView from '@/views/ShoppingListView.vue'
import SingleRecipeView from '@/views/SingleRecipeView.vue'
import { getDataFromLocalStorage, mealPlanKey } from '@/utils/handleLocalStorage'
import OnboardingView from '@/views/OnboardingView.vue'

const redirectHomeIfNoMealPlan = (to: any, from: any, next: any): void => {
  !getDataFromLocalStorage(mealPlanKey) ? next('/') : next()
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'onboarding',
      component: OnboardingView,
      beforeEnter: (to, from, next) => {
        getDataFromLocalStorage(mealPlanKey) ? next('/meal-plan') : next()
      }
    },
    {
      path: '/meal-plan',
      name: 'MealPlan',
      component: MealPlanView,
      beforeEnter: redirectHomeIfNoMealPlan
    },
    {
      path: '/recipes',
      name: 'Recipes',
      component: RecipesView,
      beforeEnter: redirectHomeIfNoMealPlan
    },
    {
      path: '/shopping-list',
      name: 'ShoppingList',
      component: ShoppingListView,
      beforeEnter: redirectHomeIfNoMealPlan
    },
    {
      path: '/recipes/:title',
      name: 'SingleRecipeView',
      component: SingleRecipeView
    }
  ]
})

export default router
