import axios from 'axios';
import { ElMessage,ElLoading  } from 'element-plus';
// 添加请求拦截器
let loadingInstance1 = null;
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 读取token
  
  const token = localStorage.getItem('token');
  config.headers.token = token;

  // 显示loading
  loadingInstance1 = ElLoading.service({ fullscreen: true });
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  const res = response.data;
  res?.data?.token && localStorage.setItem('token', res?.data?.token);
  // 隐藏loading
  loadingInstance1&&loadingInstance1.close()
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  // 隐藏loading
  loadingInstance1&&loadingInstance1.close()
  // console.log(error.response);
  // const {status} = error.response;
  if(error.response.status === 401) {
    ElMessage.error('登录状态失效，请重新登录');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});