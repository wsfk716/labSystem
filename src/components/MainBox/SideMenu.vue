<template>
  <el-aside width="200px">
    <el-scrollbar>
      <el-menu
        :default-active="route.fullPath"
        class="el-menu-vertical-demo"
        style="height: 100vh"
        :router="true"
      >
        <template v-for="data in datalist" :key="data.path">
          <el-sub-menu
            :index="data.path"
            v-if="data.children.length && checkAuth(data.path)"
          >
            <template #title>
              <el-icon>
                <component :is="iconMap[data.icon]"></component>
              </el-icon>
              <span>{{ data.title }}</span>
            </template>
            <template v-for="item in data.children" :key="item.path">
              <el-menu-item :index="item.path" v-if="checkAuth(item.path)">
                <el-icon>
                  <component :is="iconMap[item.icon]"></component>
                </el-icon>
                <span>{{ item.title }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>

          <el-menu-item :index="data.path" v-else-if="checkAuth(data.path)">
            <el-icon>
              <component :is="iconMap[data.icon]"></component>
            </el-icon>
            <span>{{ data.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script setup>
import { onMounted } from 'vue'
import axios from 'axios'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/useUserStore'
const route = useRoute() //当前路由对象
import {
  User,
  HomeFilled,
  Key,
  List,
  OfficeBuilding,
  UploadFilled
} from '@element-plus/icons-vue'
onMounted(() => {
  getList()
})
const datalist = ref([])
const getList = async () => {
  const res = await axios.get('/adminapi/rights')
  console.log(res.data)
  datalist.value = res.data
}

// 图标映射
const iconMap = {
  User,
  HomeFilled,
  Key,
  List,
  OfficeBuilding,
  UploadFilled
}
const { user } = useUserStore()
const checkAuth = (path) => {
  return user.role.rights.includes(path)
}
</script>
