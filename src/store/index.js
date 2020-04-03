import Vue from 'vue'
import Vuex from 'vuex'
// import formatJson from '../lib/utils/formatJson'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    versionPop: false,
    themUrl: ''
  },
  getters:{
    
  },
  mutations: {
    showVersion(state, isTrue){
      state.versionPop = isTrue
    },
    // changeThem(state, name){
    //   state.themUrl = name
    // }
  },
  actions: {
    // syChangeThem(context, name){
    //   context.commit('changeThem', name)
    // }
  },
  modules: {

  }
})
