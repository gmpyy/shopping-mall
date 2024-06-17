import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/index.vue'
import Layout from '@/views/layout/index.vue'
import MyOrder from '@/views/myorder/index.vue'
import Pay from '@/views/pay/index.vue'
import ProDetail from '@/views/prodetail/index.vue'
import Search from '@/views/search/index.vue'
import List from '@/views/search/list.vue'
import Cart from '@/views/layout/cart.vue'
import Category from '@/views/layout/category.vue'
import Home from '@/views/layout/home.vue'
import User from '@/views/layout/user.vue'
import store from '@/store/index'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        { path: '/cart', component: Cart },
        { path: '/category', component: Category },
        { path: '/home', component: Home },
        { path: '/user', component: User }
      ]
    },
    { path: '/myorder', component: MyOrder },
    { path: '/pay', component: Pay },
    { path: '/prodetail/:id', component: ProDetail },
    { path: '/search', component: Search },
    { path: '/searchlist', component: List }
  ]
})
// 定义一个数组，里面存放需要拦截的url
const authUrl = ['/pay', '/myorder']
router.beforeEach((to, from, next) => {
  const token = store.getters.token
  // 如果不属于要拦截的url，直接放行
  if (!authUrl.includes(to.path)) {
    next()
    return
  }
  // 如果属于要拦截的url，检查有无token，有token直接放行
  if (token) {
    next()
  } else {
    next('/login')
  }
})

export default router
