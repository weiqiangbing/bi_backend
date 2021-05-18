const state = {
  selectGroup: [],
  fullLoading: false
}

const mutations = {
  setGroup: (state, arr) => {
    state.selectGroup = arr
  },
  changeFullLoad(state, isTrue){
    state.fullLoading = isTrue
  }
}

const actions = {
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
