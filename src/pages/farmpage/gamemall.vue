<template>
	<div id="gamemall">
		<mt-header fixed title="游戏商城">
			<a slot="left">
				<mt-button icon="back" @click="back">返回</mt-button>
			</a>
		</mt-header>
		<div class="con-wrapper">
			<div class="game_con">
				<div class="game_list" @click="gotoCult">
					<img src="../../assets/img/wjj.png" />
					<span>开垦机</span>
				</div>
				<div class="game_list" @click="gotoSeed">
					<img src="../../assets/img/zz.png" />
					<span>种子</span>
				</div>
				<div class="game_list" @click="gotoFerti">
					<img src="../../assets/img/fl.png" />
					<span>肥料</span>
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
			gotoCult() {
				this.$router.push({
					path: '/cultivators'
				})
			},
			gotoSeed() {
				this.$router.push({
					path: '/seed'
				})
			},
			gotoFerti() {
				this.$router.push({
					path: '/fertilizer'
				})
			}
		}
	}
</script>

<style scoped="scoped">
	#gamemall {
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

	.game_con {
		width: 90%;
		margin: 0 auto;
		margin-top: 0.5rem;
		display: flex;
		justify-content: space-around;
	}

	.game_list {
		width: 20%;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #555;
		font-size: 0.28rem;
	}
	.game_list img {
		display: block;
		width: 80%;
		background: #F7F7F7;
		background-size: 110%;
	}
	.game_list span {
		font-size: 0.28rem;
		padding-top: 0.1rem;
	}
</style>
