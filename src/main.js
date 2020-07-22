import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入全局样式表
import './assets/css/global.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css'
import axios from 'axios'
import { Message } from 'element-ui';
Vue.use(ElementUI);

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 为请求头,添加token验证的`Authorization`
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

Vue.prototype.$http = axios

Vue.prototype.$message = Message


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
