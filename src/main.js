import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from './router'
import store from './store'

Vue.config.productionTip = false


Vue.use(VueAxios, axios);
axios.defaults.baseURL = 'http://mysite.local/api';

Vue.router = router
Vue.use(require('@websanova/vue-auth'), {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  registerData: {
      url: '/register',
      method: 'POST',
  },
  loginData: {
      url: '/login',
      method: 'POST',
      redirect: '/',
      fetchUser: true,
  },
  logoutData: {
      url: '/logout',
      method: 'POST',
      redirect: '/login',
      makeRequest: true
  },
  refreshData: {
      url: '/refresh',
      method: 'GET',
      enabled: true,
      interval: 30,
  },
  fetchData: {
      url: '/me',
      method: 'GET',
      enabled: true
  },
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
