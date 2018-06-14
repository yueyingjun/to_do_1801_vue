import Vue from 'vue'
import App from './App'
import router from "./router.js"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

import "@/assets/css/bootstrap.min.css"


Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
