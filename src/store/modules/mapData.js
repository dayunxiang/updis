const  mapData = {
   state:{
     mapData:{}
   },
  actions:{
     getMapData(ctx,mapData){
        ctx.commit('getMapData',mapData)
     }
  },
  mutations:{
    getMapData(state,mapData){
      state.mapData = mapData;

    }
  }
}

export default mapData
