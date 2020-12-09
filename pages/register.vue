<template>
  <div class="main">
    <div class="title">
      <a href="/login">登录</a>
      <span>·</span>
      <a class="active" href="/register">注册</a>
    </div>

    <div class="sign-up-container">
      <form action="register">
        <div class="input-prepend restyle">
          <input
            v-model="member.nickName"
            type="text"
            placeholder="你的昵称">
          <i class="iconfont icon-user"/>
        </div>
        <div class="input-prepend restyle no-radius">
          <input
            v-model="member.account"
            type="text"
            placeholder="手机号/邮箱">
          <i class="iconfont icon-phone"/>
        </div>
        <div class="input-prepend restyle no-radius" style="position:relative">
          <input
            v-model="member.code"
            type="text"
            placeholder="验证码">
          <i class="iconfont icon-yanzhengma"/>
          <a
            href="javascript:"
            type="button"
            style="position:absolute;right: 10px;top: 15px;"
            @click="getCodeFun()">{{ codeText }}</a>
        </div>
        <div class="input-prepend">
          <input
            v-model="member.password"
            type="password"
            placeholder="设置密码">
          <i class="iconfont icon-password"/>
        </div>
        <div class="btn">
          <input
            type="button"
            class="sign-up-button"
            value="注册"
            @click="submitRegister()">
        </div>
        <p class="sign-up-msg">
          点击 “注册” 即表示您同意并愿意遵守简书
          <br>
          <a target="_blank" href="#">用户协议</a>
          和
          <a target="_blank" href="#">隐私政策</a> 。
        </p>
      </form>
      <!-- 更多注册方式 -->
      <!-- <div class="more-sign">
        <h6>社交帐号直接注册</h6>
        <ul>
          <li><a id="weixin" class="weixin" href="http://localhost:8150/api/ucenter/wx/login"><i class="iconfont icon-weixin"/></a></li>
          <li><a id="qq" class="qq" target="_blank" href="#"><i class="iconfont icon-qq"/></a></li>
        </ul>
      </div> -->
    </div>
  </div>
</template>

<script>
import '@/assets/css/sign.css'
import '@/assets/css/iconfont.css'
import registerApi from '@/api/register'

var regBox = {
        regEmail : /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,   //....邮箱
        regName : /^[a-z0-9_-]{3,16}$/,                       //....用户名
        regMobile : /^0?1[3|4|5|8][0-9]\d{8}$/,                 //....手机
    }

export default {
  layout: 'sign',
  data() {
    return {
      member: {
        account: '',
        code: '',
        nickName: '',
        password: ''
      },
      sending: false, // 是否发送验证码
      second: 60, // 倒计时间
      codeText: '获取验证码'
    }
  },
  methods: {
    // 获取验证码
    getCodeFun() {
      // 判断是否已经获取验证法，
      if (this.sending) {
         this.$notify({
          title: '通知',
          message: '请勿重复获取验证码',
          type: 'warning'
        });
        return
      }
      // TODO 数据校验
      // 是邮箱注册还是手机号注册
      if (regBox.regEmail.test(this.member.account)) {
        this.$notify({
              title: '成功',
              message: '正在发送，请稍等',
              type: 'success'
            });
            this.timeDown()
        registerApi.sendMailMessage(this.member.account).then(response => {

          this.sending = true
          if (response.success) {
            this.$notify({
              title: '成功',
              message: response.message,
              type: 'success'
            });
            
          } 
        })
      } else if (regBox.regMobile.test(this.member.account)) {
        registerApi.sendPhoneMessage(this.member.account).then(response => {
          this.sending = true
          if (response.success) {
            // 开始倒计时，提示用户短息发送成功
            this.$notify({
              title: '成功',
              message: response.message,
              type: 'success'
            });
            this.timeDown()
          } 
        })
      }


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
    },

    // 注册
    submitRegister() {
      registerApi.register(this.member).then(response => {
        if (response.success) {
          this.$notify({
            title: '成功',
            message: response.message,
            type: 'success'
          });
          this.$router.push({path: 'login'})
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
    }
  }
}
</script>
