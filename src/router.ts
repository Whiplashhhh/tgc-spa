import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import SignupPage from '@/pages/SignupPage.vue'
import { ROUTES } from '@/routes.ts'
import { useAuthStore } from '@/store/auth.store.ts'

export const isAuthenticated = ref(false)

const routes = [
  {
    // '/'
    path: ROUTES.HOME,
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    // '/login'
    path: ROUTES.LOGIN,
    component: LoginPage,
    meta: { guestOnly: true },
  },
  {
    // '/sign-up'
    path: ROUTES.SIGNUP,
    component: SignupPage,
    meta: { guestOnly: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return ROUTES.LOGIN
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return ROUTES.HOME
  }
  return true
})

export default router
