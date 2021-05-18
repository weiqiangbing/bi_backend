import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: 'index',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true, noCache: false } // noCache: true 该路由不会被 <keep-alive> 缓存
    }]
  },

  {
    path: '/read',
    component: Layout,
    redirect: '/read/book',
    name: 'Read',
    meta: { title: '基础数据', icon: 'example' },
    children: [
      // {
      //   path: 'booksum',
      //   name: 'BookSum',
      //   component: () => import('@/views/read/bookSum/index'),
      //   meta: { title: '作品数据汇总', icon: 'education', noCache: false }
      // },
      {
        path: '/read/book',
        name: 'Book',
        component: () => import('@/views/read/book/index'),
        meta: { title: '作品PV', icon: 'education', noCache: false, api: '/bi/works/visit' }
      },
      {
        path: '/read/chapter',
        name: 'Chapter',
        component: () => import('@/views/read/chapterPv/index'),
        meta: { title: '章节PV', icon: 'education', noCache: false, api: '/bi/works/chapter' }
      },
      {
        path: '/read/bookcost',
        name: 'BookCost',
        component: () => import('@/views/read/bookCost/index'),
        meta: { title: '作品消费', icon: 'education', noCache: false, api: '/bi/cost/book' }
      },
      {
        path: '/read/bookact',
        name: 'BookAct',
        component: () => import('@/views/read/bookAct/index'),
        meta: { title: '作品互动', icon: 'education', noCache: false, api: '/bi/works/act' }
      },
      {
        path: '/read/bookrecom',
        name: 'BookRecom',
        component: () => import('@/views/read/bookRecom/index'),
        meta: { title: '推荐位统计', icon: 'tuijian', noCache: false, api: '/bi/works/recommend' }
      },
      {
        path: '/read/chapterlist',
        name: 'ChapterList',
        hidden: 'true',
        component: () => import('@/views/read/book/chapterList/index'),
        meta: { title: '章节列表', icon: 'list', noCache: false}
      },
      {
        path: '/read/pay',
        name: 'Pay',
        component: () => import('@/views/read/pay/index'),
        meta: { title: '充值统计', icon: 'money', noCache: false, api: '/bi/recharge/gather' }
      },
      {
        path: '/read/payuser',
        name: 'PayUser',
        component: () => import('@/views/read/payUser/index'),
        meta: { title: '用户充值详情', icon: 'user', noCache: false, api: '/bi/recharge/user'}
      },
      // {
      //   path: 'cost',
      //   name: 'Cost',
      //   component: () => import('@/views/read/cost/index'),
      //   meta: { title: '消费(数据)', icon: 'money' }
      // },
      {
        path: '/read/costuser',
        name: 'CostUser',
        component: () => import('@/views/read/costUser/index'),
        meta: { title: '用户消费详情', icon: 'user', noCache: false, api:'/bi/cost/user'}
      },
      {
        path: '/read/ratioTable',
        name: 'RatioTable',
        hidden: 'true',
        component: () => import('@/views/read/customTable/ratioTable'),
        meta: { title: '对比查询', icon: 'user', noCache: false }
      },
      {
        path: '/read/mergetable',
        name: 'MergeTable',
        hidden: 'true',
        component: () => import('@/views/read/customTable/mergeTable'),
        meta: { title: '组合查询', icon: 'user', noCache: false }
      },

      

      // {
      //   path: 'screen',
      //   name: 'Screen',
      //   component: () => import('@/views/read/screen/index'),
      //   meta: { title: '高级筛选', icon: 'shaixuan' },
      //   children: [
      //     {
      //       path: 'screengrouplist',
      //       component: () => import('@/views/read/screen/groupList/index'),
      //       name: 'ScreenUserList',
      //       meta: { title: '筛选列表' }
      //     }
      //   ]
      // },
      // {
      //   path: 'screen/screenuser',
      //   component: () => import('@/views/read/screen/user/index'),
      //   name: 'ScreenUser',
      //   meta: { title: '用户筛选' },
      //   hidden: true
      // },
      // {
      //   path: 'screen/screenbook',
      //   component: () => import('@/views/read/screen/book/index'),
      //   name: 'ScreenBook',
      //   meta: { title: '书籍筛选' },
      //   hidden: true
      // },
      // {
      //   path: 'my',
      //   name: 'My',
      //   component: () => import('@/views/read/my/index'),
      //   meta: { title: '我的', icon: 'list' },
      //   children: [
      //     {
      //       path: 'searchlist',
      //       component: () => import('@/views/read/my/searchList/index'),
      //       name: 'searchList',
      //       meta: { title: '我的报表', noCache: true }
      //     }
      //   ]
      // },


      // {
      //   path: 'demo',
      //   name: 'Demo',
      //   component: () => import('@/views/read/demo/index'),
      //   meta: { title: 'Demo', icon: 'table' },
      //   children: [
      //     // {
      //     //   path: 'demos',
      //     //   component: () => import('@/views/read/demo/demos/index'),
      //     //   name: 'demos',
      //     //   meta: { title: 'demos' }
      //     // },
      //     // {
      //     //   path: 'echarts',
      //     //   component: () => import('@/views/read/demo/echarts/index'),
      //     //   name: 'echarts',
      //     //   meta: { title: 'echarts' }
      //     // },
      //     {
      //       path: 'excel',
      //       component: () => import('@/views/read/demo/excel/index'),
      //       name: 'excel',
      //       meta: { title: 'excel(import)' }
      //     }
      //   ]
      // },
    ]
  },
  // 推广数据
  {
    path: '/extend',
    component: Layout,
    redirect: '/extend/appData',
    name: 'AppData',
    meta: { title: '推广数据', icon: 'example' },
    children: [
      {
        path: '/extend/appData',
        name: 'AppData',
        component: () => import('@/views/extend/appData/index'),
        meta: { title: 'App推广数据', icon: 'education', noCache: false, api:'/bi/spread/gather'}
      },
      {
        path: '/extend/appDataDetail',
        hidden: true,
        name: 'AppDataDetail',
        component: () => import('@/views/extend/appData/appDataDetail.vue'),
        meta: { title: '广告详情', icon: 'education', noCache: false, api:'/bi/spread/gather'}
      },
      // {
      //   path: '/dayMonthLife',
      //   name: 'AayMonthLife',
      //   component: () => import('@/views/extend/dayMonthLife/index'),
      //   meta: { title: '日活月活列表', icon: 'education', noCache: false, api:'/bi/user/active'}
      // },
      {
        path: '/extend/operationalData',
        name: 'operationalData',
        component: () => import('@/views/extend/operationalData/index'),
        meta: { title: 'App运营数据', icon: 'education', noCache: false, api:'/bi/spread/keep'}
      },
      {
        path: '/extend/newAddData',
        name: 'NewAddData',
        component: () => import('@/views/extend/newAddData/index'),
        meta: { title: '新增数据', icon: 'education', noCache: false, api:'/bi/user/reguserUser'}
      },
      {
        path: '/extend/returnModel',
        name: 'ReturnModel',
        component: () => import('@/views/extend/returnModel/index'),
        meta: { title: '回本模型', icon: 'education', noCache: false, api:''}
      },
      {
        path: '/extend/publishList',
        name: 'PublishList',
        component: () => import('@/views/extend/publishList/index'),
        meta: { title: '推送列表', icon: 'education', noCache: false, api:'/bi/push.list'}
      },
    ]
  },
  // 榜单数据
  {
    path: '/record',
    component: Layout,
    redirect: '/record/uvRanking',
    name: 'UvRanking',
    meta: { title: '榜单数据', icon: 'example' },
    children: [
      {
        path: '/record/uvRanking',
        name: 'UvRanking',
        component: () => import('@/views/record/uvRanking/index'),
        meta: { title: 'uv排行榜', icon: 'education', noCache: false, api:'/bi/works/uv_ranking'}
      },
      {
        path: '/record/growthRate',
        name: 'GrowthRate',
        component: () => import('@/views/record/growthRate/index'),
        meta: { title: '增幅排行榜', icon: 'education', noCache: false, api:'/bi/works/uv_incr_ranking'}
      },
    ]
  },
  // 运营数据
  {
    path: '/operate',
    component: Layout,
    redirect: '/operate/exclusiveBean',
    name: 'UvRanking',
    meta: { title: '运营数据', icon: 'example' },
    children: [
      {
        path: '/operate/exclusiveBean',
        name: 'ExclusiveBean',
        component: () => import('@/views/operate/exclusiveBean/index'),
        meta: { title: '专属魔豆数据', icon: 'tuijian', noCache: false, api:'/bi/active.statistics'}
      },
      {
        path: '/operate/recommenStatistics',
        name: 'RecommenStatistics',
        component: () => import('@/views/operate/recommenStatistics/index'),
        meta: { title: '推荐位统计', icon: 'tuijian', noCache: false, api:''}
      },
      {
        path: '/operate/rechargeStatics',
        name: 'RechargeStatics',
        component: () => import('@/views/operate/rechargeStatics/index'),
        meta: { title: '充值项统计', icon: 'tuijian', noCache: false, api:'/bi/topup.statistics'}
      },
      {
        path: '/operate/keyWordStatics',
        name: 'KeyWordStatics',
        component: () => import('@/views/operate/keyWordStatics/index'),
        meta: { title: '关键词统计', icon: 'tuijian', noCache: false, api:'/bi/keyword.list'}
      },
      {
        path: '/operate/activeRatio',
        name: 'ActiveRatio',
        component: () => import('@/views/operate/activeRatio/index'),
        meta: { title: '活动对比', icon: 'tuijian', noCache: false, api:''}
      },
      
      // {
      //   path: 'bookEveryDayStatics',
      //   name: 'BookEveryDayStatics',
      //   component: () => import('@/views/operate/bookEveryDayStatics/index'),
      //   meta: { title: '书籍每日统计', icon: 'tuijian', noCache: false, api:'/bi/works/bookact.list'}
      // },
      
    ]
  },

  {
    path: '/service',
    component: Layout,
    redirect: '/service/booksum',
    name: 'Service',
    meta: { title: '业务数据', icon: 'example' },
    children: [
      {
        path: '/service/booksum',
        name: 'BookSum',
        component: () => import('@/views/read/bookSum/index'),
        meta: { title: '作品数据', icon: 'education', noCache: false, api:'/bi/books/bookVisit'}
      },
      {
        path: '/service/bookDataStatic',
        name: 'BookDataStatic',
        hidden: true,
        component: () => import('@/views/read/bookSum/bookDataStatic'),
        meta: { title: '作品分析数据', icon: 'education', noCache: true, api:'/bi/translate/gather'}
      },
      // {
      //   path: 'bookAddData',
      //   name: 'BookAddData',
      //   component: () => import('@/views/read/bookSum/bookAddData.vue'),
      //   meta: { title: '新增作品数据', icon: 'education', noCache: false, api:''}
      // },
    ]
  },
  {
    path: '/service',
    component: Layout,
    redirect: '/service/screengrouplist',
    name: 'Screen',
    // component: () => import('@/views/read/screen/index'),
    meta: { title: '高级筛选', icon: 'shaixuan' },
    children: [
      {
        path: '/service/screengrouplist',
        component: () => import('@/views/read/screen/groupList/index'),
        name: 'ScreenUserList',
        meta: { title: '筛选列表' }
      },
      {
        path: '/service/screenuser',
        component: () => import('@/views/read/screen/user/index'),
        name: 'ScreenUser',
        meta: { title: '用户筛选' },
        hidden: true
      },
      {
        path: '/service/screenbook',
        component: () => import('@/views/read/screen/book/index'),
        name: 'ScreenBook',
        meta: { title: '书籍筛选' },
        hidden: true
      }
    ]
  },
  {
    path: '/my',
    component: Layout,
    redirect: '/my/searchlist',
    name: 'My',
    // component: () => import('@/views/read/my/index'),
    meta: { title: '我的', icon: 'list' },
    children: [
      {
        path: '/my/searchlist',
        component: () => import('@/views/read/my/searchList/index'),
        name: 'searchList',
        meta: { title: '我的报表', noCache: false }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
