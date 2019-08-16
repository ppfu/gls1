<template>
  <div id="orderDetail">
    <mt-header fixed title="订单详情">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="order_content">
        <div class="order_address">
          <div class="address_list">
            <span>收货人：{{orderDetail.name}}</span>
            <span>{{orderDetail.phone}}</span>
          </div>
          <div class="address_list">
            <div class="add_img">
              <span class="iconfont icon-tabaddress"></span>
              <span>收货地址：{{orderDetail.address}}</span>
            </div>
            <span class="iconfont icon-tabgengduo"></span>
          </div>
        </div>
        <div class="list-box">
          <div class="shapping_list">
            <img :src="orderDetail.img" />
            <div class="shopping_info">
              <div class="shop_tit">
                <span>{{orderDetail.goods_name}}</span>
              </div>
              <div class="redpack">
                <h3>{{orderDetail.price}}元红包+{{orderDetail.integral}}谷分</h3>
                <span>X{{orderDetail.number}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="order_info">
          <span>订单编号：{{orderDetail.order}}</span>
          <span>创建时间：{{orderDetail.time}}</span>
          <span>付款时间：{{orderDetail.payment_time}}</span>
          <span>发货时间：{{orderDetail.delivery_time}}</span>
          <span>完成时间：{{orderDetail.complete_time}}</span>
          <span v-show="orderDetail.remind_img != ''">
            电子发票:
            <img @click="showPreview" :src="orderDetail.remind_img" />
            <van-image-preview
              v-model="srcShow"
              :images="images"
              :startPosition="srcIndex"
              @change="onChange"
              :loop="true"
            >
              <template v-slot:srcIndex>第{{ srcIndex }}页</template>
            </van-image-preview>
          </span>
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
      id: this.$route.query.id, //订单id
      orderDetail: [], //订单详情
      srcShow: false, //图片预览
      srcIndex: 0, //图片页面索引
      images: []
    };
  },
  mounted() {
    let that = this;
    that.getOrderDetail();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    onChange(index) {
      this.srcIndex = index;
    },
    showPreview() {
      this.srcShow = true;
    },
    //获取我的订单
    getOrderDetail() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "goods_order/orderDetail",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: that.id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.orderDetail = res.data.data;
            that.images = [];

            that.images.push(that.orderDetail.remind_img);
            console.log(that.images);
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
#orderDetail {
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

.order_content {
  width: 100%;
  padding: 0.2rem;
}

.order_address {
  padding: 0;
  border-bottom: 1px solid #ddd;
}

.address_list {
  font-size: 0.28rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.2rem 0;
}

.address_list:nth-child(1) {
  padding: 0 0.2rem;
}

.address_list .iconfont {
  font-size: 0.32rem;
}

.address_list .add_img .iconfont {
  color: #ef6213;
}

.list-box {
  padding: 0;
}

.list-box .shapping_list:last-child {
  border: none !important;
}

.shapping_list {
  display: flex;
  width: 100%;
  padding: 0.2rem 0;
  border-bottom: 1px dashed #ddd;
}

.shapping_list img {
  width: 24%;
  height: 1.6rem;
}

.shopping_info {
  padding-left: 0.2rem;
  flex: 1;
  font-size: 0.28rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.shopping_info .redpack {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.shopping_info h3 {
  font-weight: normal;
  font-size: 0.28rem;
  color: #ef6213;
}

.order_info {
  display: flex;
  flex-direction: column;
  font-size: 0.24rem;
}

.order_info span {
  padding: 2px 0;
}

.order_info span img {
  width: 100%;
}
</style>
