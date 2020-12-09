<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- 课程详情 开始 -->
    <section class="container">

      <!-- 课程所属分类 开始 -->
      <section class="path-wrap txtOf hLh30">
        <a href="/" title class="c-999 fsize14">首页</a>
        \
        <a href="/course" title class="c-999 fsize14">课程列表</a>
        \
        <a :href="'/course?subjectParentId='+course.subjectLevelOneId" class="c-333 fsize14">{{ course.subjectLevelOne }}</a>
        \
        <a :href="'/course?subjectParentId='+course.subjectLevelOneId+'&subjectId='+course.subjectLevelTwoId" class="c-333 fsize14">{{ course.subjectLevelTwo }}</a>
      </section>
      <!-- /课程所属分类 结束 -->

      <!-- 课程基本信息 开始 -->
      <div>
        <article class="c-v-pic-wrap" style="height: 357px;">
          <section id="videoPlay" class="p-h-video-box">
            <img :src="course.cover" :alt="course.title" style="height: 360px;width:630px;" class="dis c-v-pic">
          </section>
        </article>
        <aside class="c-attr-wrap">
          <section class="ml20 mr15">
            <h2 class="hLh30 txtOf mt15">
              <span class="c-fff fsize24">{{ course.title }}</span>
            </h2>
            <section class="c-attr-jg">
              <span class="c-fff">价格：</span>
              <b class="c-yellow" style="font-size:24px;">￥{{ course.price }}</b>
            </section>
            <section class="c-attr-mt c-attr-undis">
              <span class="c-fff fsize14">主讲： {{ course.teacherName }}&nbsp;&nbsp;&nbsp;</span>
            </section>
            <section class="c-attr-mt of">
              <span class="ml10 vam" v-if="isCollect === false">
                <!-- <em class="icon18 scIcon"/> -->
                <i class="el-icon-star-off" style="font-size: 20px;color: white;"></i>
                <a class="c-fff vam" title="收藏" href="javascript:void(0);" @click="addAndCancelCollet($route.params.id)" >收藏</a>
              </span>
              <span class="ml10 vam" v-if="isCollect === true">
                <i class="el-icon-star-on" style="font-size: 20px;color: white;"></i>
                <a class="c-fff vam" title="已收藏" href="javascript:void(0);" @click="addAndCancelCollet($route.params.id)" >已收藏</a>
              </span>
            </section>
            <section v-if="isBuy || course.price === 0" class="c-attr-mt">
              <a href="#" 
              title="立即观看" 
              class="comm-btn c-btn-3"
              >立即观看</a>
            </section>

            <section v-if="!isBuy && course.price !== 0" class="c-attr-mt">
              <a href="javascript:void(0);" 
              title="立即购买" 
              class="comm-btn c-btn-3"
              @click="createOrder()"
              >立即购买</a>
            </section>
          </section>
        </aside>
        <aside class="thr-attr-box">
          <ol class="thr-attr-ol">
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">购买数</span>
                <br>
                <h6 class="c-fff f-fM mt10">{{ course.buyCount }}</h6>
              </aside>
            </li>
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">课时数</span>
                <br>
                <h6 class="c-fff f-fM mt10">{{ course.lessonNum }}</h6>
              </aside>
            </li>
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">浏览数</span>
                <br>
                <h6 class="c-fff f-fM mt10">{{ course.viewCount }}</h6>
              </aside>
            </li>
          </ol>
        </aside>
        <div class="clear"/>
      </div>
      <!-- /课程基本信息 结束 -->

      <div class="mt20 c-infor-box">
        <article class="fl col-7">
          <section class="mr30">
            <div class="i-box">
              <div>
                <section id="c-i-tabTitle" class="c-infor-tabTitle c-tab-title">
                  <a name="c-i" class="current" title="课程详情">课程详情</a>
                </section>
              </div>
              <article class="ml10 mr10 pt20">

                <!-- 课程详情介绍 开始 -->
                <div>
                  <h6 class="c-i-content c-infor-title">
                    <span>课程介绍</span>
                  </h6>
                  <div class="course-txt-body-wrap">
                    <section class="course-txt-body" v-html="course.description">
                      <!-- 将内容中的html翻译过来 -->
                      <!-- {{ course.description }} -->
                    </section>
                  </div>
                </div>
                <!-- /课程详情介绍 结束 -->

                <!-- 课程大纲 开始-->
                <div class="mt50">
                  <h6 class="c-g-content c-infor-title">
                    <span>课程大纲</span>
                  </h6>
                  <section class="mt20">
                    <div class="lh-menu-wrap">
                      <menu id="lh-menu" class="lh-menu mt10 mr10">
                        <!-- 课程章节目录【课程收费时】 -->
                        <ul v-if="Number(course.price) !== 0">
                          <li v-for="chapter in chapterList" :key="chapter.id" class="lh-menu-stair">
                            <a title="chapter.title" href="javascript: void(0)" class="current-1">
                              {{ chapter.title }}
                            </a>
                            <ol class="lh-menu-ol" style="display: block;">
                              <li v-for="video in chapter.children" :key="video.id" class="lh-menu-second ml30">
                                <!-- 如果是免费的,则显示播放地址，否则不显示不放地址 -->
                                <a v-if=" video.free === true" 
                                :href="'/player/' + video.videoSourceId"
                                :title="video.title" target="_blank" >
                                  <span class="fr">
                                    <i class="free-icon vam mr10">免费试听</i>
                                  </span>
                                  <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{video.title}}
                                </a>
                                <!-- 如果购买 则直接去学习 -->
                                <a v-else-if="video.free !== true && isBuy" 
                                 :href="'/player/'+video.videoSourceId" 
                                 :title="video.title" target="_blank">
                                  <span class="fr">
                                    <i class="free-icon vam mr10">开始学习</i>
                                  </span>
                                  <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.title }}
                                </a>
                                <a v-else-if="!isBuy"
                                 :title="video.title" target="_blank">
                                  <span class="fr">
                                    <i class="free-icon vam mr10">请购买课程</i>
                                  </span>
                                  <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.title }}
                                </a>

                              </li>
                            </ol>
                          </li>
                        </ul>

                        <!-- 课程章节目录【课程免费时】 -->
                        <ul v-if="Number(course.price) === 0">
                          <li v-for="chapter in chapterList" :key="chapter.id" class="lh-menu-stair">
                            <a title="chapter.title" href="javascript: void(0)" class="current-1">
                              {{ chapter.title }}
                            </a>
                            <ol class="lh-menu-ol" style="display: block;">
                              <li v-for="video in chapter.children" :key="video.id" class="lh-menu-second ml30">

                                <a  :href="'/player/' + video.videoSourceId"
                                    :title="video.title" target="_blank" >
                                  <span class="fr">
                                    <i class="free-icon vam mr10">开始学习</i>
                                  </span>
                                  <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{video.title}}
                                </a>
                              </li>
                            </ol>
                          </li>
                        </ul>

                      </menu>
                    </div>
                  </section>
                  <!-- /课程大纲 结束 -->
              </div></article>
            </div>
          </section>
        </article>
        <aside class="fl col-3">
          <div class="i-box">
            <!-- 主讲讲师 开始-->
            <div>
              <section class="c-infor-tabTitle c-tab-title">
                <a title href="javascript:void(0)">主讲讲师</a>
              </section>
              <section class="stud-act-list">
                <ul style="height: auto;">
                  <li>
                    <div class="u-face">
                      <a :href="'/teacher/'+course.teacherId" target="_blank">
                        <img :src="course.avatar" width="50" height="50" alt>
                      </a>
                    </div>
                    <section class="hLh30 txtOf">
                      <a :href="'/teacher/'+course.teacherId" class="c-333 fsize16 fl" target="_blank">{{ course.teacherName }}</a>
                    </section>
                    <section class="hLh20 txtOf">
                      <span class="c-999">{{ course.intro }}</span>
                    </section>
                  </li>
                </ul>
              </section>
            </div>
            <!-- /主讲讲师 结束 -->
          </div>
        </aside>
        <div class="clear"/>
      </div>
    </section>
    <!-- /课程详情 结束 -->
  </div>
