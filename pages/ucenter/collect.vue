<template>
  <article class="col-7 fl">
    <div class="u-r-cont">
      <section>
        <div>
          <section class="c-infor-tabTitle c-tab-title">

            <a href="javascript: void(0)" title="我的收藏" class="current">
              收藏列表
            </a>
          </section>
        </div>
        <div class="mt40">
          <section v-if="collectList == null || collectList.length === 0" class="no-data-wrap">
            <em class="icon30 no-data-ico">&nbsp;</em>
            <span class="c-666 fsize14 ml10 vam">您还没有收藏课程哦！</span>
          </section>

          <!-- 表格 -->
          <el-table
            v-if="collectList != null && collectList.length > 0"
            :data="collectList"
            border
            fit
            highlight-current-row>

            <el-table-column label="课程信息" align="center" >
              <template slot-scope="scope">
                <div class="info" >
                  <div class="pic">
                    <img :src="scope.row.cover" alt="scope.row.title" width="100px">
                  </div>
                  <div class="title">
                    <a :href="'/course/'+scope.row.id">{{ scope.row.title }}</a>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="讲师名称" align="center">
              <template slot-scope="scope">
                {{ scope.row.teacherName }}
              </template>
            </el-table-column>
            <el-table-column label="价格" width="100" align="center">
              <template slot-scope="scope">
                {{ scope.row.price }}
              </template>
            </el-table-column>
            <el-table-column label="收藏时间" align="center">
              <template slot-scope="scope">
                {{ scope.row.gmtCreate }}
              </template>
            </el-table-column>

            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <!-- <a  title="取消收藏" @click="removeCollect(scope.row.id)"></a> -->
                <el-link href="javascript:void(0);" icon="el-icon-circle-close" type="danger" @click="removeCollect(scope.row.id)">取消收藏</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
    </div>
  </article>
</template>

<script>
import collectApi from '@/api/courseCollect'
export default {
  data() {
    return {
      collectList: []
    }
  },
  created() {
    
  },
  methods: {
    fetchCourseCollectList() {
      collectApi.getCollectList().then(res => {
        // console.log(res.data.items)
        this.collectList = res.data.items
      })
    },
    // 取消收藏
    removeCollect(courseId) {
      this.$confirm('确认要取消收藏吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return collectApi.cancelCollect(courseId)
      }).then(res => {
        this.$notify({
          title: '通知',
          message: res.data.message,
          type: 'success'
        })
      }).catch(err => {
        this.$notify({
          title: '通知',
          message: err.data.message,
          type: 'error'
        })
      })
    }
    
  },
  mounted(){
    this.fetchCourseCollectList();
  }
  }
</script>

<style>

</style>