import Vue from 'vue'; //引用vue
import Vuex from 'vuex'; //引用vuex
Vue.use(Vuex); //使用vuex

const state = { //
  areaType: 1, // 默认黄土地
  seedId: '', // 种子id
  ypydId: 1, // 一品一地地区id
}

// getters 可以认为是 store 的计算属性
const getters = {};

//声明一个常量mutations，将所有的mutation放入其中
const mutations = {
  areaTypeFun(state, index) { // 切换土地
    state.areaType = index;
  },
  seedIdFun(state, index) { // 种子id
    state.seedId = index;
  },
  ypydIdFun(state, index) { // 一品一地地址id
    state.ypydId = index;
  }
}

export default new Vuex.Store({ //暴露Store对象
  state,
  getters,
  mutations
});
