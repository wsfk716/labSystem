<template>
  <vue-particles
    id="tsparticles"
    @particles-loaded="particlesLoaded"
    :options="config"
  />

  <div class="formContainer">
    <h3>智慧实验室管理平台</h3>
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="ruleForm"
      status-icon
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" />
      </el-form-item>

      <el-form-item>
        <el-button
          class="LoginbButton"
          type="primary"
          @click="submitForm(ruleFormRef)"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/useUserStore'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import { config } from '@/util/config'
import axios from 'axios'
import { ElMessage } from 'element-plus'
// 粒子配置
const particlesLoaded = async (container) => {
  // console.log("Particles container loaded", container);
}

// 表单对象
const ruleFormRef = ref()
const ruleForm = reactive({
  username: '',
  password: ''
})
const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})
const router = useRouter()
const { changeUser } = useUserStore()

// 登录回调函数
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await axios.post('/adminapi/users/login', ruleForm)
      let { code, data } = res.data
      if (code === 0) {
        changeUser(data)
        ElMessage.success('登录成功！')
        router.push('/')
      } else {
        ElMessage.error('用户名或密码错误，请重新输入！')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>
<style lang="scss" scoped>
.formContainer {
  width: 500px;
  height: 300px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-shadow: 2px 2px 5px black;
  text-align: center;
  z-index: 999;
  .ruleForm {
    margin-top: 50px;
  }
  h3 {
    font-size: 40px;
  }
  :deep(.el-form-item__label) {
    color: white;
    font-size: 16px;
    font-weight: bold;
  }
  .LoginbButton {
    width: 20%;
    margin-left: 40%;
  }
}
</style>
