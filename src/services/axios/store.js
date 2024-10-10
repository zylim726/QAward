import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || null,
    accesslevel: localStorage.getItem("accesslevel") || null,
    username: localStorage.getItem("username") || null,
    isMaintenance: null,
    maintenanceEnd: null, 
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
      localStorage.clear();
    },
    setMaintenanceStatus(state, status) {
      state.isMaintenance = status;
    },
    setMaintenanceEnd(state, endTime) {
      state.maintenanceEnd = endTime;
    },
    clearMaintenanceStatus(state) {
      state.isMaintenance = null;
    },
  },
  actions: {
    setToken({ commit }, { token, accesslevel, username }) {
      commit("setToken", { token, accesslevel, username });
    },
    clearToken({ commit }) {
      commit("clearToken");
    },
    setMaintenanceStatus({ commit }, status) {
      commit("setMaintenanceStatus", status);
    },
    setMaintenanceEnd({ commit }, endTime) {
      commit("setMaintenanceEnd", endTime);
    },
    clearMaintenanceStatus({ commit }) {
      commit("clearMaintenanceStatus");
    },
  },
});
