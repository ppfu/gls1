<template>
  <div id="request">
    <mt-header fixed title="好友请求">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="request_content">
        <div class="request_info">
          <div v-for="item in data" :key="item.id" class="request_list">
            <div class="request_left">
              <img src="../../assets/img/logo.jpg" />
            </div>
            <div class="request_right">
              <div class="per_info">
                <span>{{item.name}}</span>
                <span>{{item.phone}}</span>
              </div>
              <div class="function">
                <span @click="consent(item.id)">同意</span>
                <span @click="refuse(item.id)">拒绝</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="no-data" v-if="data.length == 0">
        <img src="../../assets/img/nodata3.png" />
      </div>
      <div style="height:50px;"></div>
    </div>
  </div>
</template>

<script>
import { Toast, Indicator } from "mint-ui";
export default {
  components: {
    Toast,
    Indicator
  },
  data() {
    return {
      data: [] //好友请求列表
    };
  },
  created: function() {
    this.getFriendRequest(); //获取好友请求列表
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    gotoAddfriend() {
      this.$router.push({
        path: "/addfriend"
      });
    },
    //获取好友请求列表
    getFriendRequest() {
      let that = this;
      that
        .$http({
          url: "farm_friend/applyList",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.data = res.data.data;
          } else {
            Toast(res.data.msg);
          }
        })
        .catch(function(error) {
          Toast({
            message: "网络连接失败",
            position: "bottom",
            duration: 5000
          });
        });
    },
    //同意
    consent(id) {
      let that = this;
      that
        .$http({
          url: "farm_friend/applyActive",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: id,
            type: 1
          }
        })
        .then(function(res) {
          console.log(res);
          var msg = res.data.msg;
          if (res.data.code == 0) {
            Toast("添加成功");
            that.getFriendRequest();
          } else {
            Toast(msg);
          }
        })
        .catch(function(error) {
          Toast({
            message: "网络连接失败",
            position: "bottom",
            duration: 5000
          });
        });
    },
    //拒绝
    refuse(id) {
      let that = this;
      that
        .$http({
          url: "farm_friend/applyActive",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: id,
            type: 2
          }
        })
        .then(function(res) {
          console.log(res);
          var msg = res.data.msg;
          if (res.data.code == 0) {
            Toast("已拒绝");
          } else {
            Toast(msg);
          }
        })
        .catch(function(error) {
          Toast({
            message: "网络连接失败",
            position: "bottom",
            duration: 5000
          });
        });
    }
  }
};
</script>
<style scoped="scoped">
#friend {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.con-wrapper {
  position: fixed;
  width: 100%;
  height: calc(100% - 40px);
  overflow-x: hidden;
  overflow-y: scroll;
  top: 40px;
  background: url(../../assets/img/bg-g.png) no-repeat center top;
  background-size: 116%;
}

.mint-header {
  background: #ef6213;
}
.request_info {
  width: 94%;
  margin: 0 auto;
  padding-top: 0.3rem;
}
.request_info .request_list {
  width: 100%;
  margin-bottom: 0.2rem;
  height: 1.6rem;
  border-radius: 0.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.request_info .request_list .request_left {
  width: 20%;
}
.request_info .request_list .request_left img {
  width: 86%;
  border-radius: 50%;
  margin-left: 0.2rem;
}
.request_right {
  flex: 1;
  margin-left: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.request_right .per_info {
  display: flex;
  flex-direction: column;
  font-size: 0.3rem;
  color: #fff;
}
.request_right .per_info span {
  padding: 0.1rem 0;
}
.function {
  display: flex;
}
.function span {
  padding: 0.1rem 0.26rem;
  margin: 0 0.1rem;
  border-radius: 0.2rem;
  font-size: 0.26rem;
}
.function span:nth-child(1) {
  background: #fff;
  color: #ef6213;
}
.function span:nth-child(2) {
  border: 1px solid #fff;
  color: #ef6213;
  color: #fff;
}

/* 暂无数据 */
#no-data {
  width: 100%;
  text-align: center;
  padding-top: 1rem;
  transition: all 0.2s;
}
#no-data > img {
  width: 40%;
  height: auto;
}
</style>
