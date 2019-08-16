<template>
	<div id="seedDetail">
		<mt-header fixed title="种子详情">
			<a slot="left">
				<mt-button icon="back" @click="back">返回</mt-button>
			</a>
		</mt-header>
		<div class="con-wrapper">
			<div class="seedDetail_con">
				<p v-html="data"></p>
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
		components:{
			Toast,	
			Indicator	
		},
		data(){
			return{
				lang_dlg: false,
				id: this.$route.query.id,
				data:''
			}			
		},	
		created:function(){
			this.getSeedDetail()
		},
		methods: {
			back() {
				this.$router.go(-1); //返回上一层
			},
			//获取种子详情
			getSeedDetail() {
				let that = this;
				that.$http({
						url: "Farm/seedDetails",
						method: "post",
						data: {
							token: localStorage.getItem("token"),
							id:that.id							
						}
					})
					.then(function(res) {
						console.log(res)
						if (res.data.code == 0) {
							that.data = res.data.data;
							console.log(that.data)
						} else {
							Toast('获取信息失败');
						}
					})
					.catch(function(error) {
						Toast({
							message: '网络连接失败',
							position: 'bottom',
							duration: 5000
						});
					});
			},
		   
			
		}
	}
</script>

<style scoped="scoped">
	#seedDetail {
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

	.seedDetail_con {
		width: 90%;
		margin: 0 auto;
		margin-top: 0.5rem;
	}
	
</style>
