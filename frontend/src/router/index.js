import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/Home.vue'
import Login from '../components/Login.vue'
import Signup from '../components/Signup.vue'
import DuelHome from '../components/DuelHome.vue'
import DuelCreate from '../components/DuelCreate.vue'
import DuelJoin from '../components/DuelJoin.vue'
import DuelQuiz from '../components/DuelQuiz.vue'
import DuelResults from '../components/DuelResults.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/duel',
    name: DuelHome,
    component: DuelHome
  },
  {
    path:'/duel/create',
    name: DuelCreate,
    component: DuelCreate
  },
  {
    path: '/duel/join',
    name: DuelJoin,
    component: DuelJoin
  },
  {
    path:'/duel/:duelId/:duelCode',
    component: DuelQuiz
  },
  {
    path: '/duel/:duelId/results',
    name: DuelResults,
    component: DuelResults
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
