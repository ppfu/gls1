<template>
  <div id="yipinyidi">
    <mt-header fixed title="一品一地">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
      <p slot="right" @click="gotoRecord">记录</p>
    </mt-header>
    <div class="con-wrapper">
      <div class="yipin_se">
        <select class="selectpicker" v-model="area_id" @change="selectChange($event)">
          <option
            v-for="(areaitem, index) in areaList"
            :key="index"
            :value="areaitem.id"
          >{{areaitem.name}}</option>
        </select>
        <div class="search">
          <input
            type="search"
            placeholder="请输入名称进行搜索"
            style="border: 1px solid #c8c8c8; color: #333;"
            @blur="onRefresh"
            v-model="name"
          />
          <button :disabled="name == ''" @click="onRefresh">
            <i class="iconfont icon-tabsearch"></i>
          </button>
        </div>
      </div>
      <div class="scroll_div">
        <van-pull-refresh
          v-model="updateLoading"
          pulling-text="下拉刷新"
          loosing-text="释放更新"
          loading-text="正在加载..."
          @refresh="onRefresh"
        >
          <van-list v-model="moreloading" :finished="finished" :immediate-check="false" finished-text="————— 已经没有更多了 —————" @load="onLoad">
              <div class="yipin">
                <div class="yipin_list" v-for="(subitem,index) in subscribe" :key="index">
                  <div
                    class="yipin_img"
                    @click="goDetailFun(subitem.id, subitem.spend, subitem.img, subitem.title, subitem.number)"
                  >
                    <img :src="subitem.img" />
                  </div>
                  <div class="yipin_con">
                    <div @click="goDetailFun(subitem.id, subitem.spend, subitem.img, subitem.title, subitem.number)">
                      <h4 class="yipin_title">{{subitem.title}}</h4>
                      <div class="spend">
                        <span>单价:</span>
                        <span>{{subitem.spend}} 元</span>
                      </div>
                      <h5 class="yipin_time">出售时间：{{subitem.sell_time}}</h5>
                    </div>
                    <div class="yipin_btm">
                      <van-stepper
                        v-model="subitem.number"
                        :min="1"
                        input-width="1rem"
                        button-size="0.32rem"
                      />
                      <button
                        class="yi_btn"
                        :class="subitem.is_active == 0?'yi_btn_active':''"
                        :disabled="subitem.is_active == 0"
                        type="primary"
                        @click="goDetailFun(subitem.id, subitem.spend, subitem.img, subitem.title, subitem.number)"
                      >预定</button>
                    </div>
                  </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
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
      pageindex: 1,
      name: "", //搜索名称
      subscribe: [], //一品一地数据,
      subscribeTotal: 0, // 店铺总数量
      area_id: this.$store.state.ypydId, //默认地址id
      areaList: [], //地址列表
      updateLoading: false, //下拉刷新
      moreloading: false, // 加载更多
      finished: false // 全部加载
    };
  },
  mounted: function() {
    let that = this;
    that.getSubscribe();
    that.getAreaList();
  },
  methods: {
    back() {
      this.$router.push({
        path: "/tabs/index"
      });
    },
    gotoRecord() {
      this.$router.push({
        path: "/reserecord"
      });
    },
    //下拉刷新
    onRefresh() {
      let that = this;
      that.updateLoading = true;
      that.moreloading = false;
      that.finished = false;
      that.pageindex = 1;
      that.subscribe = [];
      that.subscribeTotal = 0;
      that.getSubscribe(0);
    },
    //上拉加载更多
    onLoad() {
      let that = this;
      that.pageindex += 1;
      that.moreloading = true;
      that.getSubscribe(1);
    },
    //选择区域
    selectChange(i) {
      let that = this;
      that.area_id = Number(i.target.value);
      that.$store.commit("ypydIdFun", that.area_id);
      that.loading = false;
      that.nif = false;
      that.pageindex = 1;
      that.subscribe = [];
      that.getSubscribe(1);
    },
    //获取一品一地列表
    getSubscribe(type) {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Subscribe/index",
          method: "post",
          data: {
            area_id: that.area_id,
            name: that.name,
            p: that.pageindex
          }
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            if (type == 0) {
              if (res.data.data.list.length > 0) {
                that.subscribe = res.data.data.list;
                that.subscribeTotal = res.data.data.count;
                if (that.subscribe.length >= that.subscribeTotal) {
                  //全部数据已加载
                  that.finished = true;
                }
              } else {
                that.finished = true;
              }
              that.updateLoading = false;
            } else {
              that.moreloading = false;
              if (res.data.data.list.length > 0) {
                that.subscribe = that.subscribe.concat(res.data.data.list);
                that.subscribeTotal = res.data.data.count;
              } else {
                that.finished = true;
              }
              if (that.subscribe.length >= that.subscribeTotal) {
                //全部数据已加载
                that.finished = true;
              }
            }
          } else {
            //失败
            Toast(res.data.msg);
          }
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
            that.areaList = res.data.data;
          } else {
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
    //预定
    reserve(id, price, number, img, title) {
      var arr = {
        goods_id: id, //商品id
        img: img, //商品图片
        number: number, //数量
        title: title, //名字
        price: price // 价格
      };
      sessionStorage.setItem("orderList", JSON.stringify(arr));
      this.$router.push({
        path: "/yipinclose",
        query: {
          id: id
        }
      });
    },
    goDetailFun(id, price, img, title, number) {
      sessionStorage.setItem("shopImg", img);
      sessionStorage.setItem("shopName", title);
      this.$router.push({
        path: "/yipindetail",
        query: {
          id: id,
          price: price,
          number: number
        }
      });
    }
  }
};
</script>

