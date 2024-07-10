import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import Particles from "@tsparticles/vue3";
import { loadFull } from "tsparticles";
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import '@/util/axios.config.js'
import { ElLoading } from 'element-plus'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App) 
.use(router)
.use(pinia)

.use(ElementPlus, {
  locale: zhCn,
})
.use(Particles, {
  init: async engine => {
    await loadFull(engine); // you can load the full tsParticles library from "tsparticles" if you need it
    // await loadSlim(engine); // or you can load the slim version from "@tsparticles/slim" if don't need Shapes or Animations
  },
})
.mount('#app')
              
