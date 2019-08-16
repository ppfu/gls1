<template>
  <div id="blackdetail">
    <mt-header fixed title="领养卡详情">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
      <p
        slot="right"
        class="iconfont icon-tabfenxiang"
        v-clipboard:copy="adoptDetail.url"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
      ></p>
    </mt-header>
    <div class="con-wrapper">
      <div class="black_con">
        <div class="black_list">
          <span>领养卡类别：</span>
          <span>{{adoptDetail.title}}</span>
        </div>
        <div class="black_list">
          <span>领养量：</span>
          <span>{{adoptDetail.number}}</span>
        </div>
        <div class="black_list">
          <span>领养期限：</span>
          <span>{{adoptDetail.term}}</span>
        </div>
        <div class="black_list">
          <span>领养类型：</span>
          <span>{{adoptDetail.type}}</span>
        </div>
        <div class="black_list">
          <span>基地地址：</span>
          <span>{{adoptDetail.address}}</span>
        </div>
        <div class="black_list">
          <span>领养时间：</span>
          <span>{{adoptDetail.time}}</span>
        </div>
      </div>
      <!-- <x-dialog v-model="lang_dlg" class="de_dialog lang_dialog" hide-on-blur>
				<div class="dialog">
					<span class="iconfont icon-tabguanbi" @click="closeDialog"></span>
					<span>我领养了{{adoptDetail.title}},您领养了吗？</span>
					<img src="../../assets/img/farm.png" />
					<span @click="gotoAdopt">去领养>></span>
				</div>
      </x-dialog>-->
    </div>
  </div>
</template>

<script>
import { Indicator, Toast } from "mint-ui";
import { XInput, XDialog } from "vux";
export default {
  components: {
    XInput,
    XDialog,
    Indicator,
    Toast
  },
  data() {
    return {
      lang_dlg: false,
      id: this.$route.query.id,
      adoptDetail: ""
    };
  },
  mounted: function() {
    let that = this;
    that.getAdoptCardDetails();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    showDialog: function() {
      var that = this;
      this.lang_dlg = true;
    },
    closeDialog: function() {
      var that = this;
      this.lang_dlg = false;
    },
    // gotoAdopt() {
    // 	this.$router.push({
    // 		path: "/tabs/adopt",
    // 		query: {
    // 			tabindex: 0
    // 		}
    // 	});
    // },
    //获取领养卡详情
    getAdoptCardDetails() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "card_bag/adoptCardDetails",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: that.id
          }
        })
        .then(function(res) {
          console.log(res);
          if (res.data.code == 0) {
            //成功回调
            that.adoptDetail = res.data.data;
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
    //复制失败
    onError() {
      // 移动端走的失败
      // alert(navigator.userAgent);
      // if (!/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      //   if (/ baiduboxapp/i.test(navigator.userAgent)) {
      //     window.location.replace(
      //       "bdbox://utils?action=sendIntent&minver=7.4&params=%7B%22intent%22%3A%22weixin://%23wechat_redirect%23Intent%3Bend%22%7D"
      //     );
      //   } else {
      //     window.location.replace("weixin://");
      //   }
      // } else {
      //   window.location.replace("weixin://");
      // }
      Toast({
        message: "链接复制成功，请粘贴到微信分享",
        position: "center",
        duration: 3000
      });
    },
    //复制成功
    onCopy() {
      // web走的成功
      // 邀请
      // let that = this;
      // if (!/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      //   if (/ baiduboxapp/i.test(navigator.userAgent)) {
      //     window.location.replace(
      //       "bdbox://utils?action=sendIntent&minver=7.4&params=%7B%22intent%22%3A%22weixin://%23wechat_redirect%23Intent%3Bend%22%7D"
      //     );
      //   } else {
      //     window.location.replace("weixin://");
      //   }
      // } else {
      //   window.location.replace("weixin://");
      // }
      Toast({
        message: "链接复制成功，请粘贴到微信分享",
        position: "center",
        duration: 3000
      });
    }
  }
};
</script>

<style scoped="scoped">
#blackdetail {
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
  position: relative;
  background: #ef6213;
}

.mint-header p {
  position: absolute;
  right: 0.3rem;
  top: 0.26rem;
  width: 0.44rem;
}

.black_con {
  width: 90%;
  margin: 0 auto;
  margin-top: 0.3rem;
}

.black_list {
  font-size: 0.28rem;
  padding: 0.1rem 0;
  color: #555;
}

.black_list span:nth-child(1) {
  display: inline-block;
  width: 26%;
}

.dialog {
  width: 100%;
  height: 4rem;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-top: 0.4rem;
}

.dialog span:nth-child(1) {
  position: absolute;
  right: 0.2rem;
  top: 0.2rem;
}

.dialog img {
  /* width: 70%; */
  padding: 0.2rem 0;
}

.dialog span:nth-child(4) {
  color: #ef6213;
}
</style>
