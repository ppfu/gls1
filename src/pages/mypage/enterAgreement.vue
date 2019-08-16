<template>
  <div id="argument">
    <mt-header fixed title="商家入驻协议">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="argument">
        <div v-html="argument"></div>
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
      argument: ""
    };
  },
  mounted() {
    this.getEnterArgument();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //获取商家入驻协议
    getEnterArgument() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Ckshop/registerAgreement",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.argument = res.data.data;
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
#argument {
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
  position: relative;
  background: #ef6213;
}

.argument {
  width: 100%;
  padding: 0.2rem;
  font-size: .28rem;
  text-indent: 0.56rem;
  text-align: justify;
}
</style>
