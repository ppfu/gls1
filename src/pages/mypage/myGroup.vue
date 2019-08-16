<template>
  <div id="pasture">
    <mt-header fixed title="我的团队">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="g_content">
        <div class="gu_head">
          <span>区域：{{area}}</span>
          <span>总人数：{{count}}</span>
          <span>总业绩：{{total}}</span>
        </div>
        <div class="box">
          <table>
            <tr>
              <th>用户/账号</th>
              <th>级别</th>
              <th>团队人数</th>
              <th>总业绩</th>
              <th>我的奖励</th>
            </tr>
            <tr v-for="(item,index) in teamList" :key="index">
              <td class="td_one">
                <span>{{item.name}}</span>
                <span>{{item.phone}}</span>
              </td>
              <td>{{item.level}}</td>
              <td>{{item.count}}</td>
              <td>{{item.total}}</td>
              <td>{{item.rebate}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div id="no-data" v-if="teamList.length == 0">
        <img src="../../assets/img/nodata.png" />
      </div>
      <div style="height:50px;"></div>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast } from "mint-ui";
export default {
  components: {
    Indicator,
    Toast
  },
  data() {
    return {
      teamList: [], //团队列表
      total: "", //总业绩
      count: "", //团队总人数
      area: "" //我的区域
    };
  },
  mounted: function() {
    let that = this;
    that.getMyTeam();
  },
  methods: {
    back() {
      // this.$router.go(-1); //返回上一层
      this.$router.push({
        path: "/tabs/my"
      });
    },
    //获取我的团队列表
    getMyTeam() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Personal/myTeam",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.teamList = res.data.data.child;
            that.count = res.data.data.count;
            that.total = res.data.data.total;
            that.area = res.data.data.area;
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
};
</script>

<style scoped="scoped">
#pasture {
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

.box {
  white-space: nowrap;
  overflow-x: auto;
  margin-top: 0.2rem;
}

.box::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.box div {
  list-style: none;
  display: inline-block;
  width: 200%;
  background: #ccc;
  text-align: center;
}

.mint-header {
  position: relative;
  background: #ef6213;
}

.mint-header p {
  position: absolute;
  right: 1rem;
  top: 0.26rem;
  width: 0.44rem;
}

.con-wrapper .list {
  width: 200%;
  margin: 0 auto;
}

.g_content {
  width: 100%;
  padding: 0 0.2rem;
  font-size: 0.28rem;
}

.gu_head {
  display: flex;
  justify-content: space-between;
  color: #ef6213;
  margin-top: 0.2rem;
}

.gu_head span:nth-child(1) {
  color: #333;
}
.box table {
  text-align: center;
}
.box table th {
  padding: 0.1rem 0.3rem;
}
.box table td {
  color: #888;
  padding: 0.1rem 0;
  font-size: 0.26rem;
}
.box table td.td_one {
  display: flex;
  flex-direction: column;
  align-items: center;
}
/* 暂无数据 */
#no-data {
  width: 100%;
  text-align: center;
  padding-top: 2rem;
  transition: all 0.2s;
}

#no-data > img {
  width: 40%;
  height: auto;
}
</style>
