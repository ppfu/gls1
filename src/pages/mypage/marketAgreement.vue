<template>
	<div id="argument">
		<mt-header fixed title="超市入驻协议">
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
    import {
    	Toast,
    	Indicator
    } from 'mint-ui';
	export default {
		components: {
			Toast,
			Indicator
		},
		data(){
			return{
				argument:''
			}
			
		},
		mounted(){
			this.getEnterArgument();
		},
		methods: {
			back() {
				this.$router.go(-1); //返回上一层
			},
	     	//获取超市入驻协议
		 	getEnterArgument() {
		 	let that = this;
		 	Indicator.open({
		 		text: "加载中...",
		 	});
		 	that
		 		.$http({
		 			url: "Pjshop/registerAgreement",
		 			method: "post",
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
		 },
			
		}
	}
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
		height: calc(100% - 40px);
		overflow-x: hidden;
		overflow-y: scroll;
		top: 40px;
	}

	.mint-header {
		position: relative;
		background: #EF6213;
	}

	.argument{
		width: 90%;
		margin: 0 auto;
		margin-top: 0.3rem;
		text-indent: 0.6rem;
	}
     
</style>
