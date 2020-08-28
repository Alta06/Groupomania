import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    token: '',
    user: {}
  };
};

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState()],
  state:  getDefaultState(),
  getters: {
    isLoggedIn: state => {
      return state.token;
    }, getUser: state => {
      return state.user;
    }, isAdmin: state => {
      return state.admin;
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_ADMIN: (state, admin) => {
      state.admin = admin;
    },
    RESET: state => {
      Object.assign(state, getDefaultState());
    },
   
  },
  actions: {
    becomeAdmin: ({commit}, {admin}) => {
      commit('SET_ADMIN', admin);
    },
    login: ({ commit}, {token, user}) => {
      commit('SET_TOKEN', token);
      commit('SET_USER', user);
      Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    logout: ({commit}) => {
      localStorage.clear();

      commit('RESET');
    }
    }
  })
