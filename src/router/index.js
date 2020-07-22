import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/User'
import Role from '../components/Role'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/roles',
        component: Role
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//导航守卫
router.beforeEach((to, from, next) => {
  const token = window.sessionStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    return next('/login')
    // router.push('/login')
  }
  next()
})

export default router
