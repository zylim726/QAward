// store.js

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    accesslevel: localStorage.getItem('accesslevel') || null,
    username: localStorage.getItem('username') || null,
    userid: localStorage.getItem('userid') || null,
  },
  mutations: {
    setToken(state, { token, accesslevel, username, userid }) {
      state.token = token;
      state.accesslevel = accesslevel;
      state.username = username;
      state.userid = userid;
      localStorage.setItem('token', token);
      localStorage.setItem('accesslevel', accesslevel);
      localStorage.setItem('username', username);
      localStorage.setItem('userid', userid);
    },
    clearToken(state) {
      state.token = null;
      state.accesslevel = null;
      state.username = null;
      state.userid = null;
      localStorage.removeItem('token');
      localStorage.removeItem('accesslevel');
      localStorage.removeItem('username');
      localStorage.removeItem('userid');
    },
  },
  actions: {
    setToken({ commit }, { token, accesslevel, username, userid }) {
      commit('setToken', { token, accesslevel, username, userid });
    },
    clearToken({ commit }) {
      commit('clearToken');
    },
  },
});
