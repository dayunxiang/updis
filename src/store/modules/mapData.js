const  mapData = {
   state:{
     mapData:{},
     info:{}
   },
  actions:{
     getMapData(ctx,mapData){
        ctx.commit('getMapData',mapData)
     },
     getInfo(ctx,info){
       ctx.commit('getInfo',info)
     }
  },
  mutations:{
    getMapData(state,mapData){
      state.mapData = mapData;

    },
    getInfo(state,info){
      state.info = info;
    }
  }
}

export default mapData
