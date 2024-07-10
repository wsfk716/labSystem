<template>
  <div>
    <div
      style="min-height: 850px; justify-content: center; position: relative"
      id="map"
    />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { ImageLayer, PointLayer, Scene, Popup } from '@antv/l7'
import { Map } from '@antv/l7-maps'
import { ElMessage } from 'element-plus'

import axios from 'axios'
import moment from 'moment'
import { APPROVE, AUDIT, ClassType, Book_state_text } from '@/util/type'
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

  imagelayer.on('click', () => {
    popup && popup.close()
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
    t: item.title,
    id: item.id
  }))
  addTextLayer(list)
}

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
  bindTextEvent(textlayer)
  scene.addLayer(textlayer)
}

const bindTextEvent = (textlayer) => {
  textlayer.on('click', async (e) => {
    // console.log(e)
    const res = await Promise.all([
      axios.get(`/adminapi/books?lab_id=${e.feature.id}&&book_state=${AUDIT}`),
      axios.get(`/adminapi/books?lab_id=${e.feature.id}&&book_state=${APPROVE}`)
    ])

    var list = [...res[0].data, ...res[1].data]
    if (list.length) {
      list = list
        .map(
          (
            item
          ) => `<li class="home-item el-card is-always-shadow box-card">${moment(item.book_time).format('YYYY-MM-DD')}
          ${ClassType.find((data) => data.value === item.book_class).label}
          <span class=${item.book_state === 0 ? 'yellow' : 'green'}>${Book_state_text[item.book_state]}</span>
        </li>`
        )
        .join('')
    } else {
      list = '<li home-item el-card is-always-shadow box-card>暂无预约信息</li>'
    }

    let { lng, lat } = e.lngLat
    popup = new Popup({
      offsets: [0, 0],
      closeButton: false,
      maxWidth: 280
    })
      .setLnglat(e.lngLat)
      .setHTML(list)
    scene.addPopup(popup)

    ElMessage({
      message: e.feature.t,
      type: 'success'
    })
  })
}
</script>
<style lang="scss" scoped>
:deep(.home-item) {
  list-style: none;
  height: 30px;
  line-height: 30px;
  padding: 10px;
  width: 200px;

  span.yellow {
    color: #e6a23c;
  }
  span.green {
    color: #14c145;
  }
}
</style>
