<template>
  <div id="farmdetail">
    <mt-header fixed title="修改密码">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <tab :line-width="2" bar-active-color="#ef6213" active-color="#ef6213" :scroll-threshold="5">
        <tab-item selected @on-item-click="editIndex=0">登录密码</tab-item>
        <tab-item @on-item-click="editIndex=1">交易密码</tab-item>
      </tab>
      <div v-if="editIndex==0" class="rech_con">
        <div class="rech_list">
          <span>原登录密码：</span>
          <input type="password" v-model="old_password" placeholder="请输入原登录密码" />
        </div>
        <div class="rech_list">
          <span>新登录密码：</span>
          <input type="password" v-model="password" placeholder="请输入至少6位数字和字母组合" />
        </div>
        <div class="rech_list">
          <span>确认新密码：</span>
          <input type="password" v-model="repassword" placeholder="请再次输入新的登录密码" />
        </div>
        <mt-button type="default" @click="setDealPass">确认</mt-button>
      </div>
      <div v-if="editIndex==1" class="rech_con">
        <div class="rech_list">
          <span>原交易密码：</span>
          <input type="password" v-model="old_password" placeholder="请输入原交易密码" />
        </div>
        <div class="rech_list">
          <span>新交易密码：</span>
          <input type="password" v-model="password" placeholder="请输入至少6位数字和字母组合" />
        </div>
        <div class="rech_list">
          <span>确认新密码：</span>
          <input type="password" v-model="repassword" placeholder="请再次输入新的交易密码" />
        </div>
        <mt-button type="default" @click="setDealPass">确认</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast } from "mint-ui";
import { Tab, TabItem } from "vux";
export default {
  components: {
    Indicator,
    Toast,
    Tab,
    TabItem
  },
  data() {
    return {
      old_password: "", //原密码
      password: "", //新密码
      repassword: "", //确认密码
      type: "", //类型
      editIndex: 0
    };
  },
  mounted: function() {
    let that = this;
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },

    //修改密码
    setDealPass() {
      let that = this;
      // that.type=1 =>登录密码 ,that.type=2 =>交易密码
      that.type = that.editIndex == 0 ? 1 : 2;
      if (!that.old_password || that.old_password == null) {
        Toast("请输入原密码");
      } else if (!that.password || that.password == null) {
        Toast("请输入新密码");
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(that.password)) {
        Toast("密码输入错误");
      } else if (that.password !== that.repassword) {
        Toast("两次输入的不一样");
      } else {
        Indicator.open({
          text: "提交中..."
        });
        that
          .$http({
            url: "Personal/editPwd",
            method: "post",
            data: {
              token: localStorage.getItem("token"),
              old_password: that.old_password,
              password: that.password,
              repassword: that.repassword,
              type: that.type
            }
          })
          .then(function(res) {
            if (res.data.code == 0) {
              //成功回调
              Toast(res.data.msg);
              that.$router.go(-1);
            } else {
              //失败
              Toast(res.data.msg);
            }
            Indicator.close();
          })
          .catch(function(error) {
            Indicator.close();
            Toast({
              message: "网络连接失败",
              position: "bottom",
              duration: 5000
            });
          });
      }
    }
  }
};
</script>

<style scoped="scoped">
#farmdetail {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.con-wrapper {
  position: fixed;
  width: 100%;
  height: calc(100% - .8rem);
  overflow-x: hidden;
  overflow-y: scroll;
  top: .8rem;
}

.rech_con {
  width: 100%;
  padding: 0 0.2rem;
}
.rech_con .rech_list {
  display: flex;
  align-items: center;
  padding-top: 0.2rem;
}
.rech_con .rech_list span {
  width: 26%;
  color: #333;
  font-size: 0.28rem;
}
.rech_con .rech_list input {
  flex: 1;
  height: 0.7rem;
  border: 1px solid #c8c8c8;
  border-radius: 0.1rem;
  padding-left: 0.1rem;
}
.rech_con .mint-button {
  position: relative;
  width: 6rem;
  left: 50%;
  margin-left: -3rem;
  font-size: 0.3rem;
  height: 0.8rem;
  color: #fff;
  margin-top: 0.3rem;
  border-radius: 0.2rem;
  background: #ef6213;
}
</style>
