<template>
  <div>
    <el-table :data="tableData" style="width: 100%" row-key="id">
      <el-table-column prop="title" label="权限名称" width="180" />
      <!-- 自定义 -->
      <el-table-column label="图标" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon size="20px">
              <component :is="iconMap[scope.row.icon]"></component>
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="handleUpdate(scope.row)" round type="primary">
            更新
          </el-button>
          <el-popconfirm
            title="你确定要删除吗？"
            @confirm="handleDelete(scope.row)"
            confirmButtonText="确定"
            cancelButtonText="取消"
          >
            <template #reference>
              <el-button type="danger" round> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog v-model="dialogVisible" title="更新权限" width="30%">
      <el-form
        ref="updateFormRef"
        style="max-width: 600px"
        :model="updateForm"
        :rules="rules"
        label-width="auto"
        class="ruleForm"
        status-icon
      >
        <el-form-item label="权限名称" prop="title">
          <el-input v-model="updateForm.title" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm"> 更新 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {
  User,
  HomeFilled,
  Key,
  List,
  OfficeBuilding,
  UploadFilled
} from '@element-plus/icons-vue'

const tableData = ref([])

onMounted(() => {
  getList()
})

const getList = async () => {
  const res = await axios.get('/adminapi/rights')
  tableData.value = res.data
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
// 对话框
const dialogVisible = ref(false)
const updateFormRef = ref()
const currentItem = ref({})
const updateForm = ref({
  title: ''
})
const rules = ref({
  title: [{ required: true, message: '请输入权限名称', trigger: 'blur' }]
})
// 处理更新操作
const handleUpdate = (item) => {
  // console.log(item)
  currentItem.value = item
  updateForm.value = item
  dialogVisible.value = true
}
// 点击更新时需要校验
const handleConfirm = () => {
  updateFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      // console.log(updateForm.value)
      await axios.put(
        `/adminapi/rights/${currentItem.value.id}`,
        updateForm.value
      )
      dialogVisible.value = false
      await getList()
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 删除方法
const handleDelete = async ({ id }) => {
  await axios.delete(`/adminapi/rights/${id}`)
  await getList()
}
</script>
