<template>
  <div id="newsDetail">
    <mt-header fixed :title="message_type">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="news">
        <div class="news_text">
          <h4 v-html="title"></h4>
          <p v-html="news"></p>
        </div>
        <!-- <div class="news_img">
				  <img :src="" />
        </div>-->
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
      news: "",
      title: "",
      newId: this.$route.query.storeId, // 新闻id
      message_type: sessionStorage.getItem("message_type") || "资讯详情" //新闻类型
    };
  },
  mounted() {
    this.getNewsDetail();
    // console.log(this.$route.query.news_id)
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //获取商家入驻协议
    getNewsDetail() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Subscribe/noticeDetails",
          method: "post",
          data: {
            id: that.newId
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.news = res.data.data.content;
            that.title = res.data.data.title;
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
#newsDetail {
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

.news {
  width: 100%;
  padding: 0.2rem;
  text-align: justify;
}
.news h4 {
  font-size: 0.28rem;
  padding: 0.2rem 0;
  text-align: center;
}
</style>
