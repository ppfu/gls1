<template>
<div id="agreement">
	<mt-header fixed title="注册协议">
		<a slot="left">
			<mt-button icon="back" @click="back">返回</mt-button>
		</a>
	</mt-header>
    <div class="con-wrapper">
	<div class="ar_content">
	   <div v-html="data"></div>
	 </div>
  </div>
	
</div>
</template>
 
<script>
export default {
  components: {},
	data(){
		return{
			data:''
		}
	},
	created:function(){
		this.getAgreement();
	},
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
		getAgreement(){
			let that = this;
			that.$http.post('Register/registerAgreement', {
			}).then(function(res) {
				 if(res.data.code==0){
					 that.data = res.data.data;
				 }
			}).catch(function(err) {
				Toast({
					message: '网络连接失败',
					position: 'bottom',
					duration: 5000
				});
			});
		},
  }
};
</script>

<style scoped="scoped">
#agreement {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.con-wrapper {
  position: fixed;
  width: 100%;
  height: calc(100% - 1.8rem);
  overflow-x: hidden;
  overflow-y: scroll;
  top: .8rem;
}
.mint-header {
	background: #EF6213;
}
.ar_content{
	width: 90%;
	margin: 0 auto;
	padding-top: 0.2rem;
	line-height: 0.6rem;
	text-indent:0.6rem;
}

</style>
