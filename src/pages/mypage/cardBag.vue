<template>
  <div id="cardBag">
    <mt-header fixed title="卡包">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="card_con">
        <div class="lingy_card">
          <div class="card_head">
            <span>领养卡</span>
            <span @click="lookAll">查看全部({{adoptNum}})</span>
          </div>
          <div class="card_list">
            <div
              class="card"
              v-for="(adoptitem,index) in adopt"
              :key="index"
              @click="gotoBlac(adoptitem.id)"
              :class="{'card_1':adoptitem.type == 1, 'card_2':adoptitem.type == 2, 'card_3':adoptitem.type == 3}"
            >
              <div class="card-tit">
                <span>{{adoptitem.title}}</span>
                <span>{{adoptitem.number}}</span>
              </div>
              <div class="card-address">
                <h5>基地地址：{{adoptitem.address}}</h5>
                <span>领养时间：{{adoptitem.time}}</span>
              </div>
              <div class="card_time">
              </div>
            </div>
          </div>
        </div>
        <div class="huiyuan_card">
          <div class="card_head">
            <span>会员卡</span>
            <h3 class="card_add" @click="gotoMem">+</h3>
          </div>
          <div class="card_list">
            <div class="card" @click="gotoMeDe">
              <div class="card_num">
                <span>{{member_card.card_number}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="gulian_card">
          <div class="card_head">
            <span>谷联卡</span>
            <h3 class="card_add" @click="gotogul">+</h3>
          </div>
          <div class="card_list">
            <div class="card" @click="gotoGul">
              <div class="card_num">
                <span>{{gulian_card.card_number}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast } from "mint-ui";
export default {
  components: {
    Indicator,
    Toast
  },
  data() {
    return {
      allAdopt: [], //全部领养卡
      adopt: [], //领养卡
      adoptNum: "", //领养卡个数
      member_card: [], //会员卡
      gulian_card: [], //谷联卡
      adoptIndex: "" //显示条数
    };
  },
  mounted: function() {
    let that = this;
    that.getAdoptCard();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },

    gotoBlac(id) {
      let that = this;
      that.$router.push({
        path: "/blackDetail",
        query: {
          id: id
        }
      });
    },
    //查看全部
    lookAll() {
      let that = this;
      that.adopt = that.allAdopt; // 查看全部 赋值
    },
    //新办会员卡
    gotoMem() {
      this.$router.push({
        path: "/addmember",
        query: {
          cadindex: 0
        }
      });
    },
    //新办谷联卡
    gotogul() {
      this.$router.push({
        path: "/addmember",
        query: {
          cadindex: 1
        }
      });
    },
    gotoMeDe() {
      this.$router.push({
        path: "/memberDetail"
      });
    },
    gotoGul() {
      this.$router.push({
        path: "/gulianDetail"
      });
    },
    //获取卡包
    getAdoptCard() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "card_bag/adoptCard",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.allAdopt = res.data.data.adopt; // 存全部卡
            for (let i = 0; i < res.data.data.adopt.length; i++) {
              if (i < 3) {
                that.adopt.push(res.data.data.adopt[i]); // 存进来时展示的
              }
            }
            that.member_card = res.data.data.member_card;
            that.gulian_card = res.data.data.gulian_card;
            that.adoptNum = that.allAdopt.length;
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
};
</script>

<style scoped="scoped">
#cardBag {
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
}

.mint-header {
  background: #ef6213;
}

.card_con {
  width: 100%;
  padding: 0 0.2rem;
}

.card_head {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
  font-size: 0.26rem;
}

.card_head span:nth-child(2) {
  font-size: 0.24rem;
}

.card {
  width: 100%;
  height: 2.5rem;
  padding: 0.2rem;
  border-radius: 0.1rem;
  color: #fff;
  margin-bottom: 0.2rem;
  /* display: flex;
  display: -webkit-flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-justify-content: space-between;
  justify-content: space-between; */
  position: relative;
}
.card_1 {
  background: url("../../assets/img/ruralCard.png") 0 0 no-repeat / 100% 100%;
}
.card_2 {
  background: url("../../assets/img/orchardCard.png") 0 0 no-repeat / 100% 100%;
}
.card_3 {
  background: url("../../assets/img/pastureCard.png") 0 0 no-repeat / 100% 100%;
}

.card_huang {
  background: #eddaa8;
}

.card_jin {
  background: #d4b650;
}

.huiyuan_card .card {
  background: url("../../assets/img/vipCard.png") 0 0 no-repeat / 100% 100%;
}

.huiyuan_card h4,
.gulian_card h4 {
  text-align: center;
  font-size: 0.36rem;
  font-weight: normal;
}

.huiyuan_card .card_add,
.gulian_card .card_add {
  font-size: 0.4rem;
  color: #ef6213;
}

.gulian_card .card {
  background: url("../../assets/img/glCard.png") 0 0 no-repeat / 100% 100%;
}

.card .card-tit {
  font-size: 0.26rem;
  line-height: 0.26rem;
  display: flex;
  display: -webkit-flex;
  -webkit-justify-content: space-between;
  justify-content: space-between;
}

.card .card-tit span:nth-child(2) {
  margin-left: 1rem;
}
.card-address {
  margin-top: 0.5rem;
}
.card-address h5 {
  font-weight: normal;
  font-size: 0.24rem;
  line-height: 0.28rem;
}
.card-address span {
  font-weight: normal;
  font-size: 0.24rem;
  line-height: 0.28rem;
}

.card .card_time {
  text-align: right;
  font-size: 0.24rem;
  color: white;
}
.card_num {
  position: absolute;
  right: 0.2rem;
  bottom: 0.2rem;
  font-size: 0.24rem;
  line-height: 0.24rem;
  color: #c39b5a;
}
</style>
