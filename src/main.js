import '@babel/polyfill';
import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import { store } from './store';

import VueResource from 'vue-resource';
import './assets/bootstrap.min.css';

Vue.use(VueResource);

Vue.config.productionTip = false;

new Vue({
  router,
  store: store,
  render: h => h(App)
}).$mount('#app');
