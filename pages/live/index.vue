<template>
  <div>
    <!-- <el-row>
      <el-col :span="18" :offset="3">
        <section class="c-s-dl">
          <dl>
            <dt>
              <span class="c-999 fsize14">类别</span>
            </dt>
            <dd class="c-s-dl-li">
              一级类别 开始
              <ul class="clearfix">
                <li class="current">
                  <a
                    title="全部"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelOne('')">全部</a>
                </li>
                <li
                  class="">
                  <a
                    title="item.title"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelOne()">后端</a>
                </li>
                <li
                  class="">
                  <a
                    title="item.title"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelOne()">前端</a>
                </li>
                <li
                  class="">
                  <a
                    title="item.title"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelOne()">大数据</a>
                </li>
                <li
                  class="">
                  <a
                    title="item.title"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelOne()">人工智能</a>
                </li>
              </ul>
              一级类别 结束
            </dd>
          </dl>
          <dl>
            <dt>
              <span class="c-999 fsize14"/>
            </dt>
            <dd class="c-s-dl-li">
              二级类别 开始
              <ul class="clearfix">
                <li class="current">
                  <a
                    title="全部"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelTwo('')">全部</a>
                </li>
                <li>
                  <a
                    title="Javatitile"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelTwo()">Java</a>
                </li>
                <li>
                  <a
                    title="Javatitile"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelTwo()">python</a>
                </li>
                <li>
                  <a
                    title="Javatitile"
                    href="javascript:void(0);"
                    @click="searchSubjectLevelTwo()">go</a>
                </li>
              </ul>
              二级类别 结束
            </dd>
          </dl>
          <div class="clear"/>
        </section>
      </el-col>
    </el-row> -->
    
    
    <el-row>
      <el-col :span="24" style="text-align: center;" ><h2>/ 直播列表 /</h2></el-col>
      <el-col :span="6" v-for="(live, index) in lives" :key="live.tid" :offset="index == 0 || index % 3 == 0 ? 3: 0">
        <el-card :body-style="{ padding: '0px;', margin: '0px' }" style="padding: 0px;" shadow="hover">
          <img :src="live.cover" class="image">
          <div style="padding: 4px;">
            <span style="font-size: 20px;">{{live.title}}</span>
            <div class="bottom clearfix">
              <time class="time">{{ live.categoryName }}</time>
              <el-button type="primary" round style="float: right;"><a :href="'/live/' + live.tid">点击观看</a></el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <br><br><br><br><br><br>
  </div>
</template>

<script>
import liveApi from '@/api/live.js'
export default {
  data() {
    return {
      lives: []
    }
  },
  created() {
    this.fetchLives(this.$route.query.category)
  }, 
  methods: {
    fetchLives(categoryId = "") {
      liveApi.getLives(categoryId).then(res => {
        this.lives = res.data.lives
      }).catch(err => {
        this.$notify({
          "title": '错误',
          "message": '获取直播间列表错误',
          'type': 'error'
        })
      })
    },
  }
}
</script>

<style>
  h2 {
    font-size: 40px;
    padding: 5px;
    margin: 20px;
  }
  .time {
    font-size: 16px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    height: 240px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>