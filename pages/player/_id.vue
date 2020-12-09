<template>
  <div>
    <link rel="stylesheet" href="https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css" >

    <script charset="utf-8" src="https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js"/>
    <!-- 阿里云视频播放器组件 -->
    <script charset="utf-8" src="https://player.alicdn.com/aliplayer/presentation/js/aliplayercomponents.min.js"/>

    
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="11">
        <!-- 播放器 -->
        <div id="J_prismPlayer" class="prism-player"/>
      </el-col>
      <el-col :span="5">
        视频列表
      </el-col>
    </el-row>
  </div>
</template>

<script>
import courseApi from '@/api/course'

export default {

  async asyncData(page) {
    // 得到视频id
    const vid = page.route.params.id
    // console.log("vid:"+vid)
    // 根据视频id获取播放凭证
    const response = await courseApi.getPlayAuth(vid)
    // console.log("videoPlayAuth:" + response.data.videoPlayAuth )
    return {
      vid: vid,
      playauth: response.data.videoPlayAuth
    }
  },

  // 页面渲染之后执行
  mounted() {
    /* eslint-disable no-undef */
    new Aliplayer({
      id: 'J_prismPlayer',
      width: '900px',
      height: '540px',
      vid: this.vid,
      playauth: this.playauth,
      encryptType: 1 // 当播放私有加密流时需要设置。

    }, function(player) {
      console.log('播放器创建好了。')
    })
  }
}
</script>
