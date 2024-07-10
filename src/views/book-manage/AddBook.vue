<template>
  <div>
    <div
      style="min-height: 850px; justify-content: center; position: relative"
      id="map"
    />
    <!-- 添加的对话框 -->
    <el-dialog v-model="dialogVisible" :title="currentItem.t" width="30%">
      <el-form
        ref="addFormRef"
        style="max-width: 600px"
        :model="addForm"
        :rules="rules"
        label-width="auto"
        class="ruleForm"
        status-icon
      >
        <el-form-item label="预约日期" prop="book_time">
          <el-date-picker
            v-model="addForm.book_time"
            type="date"
            placeholder="请选择日期"
            style="width: 100%"
            :disabled-date="disabledDate"
            @change="handleSelectChange"
          />
        </el-form-item>

        <el-form-item label="预约课节" prop="book_class">
          <el-select
            v-model="addForm.book_class"
            placeholder="请选择课节"
            size="large"
            style="width: 100%"
          >
            <el-option
              v-for="item in ClassType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="disableSelect.includes(item.value)"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="预约原因" prop="book_reason">
          <el-input v-model="addForm.book_reason" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel()">取消</el-button>
          <el-button type="primary" @click="handleAddConfirm()">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { ImageLayer, PointLayer, Scene } from '@antv/l7'
import { Map } from '@antv/l7-maps'
import { ElMessage } from 'element-plus'
import { ClassType } from '@/util/type'
import axios from 'axios'
import { useUserStore } from '@/store/useUserStore'
import { url } from '@/util/urlConfig'
const { user } = useUserStore()
let scene, popup
onMounted(() => {
  scene = new Scene({
    id: 'map',
    map: new Map({
      center: [500, 500],
      zoom: 3,
      version: 'SIMPLE',
      mapSize: 1000,
      maxZoom: 5,
      minZoom: 2,
      pitchEnabled: false,
      rotateEnabled: false
    })
  })
  scene.setBgColor('rgb(94, 182, 140)')

  const imagelayer = new ImageLayer({}).source(url, {
    parser: {
      type: 'image',
      extent: [360, 400, 640, 600]
    }
  })

  scene.on('loaded', () => {
    getLabList()
    scene.addLayer(imagelayer)
  })
})

const getLabList = async () => {
  const res = await axios.get('/adminapi/labs')
  console.log(res.data)
  const list = res.data.map((item) => ({
    x: item.x,
    y: item.y,
    t: '预约' + item.title,
    id: item.id
  }))

  addTextLayer(list)
}

// 添加实验相关工作
const dialogVisible = ref(false)

const addFormRef = ref()
const addForm = ref({
  book_time: '',
  book_class: '',
  book_reason: ''
})
const rules = ref({
  book_time: [{ required: true, message: '请选择日期', trigger: 'blur' }],
  book_class: [{ required: true, message: '请选择课节', trigger: 'blur' }],
  book_reason: [{ required: true, message: '请输入原因', trigger: 'blur' }]
})

const handleAddConfirm = () => {
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      // console.log(addForm)
      dialogVisible.value = false

      ElMessage.success('提交成功，请等待审核！')
      await axios.post('/adminapi/books', {
        ...addForm.value,
        book_username: user.username,
        lab_id: currentItem.value.id
      })

      clear()
    } else {
      console.log('error submit!')
    }
  })
}

const currentItem = ref({})
const addTextLayer = (data) => {
  // console.log(addForm)
  const textlayer = new PointLayer({ zIndex: 2 })
    .source(data, {
      parser: {
        type: 'json',
        x: 'x',
        y: 'y'
      }
    })
    .shape('t', 'text')
    .size(14)
    .active({
      color: '#00f',
      mix: 0.9
    })
    .color('rgb(13, 71, 161)')
    .style({
      textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
      spacing: 2, // 字符间距
      fontWeight: '800',
      padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
      stroke: '#ffffff', // 描边颜色
      strokeWidth: 2, // 描边宽度
      textAllowOverlap: true
    })
  textlayer.on('click', (e) => {
    // console.log(e)
    currentItem.value = e.feature
    dialogVisible.value = true
  })
  scene.addLayer(textlayer)
}

// 禁用日期
const disabledDate = (time) => {
  return (
    time.getTime() < Date.now() ||
    time.getTime() > Date.now() + 7 * 24 * 60 * 60 * 1000
  )
}

// 取消
const handleCancel = () => {
  dialogVisible.value = false
  clear()
}

const clear = () => {
  addForm.value.book_time = ''
  addForm.value.book_class = ''
  addForm.value.book_reason = ''
}

// 改变日期的回调函数
const handleSelectChange = async () => {
  addForm.value.book_class = ''
  // console.log(val)
  // 发送请求
  const res = await axios.post('/adminapi/books/select', {
    book_time: addForm.value.book_time,
    lab_id: currentItem.value.id
  })
  console.log(res.data)
  disableSelect.value = res.data.map((item) => item.book_class)
}
const disableSelect = ref([])
</script>
