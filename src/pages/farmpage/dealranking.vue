<template>
  <div id="ranking">
    <mt-header fixed title="交易">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="ranking">
        <div class="ranking_title">
          <div class="ranking_area">
            <span>当前交易区</span>
            <select class="selectpicker" v-model="area_id" @change="selectChange($event)">
              <option
                v-for="areaitem in area"
                :key="areaitem.id"
                :value="areaitem.id"
              >{{areaitem.name}}</option>
            </select>
          </div>
        </div>
        <div class="mine_ra">
          <table style="border-collapse:collapse;">
            <tr class="trtitle">
              <th>用户</th>
              <th>交易额</th>
              <th>排名</th>
              <th>奖金</th>
            </tr>
            <tr v-for="item in data" :key="item.id">
              <td>{{item.name}}</td>
              <td>{{item.total}}</td>
              <td>{{item.ranking}}</td>
              <td>{{item.reward}}</td>
            </tr>
          </table>
        </div>
      </div>
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
      area_id: this.$route.query.areaid, //区域id
      area: this.$route.query.area, //区域
      data: [],
      timer: "", //计时器
    };
  },
  created: function() {
    this.getDealranking(); //获取交易排名
    this.timer = setInterval(() => {
      this.getDealranking();
    }, 30000);
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //选择区域
    selectChange(e) {
      let that = this;
      var selectIndex = Number(e.target.value);
      // console.log(selectIndex)
      that.select_id = selectIndex;
      this.getDealranking(); //获取交易排名
    },
    //获取交易排名
    getDealranking() {
      let that = this;
      that
        .$http({
          url: "Trade/tradeRanking",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: that.area_id
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
    }
  },
  beforeRouteLeave(to, from, next) {
    //切换路由 离开页面清除计时器
    clearInterval(this.timer);
    next();
  },
  beforeDestroy() {
    //在开始销毁实例时调用。此时实例仍然有功能。
    //清除定时器
    clearInterval(this.timer);
  }
};
</script>
<style scoped="scoped">
#ranking {
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

.mint-header {
  background: #ef6213;
}

.ranking {
  width: 94%;
  margin: 0 auto;
}
.ranking_title {
  padding: 0.2rem 0;
  font-size: 0.28rem;
}

.ranking_title .ranking_area {
  color: #555;
}

.ranking_title .ranking_area select {
  height: 0.56rem;
  border: 1px solid #c8c8c8;
  border-radius: 0.1rem;
  color: #555;
  margin-left: 0.1rem;
}

.mine_ra {
  margin: 0 auto;
  white-space: nowrap;
  overflow-x: auto;
  margin-top: 0.2rem;
}

.mine_ra table {
  width: 100%;
  text-align: center;
  font-size: 0.28rem;
}

.mine_ra .trtitle {
  width: 100%;
}

.mine_ra .trtitle th {
  width: 25%;
  margin: 0;
  border: none;
  font-size: 0.28rem;
  padding: 0.16rem 0.3rem;
}
.mine_ra .trtitle tr {
  font-size: 0.26rem;
}
</style>
