<template>
  <div>
    <div class="tabs-wrap">
      <router-view name="child"></router-view>
    </div>
    <div id="footer">
      <van-tabbar v-model="active">
        <router-link to="/tabs/index">
          <van-tabbar-item>
            <span>首页</span>
            <img slot="icon" slot-scope="props" :src="props.active ? icon.tab1_on : icon.tab1_off" />
          </van-tabbar-item>
        </router-link>
        <router-link :to="{path:'/tabs/adopt',query:{tabindex: 0}}">
          <van-tabbar-item>
            <span>领养</span>
            <img slot="icon" slot-scope="props" :src="props.active ? icon.tab2_on : icon.tab2_off" />
          </van-tabbar-item>
        </router-link>
        <router-link to="/tabs/storeHome">
          <van-tabbar-item>
            <span>商城</span>
            <img slot="icon" slot-scope="props" :src="props.active ? icon.tab3_on : icon.tab3_off" />
          </van-tabbar-item>
        </router-link>
        <router-link to="/tabs/farm">
          <van-tabbar-item>
            <span>农场</span>
            <img slot="icon" slot-scope="props" :src="props.active ? icon.tab4_on : icon.tab4_off" />
          </van-tabbar-item>
        </router-link>
        <router-link to="/tabs/my">
          <van-tabbar-item>
            <span>我的</span>
            <img slot="icon" slot-scope="props" :src="props.active ? icon.tab5_on : icon.tab5_off" />
          </van-tabbar-item>
        </router-link>
      </van-tabbar>
    </div>
  </div>
</template>
<script>
import { Swipe, SwipeItem } from "mint-ui";
export default {
  data() {
    return {
      active: 0,
      icon: {
        tab1_off: require("../../assets/img/tab1_off.png"),
        tab1_on: require("../../assets/img/tab1_on.png"),
        tab2_off: require("../../assets/img/tab2_off.png"),
        tab2_on: require("../../assets/img/tab2_on.png"),
        tab3_off: require("../../assets/img/tab3_off.png"),
        tab3_on: require("../../assets/img/tab3_on.png"),
        tab4_off: require("../../assets/img/tab4_off.png"),
        tab4_on: require("../../assets/img/tab4_on.png"),
        tab5_off: require("../../assets/img/tab5_off.png"),
        tab5_on: require("../../assets/img/tab5_on.png")
      }
    };
  },
  components: {},
  watch: {
    // 使用watch 监听$router的变化
    $route(to, from) {
      if (this.$route.path == "/tabs/index") {
        this.active = 0;
      } else if (this.$route.path == "/tabs/adopt") {
        this.active = 1;
      } else if (this.$route.path == "/tabs/storeHome") {
        this.active = 2;
      } else if (this.$route.path == "/tabs/farm") {
        this.active = 3;
      } else if (this.$route.path == "/tabs/my") {
        this.active = 4;
      }
    }
  },
  created: function() {
    if (this.$route.path == "/tabs/index") {
      this.active = 0;
    } else if (this.$route.path == "/tabs/adopt") {
      this.active = 1;
    } else if (this.$route.path == "/tabs/storeHome") {
      this.active = 2;
    } else if (this.$route.path == "/tabs/farm") {
      this.active = 3;
    } else if (this.$route.path == "/tabs/my") {
      this.active = 4;
    }
  },
  methods: {}
};
</script>

<style scoped="scoped">
#footer {
  height: 1rem;
  width: 100%;
  overflow: hidden;
  position: fixed;
  bottom: 0;
}
.van-tabbar {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
  height: 1rem;
  background-color: #fff;
  border-top: 1px solid #ffffff;
}
.van-tabbar a {
  display: inline-block;
  height: 1rem;
  width: 20%;
  padding-top: 0.1rem;
}
.van-tabbar-item {
  color: #7d7e80;
  font-size: 0.24rem;
}

.van-tabbar-item--active {
  color: #ef6213;
}
.van-tabbar-item__icon img {
  display: block;
  height: 0.48rem;
}
</style>