<template>
  <div id="cover">
    <mt-header fixed title="兑换">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
      <h6 slot="right" @click="gotoCod">兑换明细</h6>
    </mt-header>
    <div class="con-wrapper">
      <div class="cover_con">
        <div class="cover_list">
          <span>兑换类型：</span>
          <select id="test" v-model="type" @change="selectCover($event)" class="selectpicker">
            <option v-for="item in options" :key="item.id" :value="item.id">{{item.name}}</option>
          </select>
        </div>
        <div class="cover_list">
          <span>兑换区域：</span>
          <select class="selectpicker" v-model="area_id" @change="selectChange($event)">
            <option
              v-for="(areaitem, index) in areaList"
              :key="index"
              :value="areaitem.id"
            >{{areaitem.name}}</option>
          </select>
        </div>
        <div class="cover_list covertext">
          <span class="span_text">
            <a>谷粒兑换时请选择区域</a>
          </span>
        </div>
        <!-- 红包兑谷分 -->
        <div v-if="type==1" class="cover_list">
          <div class="cover_red">
            <span>当前红包：</span>
            <span>{{rechargeList.hongbao}}</span>
          </div>
          <div class="cover_mi">
            <span>当前谷分：</span>
            <span>{{rechargeList.gufen}}</span>
          </div>
        </div>
        <!-- 红包兑米粒 米粒根据区域变化 -->
        <div v-if="type==2" class="cover_list">
          <div class="cover_red">
            <span>当前红包：</span>
            <span>{{rechargeList.hongbao}}</span>
          </div>
          <div class="cover_mi">
            <span>当前米粒：</span>
            <span>{{mili}}</span>
          </div>
        </div>
        <!-- 米宝兑谷分 -->
        <div v-if="type==3" class="cover_list">
          <div class="cover_red">
            <span>当前米宝：</span>
            <span>{{rechargeList.mibao}}</span>
          </div>
          <div class="cover_mi">
            <span>当前谷分：</span>
            <span>{{rechargeList.gufen}}</span>
          </div>
        </div>
        <!-- 	米宝兑米粒 米粒根据区域变化 -->
        <div v-if="type==4" class="cover_list">
          <div class="cover_red">
            <span>当前米宝：</span>
            <span>{{rechargeList.mibao}}</span>
          </div>
          <div class="cover_mi">
            <span>当前米粒：</span>
            <span>{{mili}}</span>
          </div>
        </div>
        <!-- 米宝兑红包 -->
        <div v-if="type==5" class="cover_list">
          <div class="cover_red">
            <span>当前米宝：</span>
            <span>{{rechargeList.mibao}}</span>
          </div>
          <div class="cover_mi">
            <span>当前红包：</span>
            <span>{{rechargeList.hongbao}}</span>
          </div>
        </div>
        <!-- 谷联卡兑红包 -->
        <div v-if="type==6" class="cover_list">
          <div class="cover_red">
            <span>当前谷联卡：</span>
            <span>{{rechargeList.gulian_card}}</span>
          </div>
          <div class="cover_mi">
            <span>当前红包：</span>
            <span>{{rechargeList.hongbao}}</span>
          </div>
        </div>
        <!-- 谷联卡兑谷分 -->
        <div v-if="type==7" class="cover_list">
          <div class="cover_red">
            <span>当前谷联卡：</span>
            <span>{{rechargeList.gulian_card}}</span>
          </div>
          <div class="cover_mi">
            <span>当前谷分：</span>
            <span>{{rechargeList.gufen}}</span>
          </div>
        </div>
        <div class="cover_list">
          <span>兑换数量：</span>
          <input type="text" v-model="money" name placeholder="请输入兑换数量" />
        </div>
        <div class="cover_list cover_text">
          <div class="span_text">
            <span>可兑换：</span>
            <span>{{convert.convertibleText}}</span>
          </div>
        </div>
        <div class="cover_list">
          <span>交易密码：</span>
          <input type="password" v-model="payment_password" name placeholder="请输入交易密码" />
        </div>
        <mt-button type="default" @click="Convertible">确认</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Indicator } from "mint-ui";
