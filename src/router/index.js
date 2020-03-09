import Vue from 'vue'
import VueRouter from 'vue-router'
// import rechargeActivities from '../views/rechargeActivities.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/rechargeActivities',
    name: 'rechargeActivities',
    component: () => import('../views/rechargeActivities.vue'),
    meta: {
      title: '充值活动',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      title: '其他活动',
    },
  },
  {
    path: '/errPage',
    name: 'errPage',
    component: () => import('../components/errPage.vue'),
    meta: {
      title: '路径错误',
    },
  },
  {
    redirect: '/errPage',
    path: '*',
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next)=>{
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next()
})

export default router
