<template>

  <div>
    <meta charset="utf-8">
<meta http-equiv="x-ua-compatible" content="IE=edge" >
<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"/>

<link rel="stylesheet" href="https://g.alicdn.com/de/prismplayer/2.9.1/skins/default/aliplayer-min.css" />
<script type="text/javascript" charset="utf-8" src="https://g.alicdn.com/de/prismplayer/2.9.1/aliplayer-min.js"></script>

    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="16">
        <!-- 播放器 -->
        <div id="J_prismLivePlayer" class="prism-player" />
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="5">
        <div>
          {{ teacher.name }}&nbsp;|&nbsp;
          {{ teacher.level == 1 ? "高级讲师" : "首席讲师" }}
        </div>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">聊天室</el-menu-item>
          <el-menu-item index="2">成员</el-menu-item>
        </el-menu>

        <div v-if="activeIndex == '1'">
          <div id="live-chat-content" style="height: 420px; overflow-y:auto;">
            <!-- <div class="live-char-message">
              <el-avatar size="small"> user </el-avatar>:
              <span style="font-size: 14px;">消息内容</span>
            </div> -->
          </div>
          <div id="live-char-send">
            <el-input
              type="textarea"
              :rows="3"
              :placeholder="sendPrompt"
              maxlength="30"
              style="resize: none;"
              v-model="content">
            </el-input>
            <el-button type="primary" size="small" plain :disabled="content == '' || content.length == 0" @click="send0">发送</el-button>
            <el-button type="primary" size="small" plain :disabled="isConnection == false"  @click="close">关闭聊天</el-button>
            <el-button type="primary" size="small" plain :disabled="isConnection == true"  @click="open">加入聊天</el-button>
          </div>
        </div>
        <div v-if="activeIndex == '2'">
          <div id="live-char-members" v-if="liveMembers.length > 0" >
            <div class="live-char-message" v-for="(item, index) in liveMembers" :key="index">
              <el-avatar size="small" :src="item.avatar"></el-avatar>:&nbsp;&nbsp;
              <span style="font-size: 14px;">{{item.name}}</span>
            </div>
          </div>
          <div v-if="liveMembers == null || liveMembers.length <= 0">
            获取失败
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
var chatApp = {
  /**
   * 和后端枚举对应
   */
  CONNECT: 1, //"第一次（或重连）初始化连接"),
  CHAT: 2, //"聊天消息"),
  KEEPALIVE: 3, //"客户端保持心跳");
  QUIT:4, //"退出直播间");

  /**
   * @param {Object} member 用户信息
   * @param {Object} liveId 直播间ID
   * @param {Object} message 消息
   */
  ChatMsg: function (member, liveId, msg) {
    this.memberId = member.id;
    this.name = member.nickname;
    this.avatar = member.avatar;
    this.liveId = liveId;
    this.message = msg;
  },

  /**
   * @param {Object} action 动作类型
   * @param {Object} chatMsg 消息
   * @param {Object} extend 扩展扩展字段
   */
  DataConent: function (action, chatMsg, extend) {
    this.action = action;
    this.chatMessage = chatMsg;
    this.extend = extend;
  },
};
import liveApi from "@/api/live";
import teacherApi from "@/api/teacher";
import memberApi from '@/api/member'
import cookie from 'js-cookie';
export default {
  async asyncData(page) {
    const response = await liveApi.getLiveInfo(page.route.params.id);
    return {
      pullUrl: response.data.pullUrl,
    };
  },
  data() {
    return {
      activeIndex: "1",
      teacher: {
        "id": "123",
        "name": "张三丰",
      },
      path: "ws://localhost:8888/websocket",
      socket: {},
      sendPrompt: "正在连接聊天室...",
      memberInfo: {
        // "id": "1330872970285015042",
        // "nickname": "任金博",
        // "avatar": "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
      },
      content: "",
      liveId: "20184141090",
      liveMembers: [],
      isConnection: false,
    };
  },
  watch: {
    activeIndex: {
      handler(newValue, oldValue) {
        if (newValue == '2') {
          // 获取直播间成员信息
          liveApi.getLiveMembersInfo(this.liveId).then(res => {
            this.liveMembers = res.data.items
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    // 初始化直播聊天室
    init() {
      if (typeof WebSocket === "undefined") {
        this.sendPrompt = "您的浏览器不支持聊天，请更换浏览器！";
      } else {
        // 用户登录之后才能连接聊天室
        if (cookie.get('Yuxiang-edu-token')) {
          // 实例化socket
          this.socket = new WebSocket(this.path);
          // 监听socket连接
          this.socket.onopen = this.open;
          // 监听socket错误信息
          this.socket.onerror = this.error;
          // 监听socket消息
          this.socket.onmessage = this.getMessage;

          this.sendPrompt = "发送消息";
        }
        
      }
    },
    // 连接聊天室
    open() {
      
      // 构建ChatMsg对象
      var chatMsg = new chatApp.ChatMsg(this.memberInfo, this.liveId, null);

      // 构建 DataContent
      var dataContent = new chatApp.DataConent(chatApp.CONNECT, chatMsg, null);

      console.log("open:  ", dataContent)
      // 发送那个websocket
      this.send(JSON.stringify(dataContent));

      this.sendPrompt = '进入直播间3秒后即可发言！'
      
      setTimeout(() => {
        this.sendPrompt = "发送消息";
        this.isConnection = true;
      }, 1000 * 3);
      
      // 定时发送心跳包
      setInterval(() => {
        this.keepalive();
      }, 1000 * 10);

    },
    // 监听消息
    getMessage(e) {
      console.log("getMessage：" + e.data);
      // 转化为一个ChatMsg对象
      let chatMsg = JSON.parse(e.data);
      // TODO 渲染到界面上
        
      let i = document.createElement("img")
      i.setAttribute("alt", chatMsg.name)
      i.setAttribute("src", chatMsg.avatar)
      i.style.objectFit = 'cover';

      let s = document.createElement("span")
      // el-avatar el-avatar--medium el-avatar--circle
      // el-avatar el-avatar--small el-avatar--circle[square]
      s.setAttribute("class", "el-avatar el-avatar--small el-avatar--circle")
      s.appendChild(i);

      let ss = document.createElement("span")
      ss.style.fontSize = '14px';
      ss.innerHTML = chatMsg.message

      let d = document.createElement("div")
      d.setAttribute("class", "live-char-message")
      d.appendChild(s)
      d.innerHTML = d.innerHTML + "："
      d.appendChild(ss)
      //  `<div class="live-char-message">
      //    <el-avatar size="small">${chatMsg.name}</el-avatar>
      //    <span style="font-size: 14px;">${chatMsg.message}</span>
      //   </div>`

      var messagePance = document.getElementById("live-chat-content")
      // 调整视图位置
      // 判断当前滚动条是否在最低,是的话则从新调整视图
      if (this.isInLow()) {
        messagePance.appendChild(d);
        this.toLow()
      }
      messagePance.appendChild(d);
      
      
    },
    // 按钮发送
    send0() {
      // 获取用户输入的信息
      // 组装聊天信息
      // 构建ChatMsg对象
      var chatMsg = new chatApp.ChatMsg(this.memberInfo, this.liveId, this.content);
      // 构建 DataContent
      var dataContent = new chatApp.DataConent(chatApp.CHAT, chatMsg, null);
      console.log("sengMessage: ", dataContent)
      this.content = '';
      // 发送那个websocket
      this.send(JSON.stringify(dataContent));

    },
    // 发送消息
    send(msg) {
      // 如果当前的状态已经连接，就不需要重复初始化websocket 否则重连
      if (
        this.socket != null &&
        this.socket != undefined &&
        this.socket.readyState == WebSocket.OPEN
      ) {
        this.socket.send(msg);
      } else {
        // 重新连接websocket
        // this.sendPrompt("无法连接服务器...")
        this.init();
        // 延时重新发送
        setTimeout(function () {
          this.reChat(msg);
        }, 1000);
      }
    },
    // 心跳包
    keepalive() {
      var dataContent = new chatApp.DataConent(chatApp.KEEPALIVE, null, null);
      // 发送心跳
      this.send(JSON.stringify(dataContent));
    },
    // 消息重新发送
    reChat(msg) {
      this.socket.send(msg);
    },
    // 连接失败
    error() {
      this.sendPrompt = "连接失败..."
    },
    // 聊天室关闭
    close() {
      this.sendPrompt = "聊天室已断开连接...";
      this.isConnection = false;
       // 构建ChatMsg对象
      var chatMsg = new chatApp.ChatMsg(this.memberInfo, this.liveId, null);
      
      // 构建 DataContent
      var dataContent = new chatApp.DataConent(chatApp.QUIT, chatMsg, null);
      // 发送那个websocket
      this.socket.send(JSON.stringify(dataContent));

    },
    // 到直播聊天室最低
    toLow() {
      var ele = document.getElementById('live-chat-content');
      ele.scrollTop = ele.scrollHeight;
    },
    // 当前滚动条是否在最下面
    isInLow() {
      var ele = document.getElementById('live-chat-content');
        var s = Math.ceil(ele.scrollTop)
        var s1 = Math.floor(ele.scrollTop)
        if (420 + s == ele.scrollHeight || 420 + s1 == ele.scrollHeight) {
            return true
        } else {
            return false
        }
    },
    // 聊天室去直播间成员面板切换
    handleSelect(key, keyPath) {
      this.activeIndex = key;
    },
    // 获取讲师信息
    fetchTeacherInfo(teacherId) {
      if (teacherId) {
        teacherApi.getSimpleById(teacherId).then((res) => {
          this.teacher = res.data.teacher;
        });
      }
    },
    fetchMemberInfo() {
      memberApi.getMemberInfo().then(res => {
        this.memberInfo = res.data.info
      })
    }
  },
  // 页面渲染之后执行
  mounted() {
    /* eslint-disable no-undef */
    new Aliplayer(
      {
        id: "J_prismLivePlayer",
        width: "100%",
        height: "550px",
        source: this.pullUrl[0],
        // "vid": this.vid,
        // "playauth": this.playauth,
        // "encryptType": 1, // 当播放私有加密流时需要设置。
        autoplay: true,
        isLive: true,
        rePlay: false,
        playsinline: true,
        preload: true,
        controlBarVisibility: "hover",
        useH5Prism: true,
      },
      function (player) {
        console.log("播放器创建好了。");
      }
    );

    this.liveId = this.$route.params.id
    // this.fetchTeacherInfo(this.$route.params.id);
    this.fetchMemberInfo();

    // 创建聊天室
    this.init();
  },
  destroyed() {
    // TODO 关闭网页时无法移除客户信息
    this.close();
    this.socket.onclose = this.close;
  },
};
</script>

<style>
.live-char-message {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin: 2px 5px;
}
.live-char-message span {
  margin: 0px 0px 0px 5px;
  font-size: 14px;
}
</style>