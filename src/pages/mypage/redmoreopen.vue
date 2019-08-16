<template>
  <div id="redopen">
    <mt-header fixed title="多倍拆">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <img class="banner" :src="banner" />
      <div class="red_more">
        <select v-model="area_id" @change="selectChange(area_id)">
          <option
            v-for="(areaitem, index) in areaList"
            :key="index"
            :value="areaitem.id"
          >{{areaitem.name}}</option>
        </select>
        <span @click="moreRuleFun">多倍卡规则</span>
      </div>
      <div class="cont_list" v-for="item in moreList" :key="item.id">
        <div class="cont_list_top">
          <p>红包{{item.multiple}}倍卡</p>
          <p>参与人数</p>
        </div>
        <div class="cont_list_btm">
          <div>
            <img src="../../assets/img/many.png" />
            <b>{{item.multiple}}倍</b>
          </div>
          <div>
            <span>{{item.join_person}}/{{item.person}}</span>
          </div>
          <div>
            <button
              v-show="item.status == 0"
              :class="item.is_join == 1?'already_btn':''"
              :disabled="item.status == 1"
              @click="playGameFun(item.id)"
            >{{item.is_join == 1?'已经参与':'点击参与'}}</button>
            <button v-show="item.status == 1" class="already_btn">活动结束</button>
          </div>
        </div>
      </div>
    </div>
    <x-dialog v-model="moreRule" class="de_dialog lang_dialog" hide-on-blur>
      <div class="dialog">
        <span class="iconfont icon-tabguanbi" @click="closeDialog"></span>
        <h4>多倍卡规则</h4>
        <div class="dialog_cont" v-html="moreRuleCont"></div>
        <button @click="closeDialog">确定</button>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { XNumber, XInput, XDialog } from "vux";
import { Toast, Indicator } from "mint-ui";
export default {
  components: {
    XNumber,
    XInput,
    XDialog,
    Toast,
    Indicator
  },
  data() {
    return {
      banner: "", //banner
      areaList: [], //地址列表
      area_id: 1, //默认地址id
      moreRule: false, // 多倍卡规则弹窗
      moreRuleCont: "", // 多倍卡规则
      moreList: "" // 多倍卡列表
    };
  },
  created() {},
  mounted() {
    this.getAreaList();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //获取地址列表和图片
    getAreaList() {
      let that = this;
      that
        .$http({
          url: "hong_baonew/multiplePage",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.areaList = res.data.data.area;
            that.banner = res.data.data.duobei_banner;
            that.moreList = res.data.data.list;
          } else {
            //失败
            Toast(res.data.msg);
          }
        })
        .catch(function(error) {
          Toast({
            message: "网络连接失败",
            position: "bottom",
            duration: 5000
          });
        });
      that
        .$http({
          url: "hong_baonew/multipleRule",
          method: "post"
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.moreRuleCont = res.data.data;
          } else {
            Toast(res.data.msg);
          }
        });
    },
    selectChange(index) {
      this.area_id = index;
      this.getMoreList(index);
    },
    moreRuleFun() {
      this.moreRule = true;
    },
    closeDialog() {
      this.moreRule = false;
    },
    getMoreList(id) {
      // 根据区域查询红包活动
      let that = this;
      that
        .$http({
          url: "hong_baonew/multipleList",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            area_id: id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.moreList = res.data.data.list;
          } else {
            //失败
            Toast(res.data.msg);
          }
        })
        .catch(function(error) {
          Toast({
            message: "网络连接失败",
            position: "bottom",
            duration: 5000
          });
        });
    },
    playGameFun(id) {
      // 参与活动
      let that = this;
      that
        .$http({
          url: "hong_baonew/multipleBuy",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            Toast(res.data.msg);
            that.getMoreList(that.area_id);
          } else {
            //失败
            Toast(res.data.msg);
          }
        })
        .catch(function(error) {
          Toast({
            message: "网络连接失败",
            position: "bottom",
            duration: 5000
          });
        });
    }
  }
};
</script>

