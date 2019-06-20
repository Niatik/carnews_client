import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#9c27b0',
    secondary: '#673ab7',
    accent: '#ff5722',
    error: '#f44336',
    warning: '#3f51b5',
    info: '#2196f3',
    success: '#4caf50'
  }
})
