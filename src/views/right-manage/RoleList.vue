<template>
  <div>
    <el-button type="primary" @click="handleAddRole">新建角色</el-button>
    <el-table :data="tableData" style="width: 100%" row-key="id">
      <!-- <el-table-column prop="roleName" label="角色名称" width="180" /> -->
      <el-table-column label="角色名称">
        <template #default="scope">
          <el-popover
            placement="right"
            title="权限详情"
            :width="200"
            trigger="hover"
            @before-enter="handlePopoverEnter(scope.row)"
          >
            <template #reference>
              <el-button class="m-2">{{ scope.row.roleName }}</el-button>
            </template>
            <template #default>
              <el-tree
                style="max-width: 600px"
                :data="rightList"
                :props="defaultProps"
                :default-expand-all="true"
                :render-content="renderContent"
              />
            </template>
          </el-popover>
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

    <!-- 更新的对话框 -->
    <el-dialog v-model="dialogVisible" title="更新角色" width="30%">
      <el-form
        ref="updateFormRef"
        style="max-width: 600px"
        :model="updateForm"
        :rules="rules"
        label-width="auto"
        class="ruleForm"
        status-icon
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="updateForm.roleName" />
        </el-form-item>
        <el-form-item label="角色权限" prop="rights">
          <el-tree
            :data="rightList"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            ref="treeRef"
            check-strictly
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm"> 更新 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加角色对话框，只有管理员才可以添加角色 -->
    <el-dialog v-model="AddDialogVisible" title="新建角色" width="30%">
      <el-form
        ref="addRoleFormRef"
        style="max-width: 600px"
        :model="addRoleForm"
        :rules="rules"
        label-width="auto"
        class="ruleForm"
        status-icon
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName" />
        </el-form-item>
        <el-form-item label="角色权限" prop="rights">
          <el-tree
            :data="rightList"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            ref="AddRoleTreeRef"
            check-strictly
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="AddDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddConfirm"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'

const tableData = ref([])
const rightList = ref([])
onMounted(() => {
  getList()
  getRightList()
})

const getList = async () => {
  const res = await axios.get('/adminapi/roles')
  tableData.value = res.data
}
const getRightList = async () => {
  const res = await axios.get('/adminapi/rights')
  rightList.value = res.data
}

const defaultProps = {
  children: 'children',
  label: 'title'
}
const currentRights = ref([])
const handlePopoverEnter = (item) => {
  currentRights.value = item.rights
}
const renderContent = (h, { node, data, store }) => {
  return h(
    'span',
    {
      class: `custom-tree-node ${currentRights.value.includes(data.path) ? 'active' : ''}`
    },
    h('span', null, node.label)
  )
}

// 对话框
const dialogVisible = ref(false)
const updateFormRef = ref()
const currentItem = ref({})
const updateForm = ref({
  roleName: ''
})
const rules = ref({
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
})

// 更新回调方法
const handleUpdate = (item) => {
  console.log(item)
  dialogVisible.value = true
  updateForm.value.roleName = item.roleName
  currentItem.value = item
  // 设置rights给tree
  nextTick(() => {
    treeRef.value.setCheckedKeys(JSON.parse(item.rights))
  })
}

// 更新tree
const treeRef = ref()
// 弹出框的确定方法
const handleConfirm = async () => {
  console.log(updateForm.value.roleName, treeRef.value.getCheckedKeys())
  await axios.put(`/adminapi/roles/${currentItem.value.id}`, {
    roleName: updateForm.value.roleName,
    rights: JSON.stringify(treeRef.value.getCheckedKeys())
  })
  dialogVisible.value = false
  await getList()
}

// 删除方法
const handleDelete = async ({ id }) => {
  await axios.delete(`/adminapi/roles/${id}`)
  dialogVisible.value = false
  await getList()
}

// 新建角色相关
const addRoleFormRef = ref()
const addRoleForm = ref({
  roleName: '',
  roleType: 2, // 角色类型默认为2，1是管理员。
  rights: []
})
const AddDialogVisible = ref(false)
// 处理添加角色
const handleAddRole = () => {
  AddDialogVisible.value = true
}

const AddRoleTreeRef = ref()
// 添加角色确定提交
const handleAddConfirm = () => {
  // 获取选中的节点
  const nodes = AddRoleTreeRef.value.getCheckedNodes(false, false)
  // 遍历选中的节点，获取path,存入rights数组中
  addRoleForm.value.rights = JSON.stringify(nodes.map((item) => item.path))

  addRoleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      console.log(addRoleForm.value)
      // 发送请求到后端提交数据
      await axios.post('/adminapi/roles', addRoleForm.value)
      AddDialogVisible.value = false
      // 清空表单
      addRoleForm.value = {
        roleName: '',
        roleType: 2,
        rights: ''
      }
      // 刷新列表
      await getList()
    } else {
      console.log(valid)
    }
  })
}
</script>

<style lang="scss" scoped>
:deep(.active) {
  color: #f56c6c;
}
</style>
