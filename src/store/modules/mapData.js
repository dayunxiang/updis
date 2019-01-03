const mapData = {
  state: {
    mapData: {},
    info: {},
    resultData: {}
  },
  actions: {
    getMapData(ctx, mapData) {
      ctx.commit('getMapData', mapData)
    },
    getInfo(ctx, info) {
      ctx.commit('getInfo', info)
    },
    getResultData(ctx, resultData) {
      ctx.commit('getResultData', resultData)
    }
  },
  mutations: {
    getMapData(state, mapData) {
      state.mapData = mapData
    },
    getInfo(state, info) {
      state.info = info
    },
    getResultData(state, resultData) {
      state.resultData = resultData
    }
  }
}

export default mapData
