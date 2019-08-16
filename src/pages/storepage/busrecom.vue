<template>
  <div id="busrecom">
    <mt-header fixed title="我的推广码">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="black_con">
        <div class="black_list">
          <span>我的推广码</span>
          <span>02013</span>
        </div>
        <div class="black_list">
          <span>我的二维码</span>
          <img src="../../assets/img/erw.jpg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    }
  }
};
</script>

<style scoped="scoped">
#busrecom {
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
  background: #ef6213;
}

.mint-header p {
  position: absolute;
  right: 0.3rem;
  top: 0.26rem;
  width: 0.44rem;
}

.black_con {
  width: 90%;
  margin: 0 auto;
  margin-top: 0.3rem;
}

.black_list {
  font-size: 0.28rem;
  padding: 0.1rem 0;
  color: #555;
  display: flex;
}

.black_list span:nth-child(1) {
  display: inline-block;
  width: 26%;
}
.black_list img {
  width: 50%;
  height: 50%;
}
.dialog {
  width: 100%;
  height: 4rem;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-top: 0.4rem;
}
.dialog span:nth-child(1) {
  position: absolute;
  right: 0.2rem;
  top: 0.2rem;
}
.dialog img {
  /* width: 70%; */
  padding: 0.2rem 0;
}
.dialog span:nth-child(4) {
  color: #ef6213;
}
</style>
