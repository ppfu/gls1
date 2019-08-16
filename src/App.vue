<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="main" name="main"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      transitionName: "",
      timedown: this.arr
    };
  },
  created() {
    // 此举是防止浏览器刷新造成vuex数据丢失
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store") ) {
      this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    } 
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
      sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    })
  },
  watch: {
    // 使用watch 监听$router的变化
    $route(to, from) {
      clearInterval(window.t);
      clearInterval(window.t1);
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (to.fullPath.indexOf("index") == -1) {
        clearInterval(window.tt0);
        clearInterval(window.tt1);
      }
      if (!(to.meta.none == "true" && from.meta.none == "true")) {
        if (to.meta.index > from.meta.index) {
          //设置动画名称
          this.transitionName = "slide-left";
        } else {
          this.transitionName = "slide-right";
        }
      } else {
        this.transitionName = "";
      }
    }
  },
  components: {},
  mounted() {
    let that = this;
    window.document.oncontextmenu = function() {
      //屏蔽右键事件
      return false;
    };
    /**
     * 横竖屏
     * @param {Object}
     */
    function changeOrientation($print) {
      var width = document.documentElement.clientWidth;
      var height = document.documentElement.clientHeight;
      if (width < height) {
        $print.width(height);
        $print.height(width);
        $print.css("top", (height - width) / 2);
        $print.css("left", 0 - (height - width) / 2);
        $print.css("transform", "rotate(90deg)");
        $print.css("transform-origin", "50% 50%");
      }
      var evt =
        "onorientationchange" in window ? "orientationchange" : "resize";
      window.addEventListener(
        evt,
        function() {
          setTimeout(function() {
            var width = document.documentElement.clientWidth;
            var height = document.documentElement.clientHeight;
            if (width > height) {
              $print.width(width);
              $print.height(height);
              $print.css("top", 0);
              $print.css("left", 0);
              $print.css("transform", "none");
              $print.css("transform-origin", "50% 50%");
            } else {
              $print.width(height);
              $print.height(width);
              $print.css("top", (height - width) / 2);
              $print.css("left", 0 - (height - width) / 2);
              $print.css("transform", "rotate(90deg)");
              $print.css("transform-origin", "50% 50%");
            }
          }, 300);
        },
        false
      );
    }
    // changeOrientation($("#app"));
    document.addEventListener("plusready", function() {
      var webview = plus.webview.currentWebview();
      plus.key.addEventListener("backbutton", function() {
        webview.canBack(function(e) {
          if (e.canBack) {
            if (that.$route.path == "/myorder" || that.$route.path == "/marketOrder") {
              if (sessionStorage.getItem("goBackMine") == 1) {
                webview.back();
              } else {
                webview.back();
                webview.back();
              }
            } else {
              webview.back();
            }
          } else {
            webview.close(); //hide,quit
            plus.runtime.quit();
            document.plusReady(function() {
              //首页返回键处理
              //处理逻辑：1秒内，连续两次按返回键，则退出应用；
              var first = null;
              plus.key.addEventListener(
                "backbutton",
                function() {
                  //首次按键，提示‘再按一次退出应用’
                  if (!first) {
                    first = new Date().getTime();
                    alert("再按一次退出应用");
                    setTimeout(function() {
                      first = null;
                    }, 1000);
                  } else {
                    if (new Date().getTime() - first < 1500) {
                      plus.runtime.quit();
                    }
                  }
                },
                false
              );
            });
          }
        });
      });
    });
  }
};
</script>

<style>
@import "./assets/iconfont/iconfont.css";

/* @media screen and (orientation: portrait) {
  #app {
    -webkit-transform: rotate(-90deg);
    -moz-transform: rotate(-90deg);
    -ms-transform: rotate(-90deg);
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}

@media screen and (orientation: landscape) {
  #app {
    -webkit-transform: rotate(0);
    -moz-transform: rotate(0);
    -ms-transform: rotate(0);
    transform: rotate(0);
  }
} */

#app,
.main {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
}
</style>
