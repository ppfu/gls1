<template>
  <div class="login">
    <mt-header fixed title="登录">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="logo">
      <img src="../assets/img/logo.jpg" />
    </div>
    <div class="login_con">
      <div class="login_info" v-clickoutside="handleCloseUser">
        <span class="iconfont icon-tabwode"></span>
        <input
          v-model="account"
          type="text"
          @blur="handleCloseUser"
          name="account"
          placeholder="请输入手机号"
        />
        <svg
          t="1563612342259"
          class="icon choose"
          :class="{choose_active: userShow == true}"
          @click="userListFun"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="3998"
          width="200"
          height="200"
        >
          <path
            d="M512.289 671.589l39.51799999-39.518 230.69200001-230.692-0.021-0.021a28.115 28.115 0 0 0 0.851-0.809c10.935-10.935 10.935-28.663 0-39.598-10.935-10.935-28.663-10.935-39.598 0-0.278 0.278-0.545 0.564-0.809 0.85099999l-0.021-0.02099999L512.21 592.472l-231.94-231.94c-10.935-10.935-28.663-10.935-39.598 0s-10.935 28.663 0 39.59799999L512.21 671.668l0.079-0.079z"
            p-id="3999"
            fill="#707070"
          />
        </svg>
        <div class="user_wrap" v-show="userShow">
          <div class="user_list" v-for="item in userList" :key="item.id">
            <p @click="chooseUserFun(item.name)">{{item.name}}</p>
            <svg
              t="1563617995611"
              class="icon close"
              @click="deleteUserFun(item.name)"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4946"
              width="200"
              height="200"
            >
              <path
                d="M512 0a512 512 0 1 0 512 512A512 512 0 0 0 512 0z m225.745455 677.701818a46.545455 46.545455 0 0 1-33.047273 79.127273 46.545455 46.545455 0 0 1-33.047273-13.498182l-165.236364-165.701818L340.712727 744.727273a46.545455 46.545455 0 0 1-33.047272 13.498182 46.545455 46.545455 0 0 1-33.047273-79.127273L440.32 512 274.618182 346.298182A46.545455 46.545455 0 0 1 274.618182 279.272727a46.545455 46.545455 0 0 1 66.094545 0l165.701818 165.701818L671.650909 279.272727a46.545455 46.545455 0 0 1 66.094546 0 46.545455 46.545455 0 0 1 0 65.629091L572.043636 512z"
                fill="#CCCCCC"
                p-id="4947"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="login_info">
        <span class="iconfont icon-tabsuo"></span>
        <input v-model="password" type="password" name="pass" placeholder="请输入登录密码" />
      </div>
      <div class="login_btn">
        <button @click="login">登录</button>
      </div>
      <div class="login_zhuce">
        <div class="zhuce">
          <span>还没有账号？</span>
          <span @click="gotoReg">立即注册</span>
        </div>
        <span @click="gotoFoget">忘记密码</span>
      </div>
    </div>
  </div>
</template>

