<template>
  <div class="main">
    <div class="title">
      <a class="active" href="/login">验证码登录</a>
      <span>·</span>
      <a href="/login">密码登录</a>
    </div>

    <div class="sign-up-container">
      <form action="login">
        <div class="input-prepend restyle">
          <input
            v-model="member.account"
            type="text"
            placeholder="手机号">
          <i class="iconfont icon-phone"/>
        </div>
        <div class="input-prepend" style="position:relative">
          <input
            v-model="member.password"
            type="text"
            placeholder="验证码">
          <i class="iconfont icon-yanzhengma"/>
          <a
            href="javascript:"
            type="button"
            style="position:absolute;right: 10px;top: 15px;"
            @click="getCodeFunc()">{{ codeText }}</a>
        </div>
        <div class="btn">
          <input
            type="button"
            class="sign-in-button"
            value="登录"
            @click="submitLogin()">
        </div>
        <!-- 更多登录方式 -->
        <div class="more-sign">
          <h6>社交帐号登录</h6>
          <ul>
            <li><a id="weixin" class="weixin" target="_blank" href="http://localhost:8015/api/ucenter/wx/login"><i class="iconfont icon-weixin"/></a></li>
            <li><a id="qq" class="qq" target="_blank" href="http://localhost:8015/ucenter/wb/login"><i class="iconfont icon-weibo"/></a></li>
          </ul>
        </div>
      </form>
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
      },
      sending: false, // 是否发送验证码
      second: 60, // 倒计时间
      codeText: '获取验证码'
    }
  },

  methods: {
    // 登录
    submitLogin() {
      loginApi.phoneCodeLogin(this.member).then(response => {

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
      }).catch(err => {
        this.$notify({
          title: '错误',
          message: err.message,
          type: 'error'
        });
      })
    },
    // 发送手机登录验证码
    getCodeFunc() {
      // 判断是否已经获取验证法，
      if (this.sending) {
         this.$notify({
          title: '通知',
          message: '请勿重复获取验证码',
          type: 'warning'
        });
        return
      }
      // 发送验证码
      loginApi.sendPhoneLoginMessage(this.member.account).then(res => {
          this.sending = true
          if (res.success) {
            // 开始倒计时，提示用户短息发送成功
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success'
            });
            this.timeDown()
          } 
      }).catch(err => {
        this.$notify({
          title: '错误',
          message: err.message,
          type: 'error'
        });
      })

    },
    // 倒计时
    timeDown() {
      this.codeText = this.second
      const codeInterval = setInterval(() => {
        this.codeText -= 1
        if (this.codeText <= 0) {
          this.codeText = '获取验证码'
          clearInterval(codeInterval)
          this.sending = false
          this.second = 60
        }
      }, 1000)
    }
  
  }
}
</script>