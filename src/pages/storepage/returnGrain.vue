<template>
  <div id="return">
    <mt-header fixed title="商城返谷分记录">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="return_con">
        <div class="return_list" v-for="recorditem in recordList" :key="recorditem.id">
          <div class="return_re">
            <span>{{recorditem.name}}</span>
            <span>{{recorditem.money}}</span>
          </div>
          <div class="return_time">{{recorditem.time}}</div>
        </div>
        <div id="no-data" v-if="recordList.length == 0">
          <img src="../../assets/img/nodata.png" />
        </div>
      </div>
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
      recordList: [] //记录列表
    };
  },
  mounted() {
    let that = this;
    that.getRebateRecord();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //获取商城返谷分记录
    getRebateRecord() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Ckshop/rebateRecord",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.recordList = res.data.data; //记录列表
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
#return {
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

.return_con {
  width: 100%;
  padding: 0 0.2rem;
}

.return_con .return_list {
  border-bottom: 1px solid #e9e9e9;
  padding: 0 0.2rem;
  font-size: 0.26rem;
  padding: 0.2rem 0;
}

.return_con .return_re {
  padding-bottom: 0.1rem;
  display: flex;
  justify-content: space-between;
}
.return_con .return_re span {
  color: #333;
}
.return_con .return_time {
  text-align: right;
  color: #777777;
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
