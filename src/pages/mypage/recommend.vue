<template>
  <div id="cover">
    <mt-header fixed title="推广有礼">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="black_con">
        <div class="black_list">
          <span>我的区域</span>
          <span>{{invitation.area}}</span>
        </div>
        <div class="black_list">
          <span>我的邀请码</span>
          <span>{{invitation.invitation_code}}</span>
        </div>
        <div class="black_list">
          <span>我的二维码</span>
          <img :src="invitation.invitation_img" />
        </div>
        <div class="link">
          <p>我的推广链接</p>
          <div>
            <p>{{invitation.url}}</p>
            <!-- <span @click="shareFun">分享</span> -->
            <button
              type="button"
              v-clipboard:copy="invitation.url"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >分享</button>
          </div>
        </div>
      </div>
    </div>
    <!-- <van-action-sheet
      v-model="shareShow"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
      @cancel="onCancel"
    />-->
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
      invitation: "", //推广有礼
      shareShow: false,
      // actions: [{ name: "分享给朋友" }, { name: "分享到朋友圈" }],
      shareUrl: ""
    };
  },
  mounted: function() {
    this.getInvitation();
    // this.onShare();
    // var shares = null;
    // // 监听plusready事件
    // document.addEventListener(
    //   "plusready",
    //   function() {
    //     // 扩展API加载完毕，现在可以正常调用扩展API
    //     console.log("123456");
    //     plus.share.getServices(
    //       function(s) {
    //         shares = s;
    //         console.log(s);
    //       },
    //       function(e) {
    //         alert("获取分享服务列表失败：" + e.message);
    //       }
    //     );
    //   },
    //   false
    // );
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    // 分享
    onShare() {
      let that = this;
      this.$http({
        url: "Wechat/getSignPackage",
        method: "post"
      })
        .then(res => {
          if (res.data.code === 0) {
            that.shareUrl = res.data.data.url;
            // 配置config
            wx.config({
              // 开启调试模式时,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              debug: false,
              // 后台返回之前获取的appId
              appId: res.data.data.appId,
              // 必填，生成签名的时间戳
              timestamp: res.data.data.timestamp,
              // 必填，生成签名的随机串
              nonceStr: res.data.data.nonceStr,
              // 必填，签名，见附录1
              signature: res.data.data.signature,
              // 必填，需要使用的JS接口列表，所有JS接口列表见附录3
              jsApiList: [
                "checkJsApi",
                "updateAppMessageShareData",
                "updateTimelineShareData"
              ]
            });

            // 微信检查接口列表
            wx.checkJsApi({
              jsApiList: [
                "checkJsApi",
                "updateAppMessageShareData",
                "updateTimelineShareData"
              ], // 需要检测的JS接口列表
              success: function(res) {
                console.log(res);
                // alert('checkJsApi' + res);
              }
            });

            // // 隐藏微信右上角弹出菜单中部分功能按钮
            // wx.hideMenuItems({
            //   menuList: [
            //     "menuItem:share:qq",
            //     "menuItem:share:QZone",
            //     "menuItem:share:weiboApp",
            //     "menuItem:copyUrl"
            //   ], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录4
            //   success: function(res) {
            //     // alert(res);
            //   }
            // });
            wx.ready(function() {
              // alert("加载");
              console.log("加载");
            });
            // 微信预加载失败回调
            wx.error(function(res) {
              console.log("微信预加载失败");
              console.log(res);
              // alert("微信预加载失败");
            });
          }
        })
        .catch(error => {
          // 请求接口失败回调函数
          alert("请求接口失败");
        });
    },
    shareFun() {
      this.shareShow = true;
    },
    onSelect(item) {
      let that = this;
      // that.shareShow = false;
      alert(location.href.split("#")[0]);
      console.log(item.name);
      if (item.name == "分享给朋友") {
        wx.updateAppMessageShareData({
          // 分享标题
          title: "好友",
          // 分享描述
          desc: "分享好友描述",
          // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          link: "http://glsapp.shienkeji.com",
          // 分享图标
          imgUrl:
            "http://img3.imgtn.bdimg.com/it/u=400062461,2874561526&fm=26&gp=0.jpg",
          // 用户确认分享后执行的回调函数
          success: function() {
            console.log("分享好友回调函数");
            console.log("shareLink= " + that.shareUrl);
          },
          // 用户取消分享后执行的回调函数
          cancel: function() {
            // alert('取消分享回调函数');
            console.log("分享回好友调函数");
          }
        });
      } else {
        wx.updateTimelineShareData({
          // 分享标题
          title: "朋友圈",
          // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          link: that.shareUrl,
          // 分享图标
          imgUrl:
            "http://img3.imgtn.bdimg.com/it/u=400062461,2874561526&fm=26&gp=0.jpg",
          // 用户确认分享后执行的回调函数
          success: function() {
            console.log("分享回调函数");
            console.log("shareLink= " + that.invitation.url);
            // alert('分享回成功调函数');
          },
          // 用户取消分享后执行的回调函数
          cancel: function() {
            console.log("取消分享回调函数");
            // alert('取消分享回调函数');
          }
        });
      }
    },
    onCancel() {
      console.log("取消");
    },
    //获取推广有礼
    getInvitation() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Personal/invitation",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.invitation = res.data.data;
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
      Toast({
        message: "复制成功",
        position: "center",
        duration: 3000
      });
    },
    //复制成功
    onCopy() {
      // web走的成功
      Toast({
        message: "复制成功",
        position: "center",
        duration: 3000
      });
    }
  }
};
</script>

<style scoped="scoped">
#cover {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.con-wrapper {
  position: fixed;
  width: 100%;
  height: calc(100% - 0.8rem);
  overflow-x: hidden;
  overflow-y: scroll;
  top: 0.8rem;
}

.mint-header {
  position: relative;
  background: #ef6213;
}

#cover .mint-header p {
  position: absolute;
  right: 0.3rem;
  top: 0.26rem;
  width: 0.44rem;
}

.black_con {
  width: 100%;
  padding: 0 0.2rem;
}

.black_list {
  font-size: 0.28rem;
  padding-top: 0.2rem;
  color: #555;
  display: flex;
}

.black_list span:nth-child(1) {
  display: inline-block;
  width: 26%;
}
.black_list img {
  width: 50%;
  height: 50%;
}
.link {
  color: #555;
  padding-top: 0.2rem;
  font-size: 0.28rem;
}
.link > div {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
}
.link > div > p {
  width: 80%;
  word-wrap: break-word;
  font-size: 0.28rem;
}
.link > div > button {
  color: #ffbe00;
  font-size: 0.28rem;
  outline: 0 none;
  border: 0 none;
  background: white;
}
</style>
