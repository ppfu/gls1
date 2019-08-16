<template>
  <div id="my">
    <mt-header fixed title="我的">
      <img src="../../assets/img/shezhi.png" slot="right" @click="gotoSet" />
    </mt-header>
    <div class="con-wrapper">
      <div class="content">
        <div class="head-por">
          <img src="../../assets/img/logo.jpg" />
          <div class="daiyan_wrap">
            <p>{{myInfo.name}}</p>
            <div class="daiyan">
              <img v-if="myInfo.upgrade==0" src="../../assets/img/putong.png" />
              <img v-if="myInfo.upgrade==1" src="../../assets/img/jinpai.png" />
              <span v-if="myInfo.upgrade==0">普通代言人</span>
              <span v-if="myInfo.upgrade==1">金牌代言人</span>
            </div>
          </div>
          <p>{{myInfo.account}}</p>
        </div>
        <div class="my-content">
          <div class="my-btn">
            <span class="rech flag" @click="gotoRech">充值</span>
            <span class="with flag" @click="gotoWith">提现</span>
            <span class="con flag" @click="gotoCon">兑换</span>
          </div>
          <div class="balance">
            <h4>余额</h4>
            <span>总余额(元)</span>
            <span>{{myInfo.balance}}</span>
          </div>
          <div class="balance">
            <div class="ba_tit">
              <h4>农场总值</h4>
            </div>
            <div class="ba_list">
              <div class="ba_list1">
                <span>总谷分：</span>
                <span>{{myInfo.gufen}}</span>
              </div>
              <div class="ba_list2">
                <span>总谷粒：</span>
                <span>{{myInfo.guli}}</span>
              </div>
            </div>
            <div class="ba_list">
              <div class="ba_list1">
                <span>总米粒：</span>
                <span>{{mili}}</span>
              </div>
              <div class="ba_list2">
                <select class="selectpicker" v-model="area_id" @change="selectChange($event)">
                  <option v-for="area in area" :key="area.id" :value="area.id">{{area.name}}</option>
                </select>
              </div>
            </div>
            <div class="ba_list">
              <span>总米宝：{{myInfo.mibao}}</span>
            </div>
            <!--   <div class="stat">
              <div class="stat_list">
                <span>年代售券</span>
                <span>4%</span>
              </div>
              <div class="stat_list">
                <span>昨日代售券（元）</span>
                <span>1.05</span>
              </div>
              <div class="stat_list">
                <span>累计代售券（元）</span>
                <span>15.00</span>
              </div>
            </div>-->
          </div>
          <div class="balance">
            <div class="ba_tit">
              <h4>红包</h4>
              <span @click="gotoRed">明细>></span>
            </div>
            <div class="ba_list">
              <div class="ba_list1">
                <span>红包余额：</span>
                <span>{{myInfo.hongbao_balance}}</span>
              </div>
              <div class="ba_list2 ba_list6">
                <span @click="gotoReceive">所领红包：{{myInfo.hongbao_number}}个</span>
              </div>
            </div>
            <div class="ba_list">
              <div class="ba_list1">
                <span>实拆金额：</span>
                <span>{{myInfo.hongbao_all}}</span>
              </div>
              <div class="ba_list1">
                <span>实拆个数：{{myInfo.open_number}}个</span>
              </div>
            </div>
          </div>
          <div class="balance">
            <div class="ba_tit">
              <h4>推广收益</h4>
              <span @click="gotoGen">明细>></span>
            </div>
            <div class="ba_list3">
              <span>收益：</span>
              <span>{{myInfo.extension}}</span>
            </div>
          </div>
          <div class="balance">
            <div class="ba_tit" @click="gotoCad">
              <h4>卡包</h4>
              <img src="../../assets/img/more.png" />
            </div>
          </div>
          <div class="balance">
            <div class="ba_tit" @click="gotoOrch">
              <h4>我的果园</h4>
              <img src="../../assets/img/more.png" />
            </div>
          </div>
          <div class="balance">
            <div class="ba_tit" @click="gotoRural">
              <h4>我的田园</h4>
              <img src="../../assets/img/more.png" />
            </div>
          </div>
          <div class="balance">
            <div class="ba_tit" @click="gotoPasture">
              <h4>我的牧场</h4>
              <img src="../../assets/img/more.png" />
            </div>
          </div>
          <div class="balance">
            <div class="ba_tit" @click="gotoVote">
              <h4>投票</h4>
              <img src="../../assets/img/more.png" />
            </div>
          </div>
          <div id="myGroup" class="balance">
            <div class="ba_tit" @click="gotoGru">
              <h4>我的团队</h4>
              <img src="../../assets/img/more.png" />
            </div>
          </div>
          <div class="balance">
            <div class="ba_tit" @click="gotoReco">
              <h4>推广有礼</h4>
              <img src="../../assets/img/more.png" />
            </div>
          </div>
          <div class="balance">
            <div class="ba_tit" @click="gotoEnter">
              <h4>商家入驻</h4>
              <img src="../../assets/img/more.png" />
            </div>
          </div>
          <div class="balance">
            <div class="ba_tit" @click="gotoSupe">
              <h4>超市入驻</h4>
              <img src="../../assets/img/more.png" />
            </div>
          </div>
          <div class="balance">
            <div class="ba_tit" @click="gotoTrav">
              <h4>实地旅游</h4>
              <img src="../../assets/img/more.png" />
            </div>
          </div>
          <div class="balance">
            <div class="ba_tit" @click="gotoContact">
              <h4>联系客服</h4>
              <img src="../../assets/img/more.png" />
            </div>
          </div>
          <div class="balance">
            <div class="ba_tit" @click="gotoAbout">
              <h4>关于我们</h4>
              <img src="../../assets/img/more.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  components: {},
  data() {
    return {
      area_id: "", //用户默认区域id
      area: [], //区域列表
      myInfo: [],
      mili: "" //米粒
    };
  },
  created() {
    this.getMyInfo();
    // this.getUserMili();
  },
  methods: {
    //选择区域
    selectChange(e) {
      let that = this;
      var selectIndex = Number(e.target.value);
      that.area_id = selectIndex;
      that.getUserMili(); //获取我的信息
    },
    //获取登录信息
    getMyInfo() {
      let that = this;
      that
        .$http({
          url: "Personal/index",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.myInfo = res.data.data;
            that.area_id = res.data.data.area_id; //用户默认区域id
            that.area = res.data.data.area; //区域列表
            that.mili = res.data.data.mili;
          } else {
            // Toast("登录失败请重新登录");
            // that.$router.push({
            //   path: "/"
            // });
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
    //获取用户区域米粒资产
    getUserMili() {
      let that = this;
      that
        .$http({
          url: "Personal/userMili",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: that.area_id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.mili = res.data.data;
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

    back() {
      this.$router.go(-1); //返回上一层
    },
    onScroll(pos) {
      this.scrollTop = pos.top;
    },
    gotoSet() {
      this.$router.push({
        path: "/setting"
      });
    },
    gotoRech() {
      this.$router.push({
        path: "/recharge"
      });
    },
    gotoWith() {
      this.$router.push({
        path: "/withdraw"
      });
    },
    gotoCon() {
      this.$router.push({
        path: "/conver"
      });
    },
    gotoFad() {
      this.$router.push({
        path: "/farmDetail"
      });
    },
    gotoVote() {
      this.$router.push({
        path: "/vote"
      });
    },
    gotoRed() {
      this.$router.push({
        path: "/redpacket"
      });
    },
    gotoGen() {
      this.$router.push({
        path: "/generDetail"
      });
    },
    gotoCad() {
      this.$router.push({
        path: "/cardBag"
      });
    },
    gotoOrch() {
      this.$router.push({
        path: "/orchard"
      });
    },
    gotoRural() {
      this.$router.push({
        path: "/rural"
      });
    },
    gotoPasture() {
      this.$router.push({
        path: "/pasture"
      });
    },
    gotoGru() {
      this.$router.push({
        path: "/myGroup"
      });
    },
    gotoReco() {
      this.$router.push({
        path: "/recommend"
      });
    },
    gotoEnter() {
      this.$router.push({
        path: "/busEnter"
      });
    },
    gotoSupe() {
      this.$router.push({
        path: "/superEnter"
      });
    },
    gotoTrav() {
      this.$router.push({
        path: "/travel",
        query: {
          travelIndex: 0
        }
      });
    },
    gotoContact() {
      this.$router.push({
        path: "/contactSer"
      });
    },
    gotoAbout() {
      this.$router.push({
        path: "/aboutUs"
      });
    },
    gotoReceive() {
      this.$router.push({
        path: "/receiveRed"
      });
    }
  }
};
</script>

<style scoped="scoped">
.mint-header {
  position: relative;
  background: #ef6213;
}

.mint-header img {
  position: absolute;
  right: 0.2rem;
  top: 0.2rem;
  width: 0.44rem;
}

.start {
  cursor: pointer;
}

.end {
  cursor: pointer;
  color: #fff;
  background: #b1b0b0;
  border: none;
}

#my {
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
  top: 0.8rem;
}

.head-por {
  width: 150%;
  height: 3rem;
  border-radius: 0 0 100% 100%;
  background: #ef6213;
  margin-left: -25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 0.28rem;
  line-height: 0.4rem;
}

.head-por img {
  border-radius: 50%;
  width: 1.6rem;
  margin: 0.1rem 0;
}
.head-por p:nth-child(3) {
  margin-top: 0.1rem;
}
.daiyan_wrap {
  position: relative;
}
.daiyan {
  position: absolute;
  color: white;
  top: 0;
  margin-left: 1.2rem;
  width: 2.5rem;
  height: 0.4rem;
  display: flex;
  align-items: center;
}
.daiyan img {
  width: 0.5rem;
  height: 0.5rem;
  margin-right: 0.1rem;
  /* background: white; */
}

.my-content {
  width: 100%;
  padding: 0.2rem;
}

.my-content .my-btn {
  display: flex;
  justify-content: space-around;
}

.my-content .my-btn .mint-button {
  height: 0.54rem;
  font-size: 0.26rem;
  background: none;
}

.my-btn span {
  border: 1px solid #e5e5e5;
  padding: 0.08rem 0.4rem;
  font-size: 0.26rem;
  border-radius: 0.1rem;
}

.balance {
  padding: 0.2rem 0;
  border-bottom: 1px solid #e9e9e9;
}
.balance:nth-last-child(1) {
  border-bottom: 0 none;
}

.balance h4 {
  font-size: 0.28rem;
  font-weight: 600;
  color: #000;
  padding: 0.05rem 0;
}

.balance span {
  font-size: 0.24rem;
  color: #333;
}

.balance span:nth-child(3) {
  padding-left: 0.1rem;
}

.balance .ba_tit {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.balance .ba_tit span {
  font-size: 0.24rem;
  color: #ef6213;
}

.balance .ba_list {
  padding: 0.1rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.balance .ba_list .ba_list2 select {
  border: 1px solid #c9c9c9;
  color: #666;
  font-size: 0.24rem;
  height: 0.44rem;
  border-radius: 0.1rem;
  background: #fff;
}

.balance .ba_list .ba_list6 span {
  color: #ef6213;
}

.balance .stat {
  padding-top: 0.1rem;
  display: flex;
  justify-content: space-between;
}

.balance .stat .stat_list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.balance .stat .stat_list span:nth-child(2) {
  padding-top: 0.08rem;
}

.balance .ba_tit img {
  width: 0.32rem;
}
</style>
