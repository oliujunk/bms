import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import db from '@/common/db';
import App from './App.vue';
import router from './router';
import store from './store';


Vue.use(ElementUI);

Vue.db = Vue.prototype.$db = db;

Vue.config.productionTip = false;

const vue = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

export default vue;
