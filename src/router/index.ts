import { createRouter, createWebHistory } from 'vue-router'
import RecipesView from '../views/RecipesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/recipes' },
    {
      path: '/recipes',
      name: 'recipes',
      component: RecipesView
    }
  ]
})

export default router
