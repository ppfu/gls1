<template>
	<div id="recreation">
		<mt-header fixed title="我的娱乐">
			<a slot="left">
				<mt-button icon="back" @click="back">返回</mt-button>
			</a>
		</mt-header>
		<div class="con-wrapper">
			<div class="recreat_con">
				<div class="recreat_list" @click="gotoTurn">
					<img src="../../assets/img/zhuanpan.png" />
					<span>大转盘</span>
				</div>
				<div class="recreat_list" @click="gotoTree">
					<img src="../../assets/img/timg.jpg" />
					<span>摇钱树</span>
				</div>
				<div class="recreat_list" @click="gotoPrize">
					<img src="../../assets/img/choujiang.png" />
					<span>抽奖</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		methods: {
			back() {
				this.$router.go(-1); //返回上一层
			},
			gotoDeta() {
				this.$router.push({
					path: '/rechDetail'
				})
			},
			gotoTurn() {
				this.$router.push({
					path: '/turntable'
				})
			},
			gotoTree() {
				this.$router.push({
					path: '/moneyTree'
				})
			},
			gotoPrize() {
				this.$router.push({
					path: '/prize'
				})
			}
		}
	}
</script>

<style scoped="scoped">
	#recreation {
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

	.recreat_con {
		width: 90%;
		margin: 0 auto;
		margin-top: 0.5rem;
		display: flex;
		justify-content: space-around;
	}

	.recreat_list {
		width: 20%;
		display: flex;
		flex-direction: column;
		align-items: center;

	}
	.recreat_list img {
		width: 100%;
	}
	.recreat_list span {
		font-size: 0.28rem;
		padding-top: 0.1rem;
	}
</style>
