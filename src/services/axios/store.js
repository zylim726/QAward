import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || null,
    accesslevel: localStorage.getItem("accesslevel") || null,
    username: localStorage.getItem("username") || null,
  },
  mutations: {
    setToken(state, { token, accesslevel, username }) {
      state.token = token;
      state.accesslevel = accesslevel;
      state.username = username;
      localStorage.setItem("token", token);
      localStorage.setItem("accesslevel", accesslevel);
      localStorage.setItem("username", username);
    },
    clearToken(state) {
      state.token = null;
      state.accesslevel = null;
      state.username = null;
      localStorage.removeItem("token");
      localStorage.removeItem("accesslevel");
      localStorage.removeItem("username");
    },
  },
  actions: {
    setToken({ commit }, { token, accesslevel, username }) {
      commit("setToken", { token, accesslevel, username });
    },
    clearToken({ commit }) {
      commit("clearToken");
    },
  },
});
