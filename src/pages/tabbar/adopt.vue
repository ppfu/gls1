<template>
  <div id="adopt">
    <mt-header fixed title="领养">
      <span slot="right" @click="gotoRecored">记录</span>
    </mt-header>
    <div class="con-wrapper">
      <tab :line-width="2" bar-active-color="#ef6213" active-color="#ef6213" :scroll-threshold="5">
        <tab-item
          @on-item-click="tabindex=0"
          @click.native="onItemFun(0)"
          :selected="tabindex==0"
        >田园</tab-item>
        <tab-item
          @on-item-click="tabindex=1"
          @click.native="onItemFun(1)"
          :selected="tabindex==1"
          id="tabtow"
        >果园</tab-item>
        <tab-item
          @on-item-click="tabindex=2"
          @click.native="onItemFun(2)"
          :selected="tabindex==2"
        >牧场</tab-item>
      </tab>
      <div class="tab-swiper vux-center">
        <div class="fruit" v-show="data.length != 0">
          <div class="fruit_list" v-for="(item,itemIndex) in data" :key="itemIndex">
            <div class="fruit_img">
              <img :src="item.head_img" alt />
              <span>{{item.phase}}</span>
            </div>
            <div class="fruit_con">
              <div class="fruit_title">
                <div>
                  <h4>{{item.title}}</h4>
                  <h5>预计代售券 {{item.bonus}}</h5>
                  <div class="mian">
                    <span>单价: {{item.price}} 米宝</span>
                    <span>{{item.surplus}}</span>
                  </div>
                  <div class="qixian">
                    <span>期限</span>
                    <span>{{item.term}}</span>
                  </div>
                </div>
                <div class="leixing">
                  <p
                    @click="selectChange(typeItem.id, itemIndex, item)"
                    :class="typeItem.id == item.mold_id?'active_type':''"
                    v-for="typeItem in item.type"
                    :key="typeItem.id"
                  >{{typeItem.name}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="not_open" v-show="data.length == 0">暂未开放</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Indicator } from "mint-ui";
// import { PullRefresh } from "vant";
import { Tab, TabItem } from "vux";
// Vue.use(Vant);
export default {
  components: {
    Tab,
    TabItem,
    Indicator
  },
  data() {
    return {
      selected: this.$route.query.tabindex,
      tabindex: this.$route.query.tabindex,
      scrollTop: 0,
      onFetching: false,
      // bottomCount: 20,
      data: [],
      data1: [],
      data2: [],
      data3: [],
      type: "",
      mold_id: 0,
      mold: [
        {
          id: 0,
          name: "领养到家"
        },
        {
          id: 1,
          name: "委托代售"
        }
      ]
    };
  },

  created: function() {
    this.getAdoptList(1);
    this.getAdoptList(2);
    this.getAdoptList(3);
  },

  mounted: function() {},
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //类型 选择方式 //前往领养详情页
    selectChange(type_id, itemIndex, item) {
      this.data[itemIndex].mold_id = type_id;
      this.$router.push({
        path: "/adoptDetail",
        query: {
          storeId: item.id,
          name: item.type[item.mold_id].name,
          tabindex: this.tabindex
        }
      });
    },
    onItemFun(index) {
      this.tabindex = index;
      if (index == 0) {
        this.data = this.data1;
      } else if (index == 1) {
        this.data = this.data2;
      } else if (index == 2) {
        this.data = this.data3;
      }
    },
    //前往记录页
    gotoRecored() {
      let that = this;
      that.$router.push({
        path: "/adoptRecord",
        query: {
          tabindex: that.tabindex
        }
      });
    },
    //获取田园列表
    getAdoptList(type) {
      let that = this;
      Indicator.open({
        text: "数据加载中..."
      });
      that
        .$http({
          url: "Adopt/index",
          method: "post",
          data: {
            type: type
          }
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            var list = [];
            $.each(res.data.data, function(index, item) {
              item["type"] = that.mold;
              item["mold_id"] = that.mold_id;
            });
            if (type == 1) {
              that.data1 = res.data.data;
            } else if (type == 2) {
              that.data2 = res.data.data;
            } else if (type == 3) {
              that.data3 = res.data.data;
            }
            if (that.$route.query.tabindex == 0) {
              that.data = that.data1;
            } else if (that.$route.query.tabindex == 1) {
              that.data = that.data2;
            } else if (that.$route.query.tabindex == 2) {
              that.data = that.data3;
            }
          } else {
            Toast(res.data.msg);
          }
        })
        .catch(function(error) {
          Indicator.close();
        });
    }
  }
};
</script>

<style scoped="scoped">
#adopt {
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

.mint-header {
  background: #ef6213;
}

.fruit {
  /* padding-top: 0.1rem; */
  width: 100%;
  padding: 0.2rem;
}

.fruit_list {
  display: flex;
  margin-bottom: 0.2rem;
  align-items: center;
}

.fruit_list .fruit_img {
  width: 2rem;
  height: 2rem;
  position: relative;
}

.fruit_img span {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.5);
  color: #ef6213;
  font-size: 0.26rem;
  padding: 4px 0;
  text-align: center;
}

.fruit_list .fruit_img img {
  width: 100%;
  height: 100%;
}

.fruit_list .fruit_con {
  margin-left: 0.2rem;
  flex: 1;
}

.fruit_list .fruit_con .fruit_title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fruit_list .fruit_con .fruit_title h4 {
  font-size: 0.28rem;
  color: #333;
}
.fruit_list .fruit_con h5 {
  font-weight: normal;
  color: #555;
  font-size: 0.24rem;
  margin-top: 0.1rem;
}

.leixing p {
  width: 1.5rem;
  height: 0.5rem;
  line-height: 0.5rem;
  text-align: center;
  font-size: 0.24rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
}
.leixing p:nth-last-child(1) {
  margin-top: 0.2rem;
}
.leixing .active_type {
  border: 1px solid #ef6213;
  color: white;
  background: #ef6213;
}

.fruit_list .fruit_con .fruit_title select {
  border-radius: 4px;
  font-size: 0.22rem;
  color: #555;
  height: 0.42rem;
  background: #fff;
}

.fruit_list .fruit_con .mian {
  display: flex;
  display: -webkit-flex;
  margin-top: 0.05rem;
}

.fruit_list .fruit_con .mian span {
  font-size: 0.22rem;
  color: #666;
}

.fruit_list .fruit_con .mian span:nth-child(2) {
  color: #ef6213;
  margin-left: 0.2rem;
}

.qixian span {
  font-size: 0.24rem;
  color: #666;
}

.qixian span:nth-child(2) {
  margin-left: 0.2rem;
}

.fruit_list .mint-button--normal {
  /* height: 0.8rem; */
  padding: 0 0.3rem;
}

.mint-button {
  height: 0.44rem;
  line-height: 0.44rem;
  border-radius: 0.3rem;
  font-size: 0.26rem;
  background: #ef6213;
}

.not_open {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}
</style>
