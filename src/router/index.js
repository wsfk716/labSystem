// 路由配置文件
import { createRouter, createWebHistory } from "vue-router";
import Login from '@/views/Login.vue'
import MainBox from '@/views/MainBox.vue'
import RouteConfig from './config'
import { useRouterStore } from '@/store/useRouterStore'
import { useUserStore } from '@/store/useUserStore'
import NotFound from '@/views/notfound/NotFound.vue'
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import nprogress from "nprogress";
const routes=[
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/mainbox',
    name: 'mainbox',
    component: MainBox
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加路由
// router.addRoute("mainbox",{
//   path:'/index',
//   component: Home
// })

// 路由拦截
router.beforeEach((to, from, next) => {
  // 显示进度条
  nProgress.start()
  
  const {isGetterRouter} = useRouterStore()
  const { user } = useUserStore()
  // next()
  if(to.name === 'login'){
    next()
  }else{
    // 如果没有登录
    if(!user.role){
      next({
        path: '/login'
      })
    }else {
      // 如果是第一次进入路由系统，才进行配置路由
      if(!isGetterRouter){
        router.removeRoute("mainbox")
        ConfigRouter()
        next({
          path:to.fullPath
        })
      }else{
        next()
      }
    }
  }

})
router.afterEach((to, from) => {

  // 关闭进度条
  nprogress.done()
})
// 遍历路由配置
const ConfigRouter = () => {
  router.addRoute({
    path: '/mainbox',
    name: 'mainbox',
    component: MainBox
  })
  let { changeRouter } = useRouterStore()
  RouteConfig.forEach(item => {
    checkPermission(item.path) && router.addRoute("mainbox",item)
  })
  // 重定向
  router.addRoute("mainbox",{
    path:'/',
    redirect:'/index'
  })
  // 404
  router.addRoute("mainbox",{
    path:'/:pathMatch(.*)*',
    name:'not-found',
    component:NotFound
  })
  // 打印全部路由
  // console.log(router.getRoutes())
  changeRouter(true)
}

// 判断是否有权限访问页面
const checkPermission = (path)=>{
  const { user } = useUserStore()
  return user.role.rights.includes(path)

}
export default router