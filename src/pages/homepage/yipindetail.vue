<template>
  <div id="yipinyidi">
    <mt-header fixed title="产品介绍">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div v-html="detail"></div>
    </div>
    <div class="footer">
      <h4>
        价格：
        <span>{{price * number}} 元</span>
      </h4>
      <van-stepper v-model="number" :min="1" input-width="1rem" button-size="0.4rem" />
      <button @click="goCloseFun">预定</button>
    </div>
  </div>
</template>
<script>
import { Indicator, Toast } from "mint-ui";
import { LoadMore } from "vux";
export default {
  components: {
    Indicator,
    Toast,
    LoadMore
  },
  data() {
    return {
      id: this.$route.query.id, // 土地id
      detail: "", // 土地详情
      number: this.$route.query.number, // 数量
      price: this.$route.query.price // 价格
    };
  },
  mounted: function() {
    this.getDetail(this.id);
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //获取详情
    getDetail(id) {
      let that = this;
      Indicator.open({
        text: "提交中..."
      });
      that
        .$http({
          url: "subscribe/detail",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.detail = res.data.data;
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
    },
    goCloseFun() {
      var arr = {
        goods_id: this.id, //商品id
        img: sessionStorage.getItem("shopImg"), //商品图片
        number: this.number, //数量
        title: sessionStorage.getItem("shopName"), //名字
        price: this.price // 价格
      };
      sessionStorage.setItem("orderList", JSON.stringify(arr));
      this.$router.push({
        path: "/yipinclose",
        query: {
          id: this.id
        }
      });
    }
  }
};
</script>

<style scoped="scoped">
#yipinyidi {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.con-wrapper {
  position: fixed;
  width: 100%;
  height: calc(100% - 1.8rem);
  overflow-x: hidden;
  overflow-y: scroll;
  top: 0.8rem;
  padding: 0.2rem;
}

.footer {
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  align-items: center;
  -webkit-align-items: center;
  padding: 0.2rem;
  font-size: 0.28rem;
  background: #fff;
  border-top: 1px solid #ddd;
}
.footer h4 {
  font-weight: normal;
  color: #333;
}
.footer h4 span {
  font-weight: normal;
  color: #ef6213;
}

.footer button {
  width: 1.6rem;
  height: 0.56rem;
  line-height: 0.56rem;
  background: #ef6213;
  border-radius: 0.1rem;
  color: #fff;
  border: none;
}
.footer button:disabled {
  background: #ddd;
}
</style>
