<template>
	<div id="marketEvaluate">
		<mt-header fixed title="写评价">
			<a slot="left">
				<mt-button icon="back" @click="back">返回</mt-button>
			</a>
		</mt-header>
		<!-- 内容 -->
		<div class="con-wrapper">
			<div class="evaluate_con">
				<div class="commodity">
					<div class="com_img">
						<img :src="evaluate.img" />
					</div>
					<div class="eval_star">
						<van-rate v-model="score" />
					</div>
				</div>
				<div class="eval_info">
					<!-- 评价 -->
					<textarea v-model="text" placeholder="请输入评价内容"></textarea>
					<!-- 上传图片 -->
					<div class="upload_img">
						<span>请上传评价图片(最多可上传3张)</span>
						<van-uploader v-model="fileList" :after-read="afterRead" multiple :max-count="3" />
					</div>
				</div>
				<div class="sub_eval">
					<button @click="submintEval">提交</button>
				</div>
			</div>
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
				id: this.$route.query.id,
				score: 0, //评价星级
				fileList: [], //上传图片
				evaluate: [], //评价页面信息
				text: '', //评价内容
				uploadImages: '',
				file1: '',
				file2: '',
				file3: '',
				files: [],
				srcs: [] //地址列表
			}
		},
		watch: {
			'fileList': {
				handler: function(newValue, oldValue) {
					let that = this;
					if (oldValue.length > newValue.length) {
						//删除操作
						var val = that.getArrDifference(oldValue, newValue);
						var deleteIndex = $.inArray(val[0], oldValue);
						that.srcs.splice(deleteIndex, 1);
					}

				},
				deep: true,
			}
		},
		mounted() {
			let that = this;
			that.getEvaluate();


		},
		methods: {
			back() {
				this.$router.go(-1); //返回上一层
			},
			// 取出两个数组中不同的 元素
			getArrDifference(arr1, arr2) {
				return arr1.concat(arr2).filter(function(v, i, arr) {
					return arr.indexOf(v) === arr.lastIndexOf(v);
				});
			},
			//获取评价页面信息
			getEvaluate() {
				let that = this;
				Indicator.open({
					text: "加载中...",
				});
				that
					.$http({
						url: "goods_orderpj/evaluateGoods",
						method: "post",
						data: {
							token: localStorage.getItem("token"),
							id: that.id
						}
					})
					.then(function(res) {
						// console.log(res)
						if (res.data.code == 0) {
							//成功回调
							that.evaluate = res.data.data;

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
							that.srcs.push(res.data);
							// for(var = i;i<res.data.length;i++){

							// }
							console.log(that.files)
						} else {
							//失败
							Toast(res.msg);
						}
						Indicator.close();
					});
				}

			},
			imgclose(e) {
				this.uploadImages.splice(e, 1)
			},
			//提交评价
			submintEval() {
				let that = this;
				if(!that.text || that.text == null){
					Toast();
				}
				Indicator.open({
					text: "提交中...",
				});
				that
					.$http({
						url: "goods_orderpj/evaluateGoodsActive",
						method: "post",
						data: {
							token: localStorage.getItem("token"),
							id: that.id,
							score: that.score,
							text: that.text,
							img: (that.srcs).toString()
						}
					})
					.then(function(res) {
						// console.log(res)
						if (res.data.code == 0) {
							//成功回调
							Toast("发布成功");
							
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

<style scoped="scoped">
	#marketEvaluate {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.con-wrapper {
		position: fixed;
		width: 100%;
		height: calc(100% - 90px);
		overflow-x: hidden;
		overflow-y: scroll;
		top: 40px;
	}

	.mint-header {
		background: #ef6213;
	}

	.evaluate_con {
		width: 90%;
		margin: 0 auto;
	}

	.commodity {
		margin-top: 0.4rem;
		height: 2rem;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.commodity .com_img {
		width: 26%;
	}

	.commodity img {
		width: 100%;
	}

	.eval_info {
		margin-top: 0.3rem;
		/* height: 4.6rem; */
		border: 1px solid #E8E8E8;
	}

	.upload_img {
		display: flex;
		flex-direction: column;
		margin-left: 0.1rem;
	}

	.upload_img span {
		padding: 0.2rem 0;
		font-size: 0.24rem;
		color: #666;
	}

	.eval_info textarea {
		width: 100%;
		height: 2rem;
		border: none;
		padding: 0.1rem;
		font-size: 0.24rem;
	}

	.sub_eval {
		margin-top: 1rem;
		text-align: center;
	}

	.sub_eval button {
		width: 80%;
		height: 0.8rem;
		border: none;
		background: #EF6213;
		color: #fff;
	}
</style>
