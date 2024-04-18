import { createRouter, createWebHistory } from 'vue-router'
import RecipesView from '../views/RecipesView.vue'
import MealPlanView from '../views/MealPlanView.vue'
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
      name: 'meal-plan',
      component: MealPlanView,
      beforeEnter: redirectHomeIfNoMealPlan
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: RecipesView,
      beforeEnter: redirectHomeIfNoMealPlan
    }
  ]
})

export default router
