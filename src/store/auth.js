import api from "../api/axios";
export default {
  namespaced: true,
  state: {
    token: localStorage.getItem("token") || null,
    user: null,
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    SET_USER(state, user) {
      state.user = user;
    },
    LOGOUT(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  actions: {
    async login({ commit }, form) {
      const res = await api.post("/login", form);
      console.log("LOGIN RESPONSE:", res.data);
      if (!res.data.success) {
        throw new Error(res.data.message);
      }
      const token = res.data.token;


      if (!token) {
        throw new Error("Token not found in response");
      }
      commit("SET_TOKEN", res.data.token);
      return res.data;
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
  },
};
