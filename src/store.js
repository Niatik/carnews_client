import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export  default new Vuex.Store({
  state: {
    appTitle: 'Объявления',
    pathToApiSite: 'http://mysite.local',
    user: null,
    error: false,
    errors: null,
    loading: false,
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setErrors (state, payload) {
      state.errors = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setTitle (state, payload) {
      state.appTitle = payload
    }
  },
  actions: {
    userRegister ({commit}, payload) {
      commit('setLoading', true)

      payload.auth.register({
        data: {
          name: payload.name,
          email: payload.email,
          password: payload.password,
          password_confirmation: payload.password_confirmation
        },
        success: function () {
          commit('setError', false)
          commit('setLoading', false)
        },
        error: function (resp) {
          commit('setError', true)
          commit('setErrors', resp.response.data.errors)
          commit('setLoading', false)
        },
      });
    },
    userLogin({commit}, payload) {
      payload.auth.login({
        params: {
          email: payload.email,
          password: payload.password
        },
        rememberMe: true,
        redirect: '/',
        success: function () {
          commit('setError', false)
          commit('setLoading', false)
        },
        error: function (resp) {
          commit('setError', true)
          commit('setErrors', resp)
          commit('setLoading', false)
        },
      });
    },
    //eslint-disable-next-line
    userLogout({commit}, payload) {
      payload.auth.logout();
    },
    changeTitle({commit}, payload) {
      commit('setTitle', payload)
    }
  },
  getters: {}
})