<style scoped="scoped">
#yipinyidi {
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

.yipin_se {
  display: flex;
  display: -webkit-flex;
  width: 100%;
  margin: 0 auto;
  padding: 0.2rem 0.2rem 0;
  position: relative;
}
.scroll_div {
  width: 100%;
  margin: 0 auto;
  padding: 0 0.2rem;
}
.yipin_se select {
  width: 2rem;
  height: 0.6rem;
  border: 1px solid #c8c8c8;
  border-radius: 1rem;
  color: #333;
  background: white;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  padding: 0 0.28rem 0.05rem 0.1rem;
  line-height: 0.6rem;
  background: url("../../assets/img/downArrows.png") no-repeat 1.7rem center /
    0.2rem 25%;
}
.yipin_se select option {
  line-height: 0.6rem !important;
}

.search {
  position: relative;
  margin-left: 0.2rem;
  width: 100%;
  top: 0;
  left: 0;
}
.search input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

.yipin_list {
  margin: 0.2rem 0;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  align-items: center;
  -webkit-align-items: center;
}
.yipin_img {
  width: 2rem;
  height: 2rem;
}
.yipin_img img {
  width: 2rem;
  height: 2rem;
}

.yipin_con {
  margin-left: 0.2rem;
  height: 2rem;
  width: 4.9rem;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  -webkit-flex-direction: column;
  justify-content: space-between;
  -webkit-justify-content: space-between;
}

.yipin_title {
  font-size: 0.28rem;
  color: #333;
}
.yipin_time {
  font-weight: normal;
  /* line-height: 0.6rem; */
  color: #555;
}

.spend span {
  font-size: 0.26rem;
  color: #666;
}

.spend span:nth-child(2) {
  padding-right: 0.2rem;
  color: #ef6213;
}

.yipin_btm {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  align-items: center;
  -webkit-align-items: center;
}
.yi_btn {
  width: 1.5rem;
  height: 0.56rem;
  border: none;
  background: #ef6213;
  color: #fff;
  font-size: 0.26rem;
  border-radius: 0.1rem;
}
.yi_btn_active {
  background: #c8c8c8;
}
.yipin_list .mint-button--normal {
  padding: 0 0.4rem;
}
/* 暂无数据 */
#no-data {
  width: 100%;
  text-align: center;
  padding-top: 2rem;
  transition: all 0.2s;
}

#no-data > img {
  width: 40%;
  height: auto;
}
</style>
