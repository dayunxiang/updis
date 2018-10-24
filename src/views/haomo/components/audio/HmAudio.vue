<template>
  <div>
    <!-- 此处的ref属性，可以很方便的在vue组件中通过 this.$refs.audio获取该dom元素 -->
    <audio ref="audio"
           @pause="onPause"
           @play="onPlay"
           :src="src" controls="controls"></audio>

    <!-- 音频播放控件 -->
    <div>
      <el-button type="text" @click="startPlayOrPause">{{audio.playing | transPlayPause}}</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      src: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        audio: {
          // 该字段是音频是否处于播放状态的属性
          playing: false
        }
      }
    },
    created() {
      const self = this
      self.srcs = self.src
      console.log(self.src)
    },
    methods: {
      // 控制音频的播放与暂停
      startPlayOrPause() {
        return this.audio.playing ? this.pause() : this.play()
      },
      // 播放音频
      play() {
        this.$refs.audio.play()
      },
      // 暂停音频
      pause() {
        this.$refs.audio.pause()
      },
      // 当音频播放
      onPlay() {
        this.audio.playing = true
      },
      // 当音频暂停
      onPause() {
        this.audio.playing = false
      }
    },
    filters: {
      // 使用组件过滤器来动态改变按钮的显示
      transPlayPause(value) {
        return value ? '暂停' : '播放'
      }
    }
  }
</script>

<style>

</style>
