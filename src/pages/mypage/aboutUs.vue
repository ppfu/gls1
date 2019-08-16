<template>
	<div id="aboutas">
		<mt-header fixed title="关于我们">
			<a slot="left">
				<mt-button icon="back" @click="back">返回</mt-button>
			</a>
		</mt-header>
		<div class="con-wrapper">
			<div class="about-con" v-html="data"></div>
		</div>
	</div>
</template>

<script>
	import {
		Indicator,
		Toast
	} from "mint-ui";
	export default {
		components: {
			Indicator,
			Toast
		},
		data() {
			return {
				data: '',//联系客服
			};
		},
		mounted: function() {
			let that = this;
			that.getAboutUs();	
		},
		methods: {
			back() {
				this.$router.go(-1); //返回上一层
			},
			//获取关于我们
			getAboutUs() {
				let that = this;
				Indicator.open({
					text: "加载中...",
				});
				that
					.$http({
						url: "Personal/aboutUs",
						method: "post",
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
			},
		}
	};
</script>

<style>
	#aboutas {
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
		background: #EF6213;
	}

	.mint-header p {
		position: absolute;
		right: 0.3rem;
		top: 0.26rem;
		width: 0.44rem;
	}
  .about-con{
	  width: 90%; 
	  margin: 0 auto;
  }
  .about-con p{
	  padding-top: 0.2rem;
  }
</style>
