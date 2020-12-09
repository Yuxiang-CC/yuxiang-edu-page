<template>
  <div class="main">
    <div class="title">
      <a href="/phone-login">验证码</a>
      <span>·</span>
      <a class="active" href="/login">登录</a>
      <span>·</span>
      <a href="/register">注册</a>
    </div>

    <div class="sign-up-container">
      <form action="register">
        <div class="input-prepend restyle">
          <input
            v-model="member.account"
            type="text"
            placeholder="手机号/邮箱">
          <i class="iconfont icon-phone"/>
        </div>
        <div class="input-prepend">
          <input
            v-model="member.password"
            type="password"
            placeholder="密码">
          <i class="iconfont icon-password"/>
        </div>
        <div class="btn">
          <input
            type="button"
            class="sign-in-button"
            value="登录"
            @click="submitLogin()">
        </div>
      </form>
      <!-- 更多登录方式 -->
      <div class="more-sign">
        <h6>社交帐号登录</h6>
        <ul>
          <li><a id="weixin" class="weixin"  href="javascript:void(0);"><i class="iconfont icon-weixin"/></a></li>
          <li><a id="weibo" class="weibo"  href="javascript:void(0);" @click="webiLogin()"><i class="iconfont icon-weibo"/></a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/sign.css'
import '@/assets/css/iconfont.css'
import cookie from 'js-cookie'
import loginApi from '@/api/login'

export default {
  layout: 'sign',

  data() {
    return {
      member: {
        account: '',
        password: ''
      }
    }
  },

  methods: {
    // 登录
    submitLogin() {
     
      loginApi.login(this.member).then(response => {

        if (response.success) {
          // 写入到cookie
          cookie.set('Yuxiang-edu-token', response.data.token, {domain: 'localhost'})
          // 跳转到首页
          window.location.href = "/"
        } else {
          this.$notify({
            title: '失败',
            message: response.message,
            type: 'warning'
          });
        }
      })

    },
    webiLogin() {
      // http://localhost:9999/api/ucenter/member/weibo/login
      loginApi.weiboLogin().then(res => {
        console.log(res.data.url)
        window.location.href = res.data.url
      })
    }
  
  }
}
</script>
