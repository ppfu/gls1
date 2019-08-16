<template>
  <div id="friend">
    <mt-header fixed title="好友">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
      <span slot="right" class="iconfont icon-tabtianjia" @click="gotoAddfriend"></span>
    </mt-header>
    <div class="con-wrapper">
      <div class="fr_content">
        <div class="fr_info">
          <div v-for="item in data" :key="item.id" class="fr_list" @click="gotoFriendfame(item)">
            <div class="fa_left">
              <img src="../../assets/img/logo.jpg" />
            </div>
            <div class="fa_right">
              <div class="per_info">
                <span>{{item.name}}</span>
                <span>{{item.phone}}</span>
              </div>
              <div class="function">
                <!-- 是否可以施肥 -->
                <div v-if="item.fertilizer_status" class="fu_list">
                  <img src="../../assets/img/sf.png" />
                  <span>施肥</span>
                </div>
                <!-- 是否可以浇水 -->
                <div v-if="item.watering_status" class="fu_list fu_jiao">
                  <img class="jiaos" src="../../assets/img/js.png" />
                  <span>浇水</span>
                </div>
                <!-- 是否可以收取 -->
                <div v-if="item.steal_status" class="fu_list">
                  <img class="zhua" src="../../assets/img/s.png" />
                  <span>可收取</span>
                </div>
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
import { XDialog } from "vux";
import { Toast, Indicator } from "mint-ui";
export default {
  components: {
    XDialog,
    Toast,
    Indicator
  },
  data() {
    return {
      data: [] //好友列表
    };
  },
  created: function() {
    this.getFriendList();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //去添加好友页面
    gotoAddfriend() {
      this.$router.push({
        path: "/addfriend"
      });
    },
    //进入好友农场
    gotoFriendfame(item) {
      this.$router.push({
        path: "/friendfame",
        query: {
          id: item.id,
          fertilizer_status: item.fertilizer_status,
          watering_status: item.watering_status,
          steal_status: item.steal_status
        }
      });
    },
    //获取好友列表
    getFriendList() {
      let that = this;
      Indicator.open({
        text: "数据加载中..."
      });
      that
        .$http({
          url: "farm_friend/index",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          Indicator.close();
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

.fr_info {
  width: 94%;
  margin: 0 auto;
  padding-top: 0.3rem;
}
.fr_info .fr_list {
  width: 100%;
  margin-bottom: 0.2rem;
  height: 1.6rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 0.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.fr_info .fr_list .fa_left {
  width: 20%;
}
.fr_info .fr_list .fa_left img {
  width: 86%;
  border-radius: 50%;
  margin-left: 0.2rem;
}
.fa_right {
  flex: 1;
  margin-left: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fa_right .per_info {
  display: flex;
  flex-direction: column;
  font-size: 0.3rem;
}
.fa_right .per_info span {
  padding: 0.1rem 0;
}
.function {
  display: flex;
}
.function .fu_list {
  display: flex;
  margin: 0 0.1rem;
  flex-direction: column;
  font-size: 0.24rem;
  justify-content: space-between;
  align-items: center;
  color: #ec7d37;
}
.function .fu_list img {
  width: 0.56rem;
}
.function .fu_jiao {
  margin-left: 0.3rem;
}
.function .fu_list img.jiaos {
  width: 1rem;
}
.function .fu_list img.zhua {
  width: 0.64rem;
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
