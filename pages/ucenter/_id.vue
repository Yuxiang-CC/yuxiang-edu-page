<template>
    <article class="col-7 fl">
    <div class="u-r-cont">
      <section>
        <div>
          <section class="c-infor-tabTitle c-tab-title">
            <a href="javascript: void(0)" title="个人资料" class="current">
              个人资料
            </a>
          </section>
        </div>
        <div class="mt40">
          ID：<span>{{memberInfo.id}}</span> <br/>
          昵称：<span>{{memberInfo.nickname}}</span> <br/>
          手机：<span>{{memberInfo.mobile}}</span><br/>
          邮箱：<span>{{memberInfo.mail}}</span><br/>
          年龄：<span>{{memberInfo.age}}</span><br/>
          性别：<span>{{memberInfo.sex}}</span><br/>
        </div>
      </section>
    </div>
  </article>
</template>

<script>
import memberApi from '@/api/member'
import cookie from 'js-cookie'
export default {
  data() {
    return {
      memberInfo: {}
    }
  },
  created() {
  },
    methods: {
      fetchMemberInfo() {
        memberApi.getMemberInfo().then(res => {
          console.log(res.data.info)
          this.memberInfo = res.data.info
        })
      }
    },
    mounted() {
        if (cookie.get('Yuxiang-edu-token')) {
            this.fetchMemberInfo();
        } else {
            this.$router.push({path:`/login`})
        }
    }

}
</script>

<style>

</style>