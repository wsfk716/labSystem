<template>
  <div>
    <el-table :data="filterTableData" style="width: 100%" row-key="id">
      <!-- <el-table-column prop="roleName" label="角色名称" width="180" /> -->
      <el-table-column label="实验室名称">
        <template #default="scope">
          <el-link @click="handleLocation(scope.row)">{{
            scope.row.lab.title
          }}</el-link>
        </template>
      </el-table-column>

      <el-table-column label="预约人" v-admin>
        <template #header>
          <el-input
            v-model="search"
            size="small"
            placeholder="Type to search"
          />
        </template>
        <template #default="scope">
          <div>{{ scope.row.book_username }}</div>
        </template>
      </el-table-column>

      <el-table-column label="预约时间">
        <template #default="scope">
          <el-tag style="height: 45px; width: 80px; line-height: 20px"
            >{{ moment(scope.row.book_time).format('YYYY-MM-DD') }}
            <br />
            {{ class_method(scope.row.book_class) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="预约状态">
        <template #default="scope">
          <el-tag
            style="height: 45px; width: 80px; line-height: 20px"
            :type="Book_state_type[scope.row.book_state]"
          >
            {{ Book_state_text[scope.row.book_state] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" v-teacher>
        <template #default="scope">
          <el-popconfirm
            title="你确定要撤销吗？"
            @confirm="handleDelete(scope.row)"
            confirmButtonText="确定"
            cancelButtonText="取消"
          >
            <template #reference>
              <el-button type="danger" round> 撤销 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 预览框 -->
    <el-dialog
      v-model="dialogVisible"
      title="实验室详情"
      :fullscreen="true"
      v-if="dialogVisible"
    >
      <LabMap
        :x="currentItem.x"
        :y="currentItem.y"
        :t="currentItem.title"
      ></LabMap>
    </el-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import {
  ClassType,
  Book_state_text,
  Book_state_type,
  ADMIN,
  TEACHER
} from '@/util/type'
import LabMap from '@/components/lab-manage/LabMap.vue'
import { useUserStore } from '@/store/useUserStore'
import moment from 'moment'
import { computed } from 'vue'
onMounted(() => {
  getList()
})
const search = ref('')
const tableData = ref([])
const filterTableData = computed(() => {
  return tableData.value.filter(
    (item) =>
      !search.value ||
      item.book_username.toLowerCase().includes(search.value.toLowerCase())
  )
})
const { user } = useUserStore()
// console.log(user)
const getList = async () => {
  var res = null
  if (user.role.roleType === ADMIN) {
    res = await axios.get(`/adminapi/books`)
  } else {
    res = await axios.get(`/adminapi/books?book_username=${user.username}`)
  }

  tableData.value = res.data
}

const class_method = (value) => {
  const res = ClassType.find((item) => item.value === value)

  return res.label
}
const currentItem = ref({})
const dialogVisible = ref(false)
const handleLocation = (item) => {
  dialogVisible.value = true
  currentItem.value = item.lab
}
const handleDelete = async ({ id }) => {
  await await axios.delete(`/adminapi/books/${id}`)
  getList()
}
const vTeacher = {
  mounted(el) {
    // console.log(el)
    if (user.role.roleType !== TEACHER) {
      el.remove()
    }
  }
}
const vAdmin = {
  mounted(el) {
    // console.log(el)
    if (user.role.roleType !== ADMIN) {
      el.remove()
    }
  }
}
</script>
