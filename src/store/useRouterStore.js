import { defineStore } from "pinia"
import { ref } from "vue"

export const useRouterStore = defineStore("router",( )=>{
  const isGetterRouter = ref(false)  // 是否获取路由
  const changeRouter = (val) =>{
    isGetterRouter.value = val
  }

  return {
    isGetterRouter,
    changeRouter
  }
})