<style scoped="scoped">
#redopen {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.con-wrapper {
  position: fixed;
  width: 100%;
  height: calc(100% - 0.8rem);
  overflow-x: hidden;
  overflow-y: scroll;
  top: 0.8rem;
  z-index: 1000;
  font-size: 0;
  background: #f4f4f4;
}
.banner {
  width: 100%;
}
.red_more {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  align-items: center;
  -webkit-align-items: center;
  width: 100%;
  padding: 0.2rem;
  position: relative;
  background: white;
}
.red_more select {
  width: 3rem;
  height: 0.6rem;
  border: 1px solid #c8c8c8;
  color: rgba(164, 164, 164, 1);
  box-shadow: 0px 1px 2px 1px rgba(215, 215, 215, 1);
  border-radius: 1rem;
  background: white;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  padding: 0 0.28rem 0.05rem 0.1rem;
  line-height: 0.6rem;
  background: url("../../assets/img/downArrows.png") no-repeat 2.7rem center /
    0.2rem 25%;
}
.red_more select option {
  line-height: 0.6rem !important;
}
.red_more span {
  width: 1.6rem;
  height: 0.6rem;
  line-height: 0.6rem;
  border-radius: 0.6rem 0px 0px 0.6rem;
  background-color: rgba(239, 98, 19, 1);
  color: rgba(255, 255, 255, 1);
  font-size: 0.24rem;
  text-align: center;
}
.cont_list {
  margin-bottom: 0.2rem;
  padding: 0.2rem 0;
  background: white;
}
.cont_list_top {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
  align-items: center;
  -webkit-align-items: center;
}
.cont_list_top p {
  width: 33.3%;
  text-align: center;
  line-height: 0.4rem;
  color: rgba(32, 32, 32, 1);
  font-size: 0.28rem;
  font-weight: 900;
}
.cont_list_btm {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
  justify-content: space-around;
  -webkit-justify-content: space-around;
  align-items: center;
  -webkit-align-items: center;
}
.cont_list_btm div {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  -webkit-flex-direction: column;
  justify-content: space-around;
  -webkit-justify-content: space-around;
  align-items: center;
  -webkit-align-items: center;
  width: 33.3%;
  height: 1.5rem;
  text-align: center;
  border-right: 1px solid rgba(230, 230, 230, 1);
  position: relative;
}
.cont_list_btm div:nth-last-child(1) {
  border-right: 0 none;
}

.cont_list_btm div img {
  width: 1.2rem;
  height: 1.2rem;
}
.cont_list_btm div b {
  position: absolute;
  top: 0.3rem;
  left: 1rem;
  font-size: 0.24rem;
  font-style: normal;
  color: #fff;
}
.cont_list_btm div span {
  line-height: 0.4rem;
  color: rgba(51, 51, 51, 1);
  font-size: 0.32rem;
}
.cont_list_btm div button {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  outline: 0 none;
  border: 0 none;
  line-height: 0.36rem;
  background-color: rgba(247, 94, 99, 1);
  color: rgba(255, 255, 255, 1);
  font-size: 0.32rem;
  text-align: center;
  box-shadow: 1px 2px 3px 1px rgba(251, 192, 192, 1);
  padding: 0.2rem;
}
.cont_list_btm div .already_btn {
  background-color: rgb(133, 133, 133);
  box-shadow: 1px 2px 3px 1px rgb(228, 228, 228);
}

.dialog {
  width: 90%;
  margin: 0 auto;
  /* height: 5rem; */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.2rem 0;
}
.dialog span.iconfont {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
}
.dialog h4 {
  font-size: 0.3rem;
  font-weight: normal;
  margin-bottom: 0.4rem;
}
.dialog .dialog_cont {
  overflow-x: hide;
  overflow-y: scroll;
  font-size: 0.28rem;
  height: 4rem;
  text-align: justify;
  line-height: 1.4;
  color: #333;
}
.dialog button {
  width: 50%;
  height: 0.6rem;
  background: #ef6213;
  color: #fff;
  margin-top: 0.2rem;
  border: none;
  border-radius: 0.1rem;
}
</style>