export default {
  components: {
    Toast,
    Indicator
  },
  data() {
    return {
      rechargeList: [], //我的资产
      area_id: 1, //默认地址id
      type: 1, //兑换类型
      areaList: [], //地址列表
      mili: "", //用户区域米粒资产
      convert: "", //用户可兑换
      money: "", //兑换金额
      payment_password: "", //交易密码
      options: [
        {
          //兑换类型
          id: 1,
          name: "红包兑谷分"
        },
        // {
        //   id: 2,
        //   name: "红包兑米粒"
        // },
        {
          id: 3,
          name: "米宝兑谷分"
        },
        // {
        //   id: 4,
        //   name: "米宝兑米粒"
        // },
        {
          id: 5,
          name: "米宝兑红包"
        },
        {
          id: 6,
          name: "谷联卡兑红包"
        },
        {
          id: 7,
          name: "谷联卡兑谷分"
        }
      ]
    };
  },
  mounted: function() {
    let that = this;
    that.getAreaList();
    that.getUserMili();
    that.getConvertible();
    that.getRecharge();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    gotoCod() {
      this.$router.push({
        path: "/converDetail"
      });
    },
    //选择区域
    selectCover(e) {
      let that = this;
      var selectIndex = Number(e.target.value);
      that.type = selectIndex;
      that.getConvertible();
    },
    //选择区域
    selectChange(e) {
      let that = this;
      var selectIndex = Number(e.target.value);
      that.area_id = selectIndex;
      that.getUserMili();
    },
    //获取地址列表
    getAreaList() {
      let that = this;
      that
        .$http({
          url: "Register/areaList",
          method: "post"
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.areaList = res.data.data;
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
    //获取用户可兑换
    getConvertible() {
      let that = this;
      that
        .$http({
          url: "Personal/convertible",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: that.area_id,
            type: that.type
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.convert = res.data.data;
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
    //获取我的资产
    getRecharge() {
      let that = this;
      that
        .$http({
          url: "Personal/rechargePage",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.rechargeList = res.data.data;
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
    //兑换
    Convertible() {
      let that = this;
      if (!that.money || that.money == null) {
        Toast("请输入兑换数量");
      } else if (!that.payment_password || that.payment_password == null) {
        Toast("请输入交易密码");
      } else {
        Indicator.open({
          text: "提交中..."
        });
        that
          .$http({
            url: "Personal/exchangeActive",
            method: "post",
            data: {
              token: localStorage.getItem("token"),
              type: that.type,
              id: that.area_id,
              money: that.money,
              payment_password: that.payment_password
            }
          })
          .then(function(res) {
            if (res.data.code == 0) {
              //成功回调
              Toast(res.data.msg);
              that.$router.go(-1);
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
    }
  }
};
</script>

<style>
#cover {
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
  background: #ef6213;
}
#cover h6 {
  font-size: 0.26rem;
  font-weight: normal;
}

.cover_con {
  width: 100%;
  padding: 0 0.2rem;
}

.cover_con .cover_list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.2rem;
}

.cover_con .cover_list select {
  flex: 1;
  height: 0.8rem;
  border: 1px solid #c8c8c8;
  border-radius: 0.1rem;
  color: #555555;
  background: #fff;
}

.cover_con .cover_list span {
  color: #333;
  font-size: 0.28rem;
  width: 1.5rem;
}

.cover_list .cover_con .cover_list span:nth-child(1) {
  padding-right: 0.1rem;
}

.cover_con .cover_list span:nth-child(3) {
  padding-left: 0.1rem;
}

.cover_con .cover_text {
  padding-top: 0.2rem;
}

.cover_con .cover_list input {
  flex: 1;
  height: 0.8rem;
  line-height: 0.8rem;
  border: 1px solid #c8c8c8;
  border-radius: 0.1rem;
  padding-left: 0.1rem;
}
.cover_con .cover_list .span_text {
  width: 100%;
  font-size: 0.24rem;
  margin-left: 1.5rem;
}
.cover_con .cover_list .span_text a,
.cover_con .cover_list .span_text span:nth-child(2) {
  color: #ef6213;
}

.cover_con .mint-button {
  position: relative;
  left: 50%;
  margin-left: -3rem;
  font-size: 0.3rem;
  width: 6rem;
  height: 0.8rem;
  color: #fff;
  margin-top: 0.3rem;
  border-radius: 0.2rem;
  background: #ef6213;
}

.address {
  flex: 1;
  /* height: 0.6rem; */
  /* margin-top: -0.3rem; */
}
</style>
