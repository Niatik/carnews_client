import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Login from './views/Login'
import Register from './views/Register'
import PostTable from './views/PostTable'
import Post from './views/Post'
import SubscriptionTable from './views/SubscriptionTable'
import SubscriptionForm from './views/SubscriptionForm'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        auth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        auth: false
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        auth: false
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/categories/:category_id/posts',
      component: PostTable,
      name: 'posts',
      meta: {
        auth: true
      }
    },
    {
      path: '/categories/:category_id/posts/:post_id',
      component: Post,
      name: 'post',
      meta: {
        auth: true
      }
    },
    {
      path: '/subscriptions',
      component: SubscriptionTable,
      name: 'subscriptions',
      meta: {
        auth: true
      }
    },
    {
      path: '/subscriptions/create',
      component: SubscriptionForm,
      name: 'subscription-create',
      meta: {
        auth: true
      }
    }
  ]
})
