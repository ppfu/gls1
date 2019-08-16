<template>
  <div id="stealing">
    <mt-header fixed title="正在偷粮">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="stealing_content">
        <div class="stealing_info">
          <div v-for="item in data" class="stealing_list" :key="item.id">
            <div class="stealing_left">
              <img src="../../assets/img/farm.png" />
            </div>
            <div class="stealing_right">
              <div class="per_info">
                <span>{{item.name}}</span>
                <span>{{item.phone}}</span>
              </div>
              <div class="function">
                <span>{{item.number}}</span>
                <span @click="arrest(item.id)">逮捕</span>
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
      data: [] //正在偷粮
    };
  },
  created: function() {
    this.getSteal();
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
    //获取正在偷粮列表
    getSteal() {
      let that = this;
      Indicator.open({
        text: "数据加载中..."
      });
      that
        .$http({
          url: "Farm/stealList",
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
            Toast("获取信息失败");
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
    //逮捕
    arrest(id) {
      let that = this;
      that
        .$http({
          url: "Farm/arrest",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: id
          }
        })
        .then(function(res) {
          var msg = res.data.msg;
          if (res.data.code == 0) {
            Toast("逮捕成功");
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
.stealing_content {
  width: 100%;
}
.stealing_info {
  border-radius: 0.1rem;
  width: 94%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.7);
}
.stealing_info .stealing_list {
  margin-top: 0.3rem;
  width: 100%;
  margin-bottom: 0.2rem;
  height: 1.4rem;
  border-radius: 0.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stealing_info .stealing_list .stealing_left {
  width: 16%;
}
.stealing_info .stealing_list .stealing_left img {
  width: 84%;
  margin-left: 0.2rem;
}
.stealing_right {
  flex: 1;
  margin-left: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stealing_right .per_info {
  display: flex;
  flex-direction: column;
  font-size: 0.28rem;
  color: #555;
}
.stealing_right .per_info span {
  padding: 0.04rem 0;
}
.function {
  display: flex;
  align-items: center;
}
.function span:nth-child(1) {
  font-size: 0.28rem;
  color: #ef6213;
}
.function span:nth-child(2) {
  padding: 0.1rem 0.26rem;
  margin: 0 0.2rem;
  border-radius: 0.2rem;
  font-size: 0.26rem;
  background: #ef6213;
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
