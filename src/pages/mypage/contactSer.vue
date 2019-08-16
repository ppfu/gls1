<template>
  <div id="consactser">
    <mt-header fixed title="联系客服">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="black_con">
        <div class="black_list" v-html="data"></div>
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
      data: "" //联系客服
    };
  },
  mounted: function() {
    let that = this;
    that.getContactUs();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //获取推广有礼
    getContactUs() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Personal/contactUs",
          method: "post"
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.data = res.data.data;
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
#consactser {
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
.black_con {
  width: 100%;
  padding: 0.2rem;
}

.black_list p {
  font-size: 0.28rem;
	line-height: 0.28rem;
  padding: 0.2rem 0;
  color: #555;
}
</style>