<script>
const clickoutside = {
  // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener("click", documentHandler);
  },
  update() {},
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener("click", el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  }
};
import { Toast } from "mint-ui";
export default {
  components: {},
  data() {
    return {
      account: "",
      password: "",
      hint: true, // 提示
      userList: [], // 用户列表
      userShow: false // 用户框
    };
  },
  watch: {},
  directives: { clickoutside }, //自定义指令点击空白右键消失
  created() {
    if (localStorage.getItem("userList")) {
      this.userList = JSON.parse(localStorage.getItem("userList"));
    }
  },
  methods: {
    back() {
      if (sessionStorage.getItem("clickExit") == "true") {
        this.$router.push({
          path: "/"
        });
      } else {
        this.$router.go(-1);
      }
    },
    handleCloseUser(e) {
      // 点击空白部分关闭右键
      this.userShow = false;
    },
    userListFun() {
      this.userShow = !this.userShow;
    },
    chooseUserFun(name) {
      this.account = name;
      this.userShow = false;
    },
    deleteUserFun(name) {
      let userStrToArr = JSON.parse(localStorage.getItem("userList")); // 先取出来判断
      let result = userStrToArr.findIndex(item => {
        return name == item.name;
      });
      userStrToArr.splice(result, 1);
      let str = JSON.stringify(userStrToArr);
      this.userList = userStrToArr;
      localStorage.setItem("userList", str);
    },
    //登录
    login() {
      let that = this;
      let account = that.account;
      let password = that.password;
      if (!account || account == null) {
        Toast("请输入手机号码");
      } else if (
        account.trim().length != 11 ||
        !/^1[3|4|5|6|7|8|9]\d{9}$/.test(account)
      ) {
        Toast("手机号格式错误");
      } else if (!password || password == null) {
        Toast("密码不能为空");
      } else {
        that.$http
          .post("Register/userLogin", {
            account: account,
            password: password
          })
          .then(function(res) {
            let code = res.data.code;
            let msg = res.data.msg;
            let data = res.data.data;
            if (code == 0) {
              localStorage.setItem("token", data);
              localStorage.setItem("account", account);
              if (sessionStorage.getItem("clickExit") == "true") {
                that.$router.push({
                  path: "/"
                });
              } else {
                that.$router.go(-1);
              }
              sessionStorage.setItem("clickExit", true);
              let userStr = { name: that.account };
              if (localStorage.getItem("userList")) {
                let userStrToArr = JSON.parse(localStorage.getItem("userList")); // 先取出来判断
                let result = userStrToArr.findIndex(item => {
                  return that.account == item.name;
                });
                if (result != -1) {
                  // 已存在
                  userStrToArr.splice(result, 1);
                  userStrToArr.unshift(userStr);
                  let str = JSON.stringify(userStrToArr);
                  localStorage.setItem("userList", str);
                } else {
                  userStrToArr.unshift(userStr);
                  if (userStrToArr.length >= 10) {
                    userStrToArr.pop();
                  }
                  let str = JSON.stringify(userStrToArr);
                  localStorage.setItem("userList", str);
                }
              } else {
                // 不存在创建
                let userStrToArr = [];
                userStrToArr.unshift(userStr);
                let str = JSON.stringify(userStrToArr);
                localStorage.setItem("userList", str);
              }
              that.userList = JSON.parse(localStorage.getItem("userList"));
              Toast("登录成功");
            } else {
              Toast(msg);
            }
          })
          .catch(function(err) {
            Toast({
              message: "网络连接失败",
              position: "bottom",
              duration: 5000
            });
          });
      }
    },

    gotoFoget() {
      let that = this;
      that.$router.push({
        path: "/fogetpass"
      });
    },
    gotoReg() {
      let that = this;
      that.$router.push({
        path: "/register"
      });
    }
  }
};
</script>

<style scoped="scoped">
.header {
  width: 100%;
  height: 0.8rem;
  background: #ef6213;
  text-align: center;
  line-height: 0.8rem;
  color: #fff;
}
.logo {
  height: 3.4rem;
  width: 150%;
  margin-left: -25%;
  margin-top: 0.8rem;
  background: #ef6213;
  border-radius: 0 0 50% 50%;
  text-align: center;
}
.logo img {
  width: 1.6rem;
  border-radius: 50%;
  margin-top: 0.5rem;
}
.login_con {
  width: 100%;
  padding: 0 0.2rem;
  margin-top: 1rem;
}
.login_info {
  width: 100%;
  height: 0.8rem;
  border: 1px solid #d6d6d6;
  border-radius: 0.1rem;
  line-height: 0.8rem;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  position: relative;
}
.login_info span {
  padding: 0 0.2rem;
  font-size: 0.4rem;
  color: #888;
}
.login_info input {
  flex: 1;
  height: 0.7rem;
  border: none;
}
.choose {
  width: 0.4rem;
  height: 0.4rem;
  padding: 0.2rem;
  box-sizing: unset;
  transition: 0.5s;
  -moz-transition: 0.5s; /* Firefox 4 */
  -webkit-transition: 0.5s; /* Safari and Chrome */
}
.choose_active {
  transform: rotate(180deg);
  -ms-transform: rotate(180deg); /* IE 9 */
  -moz-transform: rotate(180deg); /* Firefox */
  -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
}
.user_wrap {
  position: absolute;
  top: 0.8rem;
  left: 0;
  z-index: 10;
  width: 100%;
  max-height: 4rem;
  overflow-x: hidden;
  overflow-y: scroll;
  background: white;
  border-radius: 0.1rem;
  border: 1px solid #d6d6d6;
}
.user_list {
  width: 100%;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  align-items: center;
  -webkit-align-items: center;
  border-bottom: 1px solid #d6d6d6;
}
.user_list:nth-last-child(1) {
  border-bottom: 0 none;
}
.user_list > p {
  font-size: 0.28rem;
  line-height: 0.28rem;
  margin-left: 0.2rem;
  width: 80%;
}
.close {
  width: 0.4rem;
  height: 0.4rem;
  padding: 0.2rem;
  box-sizing: unset;
}

.login_btn {
  margin: 0 auto;
}
.login_btn button {
  width: 100%;
  height: 0.8rem;
  background: #ef6213;
  border: none;
  color: #fff;
  border-radius: 0.1rem;
}
.login_zhuce {
  margin-top: 0.2rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.26rem;
}
.login_zhuce .zhuce span:nth-child(2) {
  color: #ef6213;
}
</style>
