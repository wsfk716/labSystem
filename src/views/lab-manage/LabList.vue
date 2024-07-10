<template>
  <div>
    <el-table :data="tableData" style="width: 100%" row-key="id">
      <!-- <el-table-column prop="roleName" label="角色名称" width="180" /> -->
      <el-table-column label="实验室名称">
        <template #default="scope">
          <el-link @click="handleLocation(scope.row)">{{
            scope.row.title
          }}</el-link>
        </template>
      </el-table-column>

      <el-table-column label="所属学院">
        <template #default="scope">
          <el-tag
            :color="CollegesColorType[scope.row.college_type]"
            size="large"
            effect="dark"
            >{{ college_method(scope.row.college_type) }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column label="实验室类型">
        <template #default="scope">
          <el-tag
            :color="LabColorType[scope.row.lab_type]"
            size="large"
            effect="dark"
            >{{ lab_method(scope.row.lab_type) }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="容纳人数" prop="capacity" width="180">
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
    <!-- 更新实验室信息 -->
    <el-dialog v-model="dialogUpdateVisible" title="更新实验室" width="30%">
      <el-form
        ref="UpdateFormRef"
        style="max-width: 600px"
        :model="UpdateForm"
        :rules="rules"
        label-width="auto"
        class="ruleForm"
        status-icon
      >
        <el-form-item label="实验室名称" prop="title">
          <el-input v-model="UpdateForm.title" />
        </el-form-item>
        <el-form-item label="容纳人数" prop="capacity">
          <el-input v-model.number="UpdateForm.capacity" type="number" />
        </el-form-item>
        <el-form-item label="实验室类型" prop="lab_type">
          <el-select
            v-model="UpdateForm.lab_type"
            placeholder="请选择实验室类型"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="item in LabTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属院系" prop="college_type">
          <el-select
            v-model="UpdateForm.college_type"
            placeholder="请选择院系"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="item in CollegeTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogUpdateVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateConfirm">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import {
  CollegeTypeList,
  LabTypeList,
  LabColorType,
  CollegesColorType
} from '@/util/type'
import LabMap from '@/components/lab-manage/LabMap.vue'
onMounted(() => {
  getList()
})
const tableData = ref([])
const getList = async () => {
  const res = await axios.get('/adminapi/labs')
  tableData.value = res.data
}

const college_method = (value) => {
  const res = CollegeTypeList.find((item) => item.value === value)

  return res.label
}
const lab_method = (value) => {
  const res = LabTypeList.find((item) => item.value === value)

  return res.label
}

// 预览实验室
const currentItem = ref({})
const dialogVisible = ref(false)
const handleLocation = (item) => {
  // 显示对话框
  dialogVisible.value = true
  currentItem.value = item
  // console.log(item)
}

// 添加实验相关工作
const dialogUpdateVisible = ref(false)

const UpdateFormRef = ref()
const UpdateForm = ref({
  title: '',
  capacity: '',
  lab_type: '',
  college_type: ''
})
const rules = ref({
  title: [{ required: true, message: '请输入实验室名称', trigger: 'blur' }],
  capacity: [{ required: true, message: '请输入容纳人数', trigger: 'blur' }],
  lab_type: [{ required: true, message: '请选择实验室类型', trigger: 'blur' }],
  college_type: [{ required: true, message: '请选择所属院系', trigger: 'blur' }]
})
const handleUpdate = (item) => {
  dialogUpdateVisible.value = true

  UpdateForm.value.title = item.title
  UpdateForm.value.capacity = item.capacity
  UpdateForm.value.lab_type = item.lab_type
  UpdateForm.value.college_type = item.college_type

  currentItem.value = item
}
const handleUpdateConfirm = () => {
  UpdateFormRef.value.validate(async (valid) => {
    if (valid) {
      // console.log(UpdateFormRef.value)

      dialogUpdateVisible.value = false

      await axios.put(
        `/adminapi/labs/${currentItem.value.id}`,
        UpdateForm.value
      )
      await getList()
    } else {
      console.log('error submit!')
    }
  })
}

// 删除实验室

const handleDelete = async (item) => {
  await axios.delete(`/adminapi/labs/${item.id}`)
  await getList()
}
</script>
<style scoped lang="scss">
// .el-tag {
//   --el-tag-text-color: white;
// }
</style>