</template>

<script>
import courseApi from '@/api/course'
import orderApi from '@/api/order'
import collectApi from '@/api/courseCollect'
import cookie from 'js-cookie'

export default {

  async asyncData(page) {
    const response = await courseApi.getById(page.route.params.id)
    return {
      course: response.data.course,
      chapterList: response.data.chapterList
    }
  },

  data() {
    return {
      isBuy: false, // 是否购买
      isCollect: false, // 是否收藏
    }
  },

  created() {
    let token = cookie.get('Yuxiang-edu-token')
    if (token) {
      orderApi.isBuy(this.course.id).then(response => {
        this.isBuy = response.data.isBuy
      })
      collectApi.isCollect(this.course.id).then(response => {
        this.isCollect = response.data.isCollect
      })
    }

  },

  methods: {
    createOrder() {
      orderApi.createOrder(this.course.id).then(response => {
        // 跳转到订单预览页面
        this.$router.push({path: '/order/' + response.data.orderId})
      })
    },
    // 收藏该课程
    addAndCancelCollet(id) {
      if (this.isCollect) {
        collectApi.cancelCollect(id).then(res => {
          this.$notify({
            title: '通知',
            message: res.message,
            type: 'success'
          })
          this.isCollect = false
        })
      } else {
        collectApi.addCollect(id).then(res => {
          this.$notify({
            title: '通知',
            message: res.message,
            type: 'success'
          })
          this.isCollect = true
        })
      }
      
    }
  }
}
</script>

<style>
.course-txt-body ol, .course-txt-body ul{
    padding-left: 40px;
    margin: 16px 0;
}
.course-txt-body ol li{
    list-style: decimal;
}
.course-txt-body ul li{
    list-style: disc;
}
</style>

