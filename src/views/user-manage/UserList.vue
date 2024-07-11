<template>
  <div>
    <el-button type="primary" @click="handleAddUser">添加用户</el-button>
    <el-table :data="tableData" style="width: 100%" row-key="id">
      <!-- <el-table-column prop="roleName" label="角色名称" width="180" /> -->
      <el-table-column label="角色名称">
        <template #default="scope">
          <div>{{ scope.row.role.roleName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="username" width="180">
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            @click="handleUpdate(scope.row)"
            round
            type="primary"
            :disabled="scope.row.is_default ? true : false"
          >
            更新
          </el-button>
          <el-popconfirm
            title="你确定要删除吗？"
            @confirm="handleDelete(scope.row)"
            confirmButtonText="确定"
            cancelButtonText="取消"
          >
            <template #reference>
              <el-button
                type="danger"
                round
                :disabled="scope.row.is_default ? true : false"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加的对话框 -->
    <el-dialog v-model="dialogVisible" title="添加用户" width="30%">
      <el-form
        ref="addFormRef"
        style="max-width: 600px"
        :model="addForm"
        :rules="rules"
        label-width="auto"
        class="ruleForm"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select
            v-model="addForm.roleId"
            placeholder="请选择角色"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddConfirm"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 更新的对话框 -->
    <el-dialog v-model="UpdateVisible" title="更新用户" width="30%">
      <el-form
        ref="UpdateFormRef"
        style="max-width: 600px"
        :model="UpdateForm"
        :rules="rules"
        label-width="auto"
        class="ruleForm"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="UpdateForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="UpdateForm.password" />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select
            v-model="UpdateForm.roleId"
            placeholder="请选择角色"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="UpdateVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateConfirm">
            更新
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'

const tableData = ref([])
const roleList = ref([])
onMounted(() => {
  getList()
  getRoleList()
})

const getList = async () => {
  const res = await axios.get('/adminapi/users')
  tableData.value = res.data
}
const getRoleList = async () => {
  const res = await axios.get('/adminapi/roles')
  roleList.value = res.data
}
//
// 添加用户
const dialogVisible = ref(false)
const addFormRef = ref()
const addForm = ref({
  username: '',
  password: '',
  roleId: ''
})
const rules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }]
})

const handleAddUser = () => {
  dialogVisible.value = true
}

const handleAddConfirm = () => {
  addFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      console.log(addForm.value)
      // 发起请求添加数据
      await axios.post('/adminapi/users', addForm.value)
      dialogVisible.value = false
      await getList()
      // 清空表单
      addForm.value = {
        username: '',
        password: '',
        roleId: ''
      }
    } else {
      console.log(valid)
    }
  })
}
// 更新的操作
const UpdateVisible = ref(false)
const UpdateFormRef = ref()
const currentItem = ref({})
const UpdateForm = ref({
  username: '',
  password: '',
  roleId: ''
})
const handleUpdate = (row) => {
  console.log(row)
  UpdateVisible.value = true
  // updateForm 更新值  不能直接赋值，会失去响应式
  UpdateForm.value.username = row.username
  UpdateForm.value.password = row.password
  UpdateForm.value.roleId = row.role.id
  // currentItem 当前行的数据
  currentItem.value = row
}
const handleUpdateConfirm = async () => {
  UpdateVisible.value = false
  await axios.put(`/adminapi/users/${currentItem.value.id}`, UpdateForm.value)
  await getList()
}

// 删除的操作
const handleDelete = async ({ id }) => {
  await axios.delete(`/adminapi/users/${id}`)
  await getList()
}
</script>
