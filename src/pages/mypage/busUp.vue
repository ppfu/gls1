<template>
	<div id="busup">
		<mt-header fixed title="商家升级">
			<a slot="left">
				<mt-button icon="back" @click="back">返回</mt-button>
			</a>
		</mt-header>
		<div class="con-wrapper">
			<div class="up_con">
				<div class="bus_license">请上传营业执照</div>
				<div class="license_box">
					<van-uploader v-model="fileList" :after-read="afterRead" multiple :max-count="1" />
				</div>
				<p class="beizhu">备注：3级及以上必须上传</p>			
				<div class="checket">
					<van-checkbox v-model="checked" id="checked" @click="check" checked-color="#EF6213"></van-checkbox>
					<p>我已阅读并同意<span @click="gotoArgument">《商家入驻协议》</span></p>
				</div>
				<div class="button">
					<button class="accept" id="accept" @click="BusUp"  disabled="disabled" type="default">确认</button>
				</div>
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
		data() {
			return {
				disabled: true,
				checked:false,
                fileList: [],
				files:''
			}

		},
		methods: {
			back() {
				this.$router.go(-1); //返回上一层
			},
			//入驻协议
			gotoArgument() {
				this.$router.push({
					path: '/enterAgreement'
				});
			},
			//判断注册协议是否选择
			check() {
				let that = this;
				if (that.checked == false) {
					$("#accept").prop("disabled", false);
					$("#accept").css("background", "#EF6213")
				} else {
					$("#accept").prop("disabled", true);
					$("#accept").css("background", "#c6c6c6")
				}
			},
            //商家升级
           BusUp() {				
             let that = this;
			 if (that.fileList.length<1) {
			 	Toast('请上传营业执照');
			 }else{
				  Indicator.open({
				   text: "提交中...",
				 });
				 that
				   .$http({
				     url: "Ckshop/userUpgrade",
				     method: "post",
				     data: {
				      token: localStorage.getItem('token'),
				      license:that.files
				     }
				   })
				   .then(function(res) {
				     if (res.data.code == 0) {
				       //成功回调
				       Toast("资料提交成功");
				 				   
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
            
           },
		   // 上传图片
		   afterRead(file) {
		   	let that = this;
		   	var reader = new FileReader();
		   	reader.readAsDataURL(file.file); // 读取文件
		   	reader.onload = function(arg) {
		   		var formData = new FormData();
		   		formData.append('file', file.file);
		   		formData.append("token", localStorage.getItem("token"));
		   		$.ajax({
		   			url: 'http://glsapi.jinjifuweng.com/api/goods_order/upload/',
		   			type: 'POST',
		   			data: formData,
		   			dataType: 'JSON',
		   			cache: false,
		   			processData: false,
		   			contentType: false
		   		}).done(function(res) {
		   			// console.log(res)
		   			if (res.code == 0) {
		   				//成功回调
		   				// Toast("上传成功");
		   				that.files = res.data;
		   				// that.srcs.push(res.data);
		   				// for(var = i;i<res.data.length;i++){
		   
		   				// }
		   			} else {
		   				//失败
		   				Toast(res.msg);
		   			}
		   			Indicator.close();
		   		});
		   	}
		   
		   },

		}
	}
</script>

<style>
	#busup {
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
		background: #EF6213;
	}

	.mint-header .shengji {
		font-size: 0.6rem;
	}

	.up_con {
		width: 100%;
		padding: 0.2rem;
	}

	.img_title {
		width: 100%;
		height: 0.5rem;
		line-height: 0.5rem;
		color: #969696;
		font-size: 0.25rem;
	}
	.bus_license{
		padding-bottom: 0.2rem;
		font-size: 0.28rem;
	}
	.license_box {
		width: 100%;
		height: 3.54rem;
		margin: 0 auto;
		position: relative;
	}
	.van-uploader{
		 width: 100% !important;
	/* 	height: 3.54rem !important; */
	}
    .license_box  .van-uploader__upload{
		 width: 100% !important; 
		 height: 3.54rem !important;
		  margin: 0;
	 }
	.license_box .van-uploader__preview-image{
		width: 100% !important;
		height: 3.54rem !important;
	}
	.checket {
		display: flex;
		justify-content: center;
		font-size: 0.26rem;
		color: #555;
	}

	.checket span {
		color: #EF6213;
	}
    .checket p{
		padding-left: 0.1rem;
		}
	.up_con .beizhu {
		font-size: 0.26rem;
		color: #EF6213;
		margin-top: 0.1rem;
		margin-bottom: 0.3rem;
	}

	.up_con .button {
		text-align: center;
	}

	.up_con button {
		width: 6rem;
		height: 0.8rem;
		color: #fff;
		margin: 0 auto;
		margin-top: 0.3rem;
		border-radius: 0.2rem;
		background: #ccc;
		font-size: 0.30rem;
		border: none;
	}
</style>
