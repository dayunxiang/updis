<template>
  <div class="content">
      <!--降雨量  vs  控制率-->
      <div v-model="rainVSkongzhi">
        <div class="jiangyuliang-box">
          <!--@keyup="getRain"-->
          <span class="jiangyuliang">这里输入降雨量 (mm)</span><input type="text"  v-model="rainfall">
          <button @click="test">确认</button>
        </div>

        <ul class="content-ul">
          <li>
            所在降雨量范围下限 <input type="text" v-model="rainVSkongzhi.downValue">
          </li>
          <li>
            下限对应控制率 <input type="text"  v-model="rainVSkongzhi.down">
          </li>
          <li>
            所在降雨量范围上限 <input type="text" v-model="rainVSkongzhi.upValue">
          </li>
          <li>
            上限对应控制率 <input type="text" v-model="rainVSkongzhi.up">
          </li>
        </ul>

        <div class="kongzhilv-box">
          <span class="kongzhilv">这里是控制率 (%)</span> <input type="text" v-model="rainVSkongzhi.value">
        </div>
      </div>
      <!--控制率 vs 降雨量-->
    <div>
      <div class="kongzhilv-box" style="background: green;margin-top: 50px">
        <span class="kongzhilv">这里是控制率 (%)</span> <input type="text" v-model="kongzhi">
        <button @click="test1">确认</button>
      </div>
      <ul class="content-ul">
        <li>
          所在降雨量范围下限 <input type="text" v-model="kongzhiVSrain.downValue">
        </li>
        <li>
          下限对应控制率 <input type="text" v-model="kongzhiVSrain.down">
        </li>
        <li>
          所在降雨量范围上限 <input type="text" v-model="kongzhiVSrain.upValue">
        </li>
        <li>
          上限对应控制率 <input type="text" v-model="kongzhiVSrain.up">
        </li>
      </ul>

      <div class="jiangyuliang-box" style="background: green">
        <span class="jiangyuliang">这里输入降雨量 (mm)</span><input type="text" v-model="kongzhiVSrain.value">
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'nianjingliu',
    data() {
      return {
          rainfall:'',
          kongzhi:'',
          rainVSkongzhi:{
            rainfallofdown:'',
            upValue:'',
            downValue:'',
            up:'',
            down:'',
            value:''
          },
          kongzhiVSrain:{
            upValue:'',
            up:'',
            downValue:'',
            value:''
          },
        //
        B:[8.996622911,
          13.32718707,
          17.2441535,
          20.83354302,
          24.14621659,
          27.23907412,
          30.13466082,
          32.85444836,
          35.41574825,
          37.82231804,
          40.11763782,
          42.30331797,
          44.39505964,
          46.39138665,
          48.30021666,
          50.13523787,
          51.90919906,
          53.611767,
          55.24991998,
          56.82070565,
          58.32224524,
          59.77748657,
          61.18173272,
          62.53136036,
          63.83952086,
          65.09346544,
          66.30795585,
          67.48017395,
          68.60958293,
          69.69403564,
          70.73957098,
          71.76144724,
          72.74203083,
          73.66965995,
          74.54432118,
          75.37993085,
          76.18136032,
          76.95031392,
          77.69739327,
          78.41239934,
          79.10043165,
          79.76873687,
          80.42160934,
          81.05475473,
          81.65985277,
          82.24535793,
          82.81073341,
          83.35624761,
          83.88270572,
          84.38742378,
          84.87724588,
          85.35566117,
          85.82387742,
          86.27115881,
          86.70689918,
          87.1274752,
          87.53570501,
          87.92769689,
          88.31297888,
          88.67625242,
          89.03160829,
          89.37421536,
          89.70313426,
          90.02426968,
          90.33386409,
          90.63567502,
          90.93064186,
          91.21742264,
          91.49655414,
          91.76763376,
          92.03012473,
          92.28134308,
          92.52705932,
          92.76271072,
          92.99031025,
          93.20891852,
          93.42215888,
          93.625737,
          93.82448399,
          94.01705789,
          94.20319029,
          94.38288119,
          94.55894875,
          94.72508567,
          94.88384171,
          95.03615625],
        C:[87,
          86,
          85,
          84,
          83,
          82,
          81,
          80,
          79,
          78,
          77,
          76,
          75,
          74,
          73,
          72,
          71,
          70,
          69,
          68,
          67,
          66,
          65,
          64,
          63,
          62,
          61,
          60,
          59,
          58,
          57,
          56,
          55,
          54,
          53,
          52,
          51,
          50,
          49,
          48,
          47,
          46,
          45,
          44,
          43,
          42,
          41,
          40,
          39,
          38,
          37,
          36,
          35,
          34,
          33,
          32,
          31,
          30,
          29,
          28,
          27,
          26,
          25,
          24,
          23,
          22,
          21,
          20,
          19,
          18,
          17,
          16,
          15,
          14,
          13,
          12,
          11,
          10,
          9,
          8,
          7,
          6,
          5,
          4,
          3,
          2],
        D:[95.03615625,
          94.88384171,
          94.72508567,
          94.55894875,
          94.38288119,
          94.20319029,
          94.01705789,
          93.82448399,
          93.625737,
          93.42215888,
          93.20891852,
          92.99031025,
          92.76271072,
          92.52705932,
          92.28134308,
          92.03012473,
          91.76763376,
          91.49655414,
          91.21742264,
          90.93064186,
          90.63567502,
          90.33386409,
          90.02426968,
          89.70313426,
          89.37421536,
          89.03160829,
          88.67625242,
          88.31297888,
          87.92769689,
          87.53570501,
          87.1274752,
          86.70689918,
          86.27115881,
          85.82387742,
          85.35566117,
          84.87724588,
          84.38742378,
          83.88270572,
          83.35624761,
          82.81073341,
          82.24535793,
          81.65985277,
          81.05475473,
          80.42160934,
          79.76873687,
          79.10043165,
          78.41239934,
          77.69739327,
          76.95031392,
          76.18136032,
          75.37993085,
          74.54432118,
          73.66965995,
          72.74203083,
          71.76144724,
          70.73957098,
          69.69403564,
          68.60958293,
          67.48017395,
          66.30795585,
          65.09346544,
          63.83952086,
          62.53136036,
          61.18173272,
          59.77748657,
          58.32224524,
          56.82070565,
          55.24991998,
          53.611767,
          51.90919906,
          50.13523787,
          48.30021666,
          46.39138665,
          44.39505964,
          42.30331797,
          40.11763782,
          37.82231804,
          35.41574825,
          32.85444836,
          30.13466082,
          27.23907412,
          24.14621659,
          20.83354302,
          17.2441535,
          13.32718707,
          8.996622911],
        E:[8.996622911,
          13.32718707,
          17.2441535,
          20.83354302,
          24.14621659,
          27.23907412,
          30.13466082,
          32.85444836,
          35.41574825,
          37.82231804,
          40.11763782,
          42.30331797,
          44.39505964,
          46.39138665,
          48.30021666,
          50.13523787,
          51.90919906,
          53.611767,
          55.24991998,
          56.82070565,
          58.32224524,
          59.77748657,
          61.18173272,
          62.53136036,
          63.83952086,
          65.09346544,
          66.30795585,
          67.48017395,
          68.60958293,
          69.69403564,
          70.73957098,
          71.76144724,
          72.74203083,
          73.66965995,
          74.54432118,
          75.37993085,
          76.18136032,
          76.95031392,
          77.69739327,
          78.41239934,
          79.10043165,
          79.76873687,
          80.42160934,
          81.05475473,
          81.65985277,
          82.24535793,
          82.81073341,
          83.35624761,
          83.88270572,
          84.38742378,
          84.87724588,
          85.35566117,
          85.82387742,
          86.27115881,
          86.70689918,
          87.1274752,
          87.53570501,
          87.92769689,
          88.31297888,
          88.67625242,
          89.03160829,
          89.37421536,
          89.70313426,
          90.02426968,
          90.33386409,
          90.63567502,
          90.93064186,
          91.21742264,
          91.49655414,
          91.76763376,
          92.03012473,
          92.28134308,
          92.52705932,
          92.76271072,
          92.99031025,
          93.20891852,
          93.42215888,
          93.625737,
          93.82448399,
          94.01705789,
          94.20319029,
          94.38288119,
          94.55894875,
          94.72508567,
          94.88384171,
          95.03615625],
        G:[[8.996622911,1],
          [13.32718707,2],
          [17.2441535,3],
          [20.83354302,4],
          [24.14621659,5],
          [27.23907412,6],
          [30.13466082,7],
          [32.85444836,8],
          [35.41574825,9],
          [37.82231804,10],
          [40.11763782,11],
          [42.30331797,12],
          [44.39505964,13],
          [46.39138665,14],
          [48.30021666,15],
          [50.13523787,16],
          [51.90919906,17],
          [53.611767,18],
          [55.24991998,19],
          [56.82070565,20],
          [58.32224524,21],
          [59.77748657,22],
          [61.18173272,23],
          [62.53136036,24],
          [63.83952086,25],
          [65.09346544,26],
          [66.30795585,27],
          [67.48017395,28],
          [68.60958293,29],
          [69.69403564,30],
          [70.73957098,31],
          [71.76144724,32],
          [72.74203083,33],
          [73.66965995,34],
          [74.54432118,35],
          [75.37993085,36],
          [76.18136032,37],
          [76.95031392,38],
          [77.69739327,39],
          [78.41239934,40],
          [79.10043165,41],
          [79.76873687,42],
          [80.42160934,43],
          [81.05475473,44],
          [81.65985277,45],
          [82.24535793,46],
          [82.81073341,47],
          [83.35624761,48],
          [83.88270572,49],
          [84.38742378,50],
          [84.87724588,51],
          [85.35566117,52],
            [85.82387742,53],
            [86.27115881,54],
            [86.70689918,55],
            [87.1274752,56],
            [87.53570501,57],
            [87.92769689,58],
            [88.31297888,59],
            [88.67625242,60],
            [89.03160829,61],
            [89.37421536,62],
            [89.70313426,63],
            [90.02426968,64],
            [90.33386409,65],
            [90.63567502,66],
            [90.93064186,67],
            [91.21742264,68],
            [91.49655414,69],
            [91.76763376,70],
            [92.03012473,71],
            [92.28134308,72],
            [92.52705932,73],
            [92.76271072,74],
            [92.99031025,75],
            [93.20891852,76],
            [93.42215888,77],
              [93.625737,78],
            [93.82448399,79],
            [94.01705789,80],
            [94.20319029,81],
            [94.38288119,82],
            [94.55894875,83],
            [94.72508567,84],
            [94.88384171,85],
            [95.03615625,86]]
        }
      },
    mounted() {
    },
    methods:{
      test(){
        var self = this;
        var rainfall = self.rainfall;
        self.HandleRainfall(rainfall)
      },
      test1(){
        var self = this;
        var kongzhilv = self.kongzhi;
        self.HandleKongzhilv(kongzhilv)
      },
      /**
       * 通过降雨量计算
       * @param rainfall 降雨量
       * 10.5  10 11 两个数 差值 excel trend
       *
       */
      HandleRainfall(rainfall){
        var self = this;
        var rainfalls = Number(rainfall);
        if(String(rainfalls/1).indexOf('.')== -1){
          self.rainVSkongzhi.upValue = rainfall;
          self.rainVSkongzhi.downValue = rainfall;
          for(var i = 0;i<self.B.length;i++){
            if(i == rainfall){
              self.rainVSkongzhi.up = self.B[i-2].toFixed(2)
              self.rainVSkongzhi.down = self.B[i-2].toFixed(2)
              self.rainVSkongzhi.value = self.B[i-2].toFixed(2)
            }
          }
        }else{
          var up = parseInt(rainfalls)+1;
          var down =  parseInt(rainfalls);
          self.rainVSkongzhi.upValue = up;
          self.rainVSkongzhi.downValue = down;
          for(var i = 0;i<self.B.length;i++) {
            self.rainVSkongzhi.up = self.B[up-2].toFixed(2)
            self.rainVSkongzhi.down = self.B[down-2].toFixed(2)
          }
            var  k = (self.rainVSkongzhi.up-self.rainVSkongzhi.down)/(self.rainVSkongzhi.upValue-self.rainVSkongzhi.downValue);
            var  b = self.rainVSkongzhi.down - (k*self.rainVSkongzhi.downValue)
            var  y = k*rainfalls+b;
            self.rainVSkongzhi.value = y.toFixed(2)
        }
      },
      /**
       *通过控制率计算
       */
      HandleKongzhilv(kongzhilv){
        var self = this;
        var kongzhilvs = Number(kongzhilv);
        var upValue = self.E.sort(function(a,b){
          return Math.abs(a - kongzhilvs) - Math.abs(b - kongzhilvs);
        })[0];
        self.kongzhiVSrain.upValue = upValue.toFixed(2);
        for(var i = 0;i<self.G.length;i++){
          if(self.G[i][0] == upValue){
            self.kongzhiVSrain.up = self.G[i][1]+1;
          }

        }
        for(var j = 0;j<self.G.length;j++){
          if(self.G[j][1] == Number(self.kongzhiVSrain.up-1)){
            self.kongzhiVSrain.downValue = self.G[j-1][0].toFixed(2);
            self.kongzhiVSrain.down = self.G[j][1];
          }
        }


        var  k = (self.kongzhiVSrain.up-self.kongzhiVSrain.down)/(self.kongzhiVSrain.upValue-self.kongzhiVSrain.downValue);
        var  b = self.kongzhiVSrain.up - (k*self.kongzhiVSrain.downValue)
        console.log(b)
        var  y = k*kongzhilvs+b;
        console.log(y)
        self.kongzhiVSrain.value = y.toFixed(2);
      }
    }
  }
</script>

<style scoped>
  *{padding: 0;margin: 0}
  ul li{list-style-type: none}
  .content{
    margin: 0 auto;
    padding: 200px 0;
    width: 70%;
  }
  .jiangyuliang-box{
      clear: both;
      width: 520px;
      background: yellow;
    }
  .jiangyuliang{
    display: inline-block;
    padding: 10px;
  }
  .kongzhilv-box{
    clear: both;
    width: 520px;
    background: yellow;
  }
  .kongzhilv{
    display: inline-block;
    padding: 10px;
    letter-spacing: 2.1px;
  }
  input{
    width: 100px;
    height: 30px;
    text-align: center;
  }
  .content-ul{
    width: 700px;
  }
  .content-ul li{
    padding: 10px;
    float: left;
    letter-spacing: 1px;
  }
  .content-ul li input{margin-left: 4px}
</style>
