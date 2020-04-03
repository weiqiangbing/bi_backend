import Vue from 'vue'
import VueRouter from 'vue-router'

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
    path: '/newPersonBenefits',
    name: 'newPersonBenefits',
    component: () => import('../views/newPersonBenefits.vue'),
    meta: {
      title: '新人福利',
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      title: '其他活动',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
    meta: {
      title: '登陆页',
    },
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/test.vue'),
    meta: {
      title: '测试页',
    },
  },
  // {
  //   path: '/errPage',
  //   name: 'errPage',
  //   component: () => import('../components/errPage.vue'),
  //   meta: {
  //     title: '路径错误',
  //   },
  // },
  // {
  //   redirect: '/errPage',
  //   path: '*',
  // },
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
