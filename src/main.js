import Vue from 'vue'
import App from './App.vue'
import router from './routers/index'
import store from './stores/index'

Vue.config.productionTip = false

import axios from 'axios'
Vue.prototype.axios = axios

// 过滤器
Vue.filter('setWH', (url, arg) => {
  // 从用户传入的参数替换url
  return url.replace(/w\.h/, arg);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
