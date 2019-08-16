<template>
	<div class="footer">
		<!-- 底部tabbar -->
		<mt-tabbar v-model="selected">
			<mt-tab-item id="首页">
				<img slot="icon" src="" @click="gotoIndex">
				首页
			</mt-tab-item>
			<mt-tab-item id="领养">
				<img slot="icon" src="" @click="gotoAdopt">
				领养
			</mt-tab-item>
			<mt-tab-item id="商城">
				<img slot="icon" src="" @click="gotoStore">
				商城
			</mt-tab-item>
			<mt-tab-item id="农场">
				<img slot="icon" src="" @click="gotoFarm">
				农场
			</mt-tab-item>
			<mt-tab-item id="我的">
				<img slot="icon" src="" @click="gotoMy">
				我的
			</mt-tab-item>
		</mt-tabbar>
	</div>
</template>

<script>
export default {
  data() {
    return {
      selected: true
    };
  },
  methods: {
    gotoIndex() {
      this.$router.push({
        path: "/"
      });
    },
    gotoAdopt() {
      this.$router.push({
        path: "adopt"
      });
      console.log(123);
    },
    gotoStore() {
      this.$router.push({
        path: "store"
      });
    },
    gotoFarm() {
      this.$router.push({
        path: "farm"
      });
    },
    gotoMy() {
      this.$router.push({
        path: "my"
      });
    }
  }
};
</script>

<style>
.mint-tabbar > .mint-tab-item.is-selected {
  /* color: #EF6213; */
}
.mint-tab-item > .mint-tab-item.is-selected {
  background: #e9e9e9;
}

.footer {
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  /* padding-top: 40px;
		padding-bottom: 60px; */
  /* overflow-x: hidden; */
}
</style>
