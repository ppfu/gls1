<template>
  <div id="manycard">
    <mt-header fixed title="多倍卡">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="many_con">
        <div class="many_titile">
          <div class="many_card">
            <img src="../../assets/img/many.png" />
            <span>多倍卡&nbsp;&nbsp;&nbsp;</span>
            <span>{{multiple}}张</span>
          </div>
          <button @click="gotoBuy">购买</button>
        </div>
        <div class="card_con">
          <div class="card_list" v-for="(item,index) in multList" :key="index">
            <div class="card_left">
              <img src="../../assets/img/many.png" />
              <span>{{item.multiple}}倍</span>
            </div>
            <div class="card_right">
              <h5>{{item.multiple}}倍卡</h5>
              <div class="card_two">
                <span>X{{item.number}}</span>
              </div>
            </div>
          </div>
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
      multList: [], //多倍卡数据
      multiple: "" //我的多倍卡数量
    };
  },
  mounted: function() {
    let that = this;
    that.getMultiple();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    gotoBuy() {
      this.$router.push({
        path: "/buymanycard"
      });
    },
    //获取多倍卡
    getMultiple() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "hong_bao/multiplePage",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.multList = res.data.data.list;
            that.multiple = res.data.data.multiple;
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
#manycard {
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
}

.mint-header {
  background: #ef6213;
}

.many_con {
  width: 90%;
  margin: 0 auto;
}

.many_titile {
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  justify-content: space-between;
  font-size: 0.28rem;
  align-items: center;
  padding: 0.2rem 0;
}
.many_titile .many_card {
  display: flex;
  align-items: center;
}
.many_titile .many_card img {
  width: 0.48rem;
  height: 100%;
}
.many_titile .many_card span:nth-child(3) {
  color: #ef6213;
}

.many_titile .iconfont {
  font-size: 0.4rem;
  color: red;
}

.many_titile button {
  width: 1rem;
  height: 0.5rem;
  background: #ef6213;
  border: none;
  border-radius: 0.2rem;
  color: #fff;
}

.card_con .card_list {
  display: flex;
  height: 2rem;
  align-items: center;
  padding: 0.2rem 0;
}

.card_con .card_list .card_left {
  width: 24%;
  position: relative;
}
.card_con .card_list .card_left img {
  width: 1.4rem;
}
.card_con .card_list .card_left span {
  position: absolute;
  left: 0.4rem;
  top: 0.2rem;
  font-size: 0.26rem;
  color: #fff;
}
.card_con .card_list .card_right {
  width: 72%;
  margin-left: 0.2rem;
  display: flex;
  justify-content: space-between;
}
.card_con .card_list .card_right .card_two span {
  font-size: 0.3rem;
  color: #ef6213;
}
</style>
