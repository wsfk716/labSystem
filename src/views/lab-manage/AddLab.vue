<template>
  <div>
    <div
      style="min-height: 850px; justify-content: center; position: relative"
      id="map"
    />
    <!-- 添加的对话框 -->
    <el-dialog v-model="dialogVisible" title="添加实验室" width="30%">
      <el-form
        ref="addFormRef"
        style="max-width: 600px"
        :model="addForm"
        :rules="rules"
        label-width="auto"
        class="ruleForm"
        status-icon
      >
        <el-form-item label="实验室名称" prop="title">
          <el-input v-model="addForm.title" />
        </el-form-item>
        <el-form-item label="容纳人数" prop="capacity">
          <el-input v-model="addForm.capacity" type="number" />
        </el-form-item>
        <el-form-item label="实验室类型" prop="lab_type">
          <el-select
            v-model="addForm.lab_type"
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
            v-model="addForm.college_type"
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
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddConfirm"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { ImageLayer, PointLayer, Scene, Popup } from '@antv/l7'
import { Map } from '@antv/l7-maps'
import { ElMessage } from 'element-plus'
import { LabTypeList, CollegeTypeList } from '@/util/type'
import axios from 'axios'
import { url } from '@/util/urlConfig'
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
  // 给图片层绑定事件
  imagelayer.on('mousemove', (e) => {
    let { lng, lat } = e.lngLat
    popup = new Popup({
      offsets: [0, 0],
      closeButton: false
    })
      .setLnglat(e.lngLat)
      .setHTML(
        `<button class="el-button el-button--primary" onclick="add_popup(${lng},${lat})">选择位置</button> `
      )
    scene.addPopup(popup)
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
    t: item.title
  }))
  addTextLayer(list)
}

window.add_popup = (x, y) => {
  dialogVisible.value = true
  // 将pop隐藏
  popup.close()
  // x,y
  addForm.value.x = 500 + 2.8 * x
  addForm.value.y = 500 + 2.8 * y
  // console.log(x, y)
}

// 添加实验相关工作
const dialogVisible = ref(false)

const addFormRef = ref()
const addForm = ref({
  title: '',
  capacity: '',
  lab_type: '',
  college_type: '',
  x: 0,
  y: 0
})
const rules = ref({
  title: [{ required: true, message: '请输入实验室名称', trigger: 'blur' }],
  capacity: [{ required: true, message: '请输入容纳人数', trigger: 'blur' }],
  lab_type: [{ required: true, message: '请选择实验室类型', trigger: 'blur' }],
  college_type: [{ required: true, message: '请选择所属院系', trigger: 'blur' }]
})

const handleAddConfirm = () => {
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log(addForm)
      dialogVisible.value = false

      ElMessage.success('添加成功！')
      await axios.post('/adminapi/labs', addForm.value)
      addTextLayer()
      // 重新渲染页面
      getLabList()
      // window.location.reload()
    } else {
      console.log('error submit!')
    }
  })
}

const addTextLayer = (data) => {
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

  scene.addLayer(textlayer)
}
</script>
