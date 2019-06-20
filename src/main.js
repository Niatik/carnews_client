import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.use(VueAxios, axios);

Vue.use(require('@websanova/vue-auth'), {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  registerData: {
      url: '/api/register',
      method: 'POST',
  },
  loginData: {
      url: '/api/login',
      method: 'POST',
      redirect: '/home',
      fetchUser: true,
  },
  logoutData: {
      url: '/api/logout',
      method: 'POST',
      redirect: '/',
      makeRequest: false
  },
  refreshData: {
      url: '/api/refresh',
      method: 'GET',
      enabled: true,
      interval: 30,
  },
  fetchData: {
      url: '/api/me',
      method: 'GET',
      enabled: true
  },
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
