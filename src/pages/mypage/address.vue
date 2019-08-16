<template>
  <div id="address">
    <mt-header fixed title="我的地址">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="detail_con">
        <div
          class="detail_address"
          v-for="(addressitem,index) in addressList"
          :key="addressitem.id"
        >
          <div class="detail_list1" @click="gotoClose(index)">
            <div class="pe_name">
              <span>{{addressitem.name}}</span>
              <span>{{addressitem.sex == '女'?'女士':'先生'}}</span>
              <span>{{addressitem.phone}}</span>
            </div>
            <div class="address_info">
              <span>{{addressitem.address}}</span>
            </div>
          </div>
          <div class="nuum">
            <span @click="gotoChangeAddress(addressitem)">修改</span>
            <span @click="deleteAddress(addressitem.id)">删除</span>
            <h5
              :class="addressitem.is_default == 1 ? 'addclass' : '' "
              @click="setDefault(addressitem.id, addressitem.is_default)"
            >{{addressitem.is_default == 1 ? '默认地址' : defAddress}}</h5>
          </div>
        </div>
        <mt-button type="default" @click="gotoAddaddress">新增地址</mt-button>
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
      addressList: [], //地址列表
      defAddress: "设为默认",
    };
  },
  mounted() {
    let that = this;
    that.getMyAddress();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //前往新增地址
    gotoAddaddress() {
      this.$router.push({
        path: "addAddress"
      });
    },
    //前往结算
    gotoClose(index) {
      window.sessionStorage.setItem("addressIndex", index);
      this.back();
    },
    //前往修改地址
    gotoChangeAddress(addressitem) {
      this.$router.push({
        path: "changeAddress",
        query: {
          id: addressitem.id
        }
      });
    },
    //获取我的收货地址列表
    getMyAddress() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Goods/my_address",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.addressList = res.data.data; //地址列表
            that.visited = res.data.data[0].id;
            window.sessionStorage.setItem(
              "address",
              JSON.stringify(that.addressList)
            );
            // console.log(that.addressList)
          } else {
            //失败
            Toast(res.data.msg);
          }
          Indicator.close();
        })
        .catch(function(error) {
          Indicator.close();
        });
    },
    //删除地址
    deleteAddress(id) {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Goods/del_address",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            Toast("删除成功");
            that.getMyAddress();
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
    //设置默认地址
    setDefault(id, is_default) {
      let that = this;
      if (is_default == 1) {
        return;
      }
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Goods/setting_address",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            Toast("设置成功");
            that.getMyAddress();
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

<style>
#address {
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

.mint-navbar .mint-tab-item.is-selected {
  color: #ef6213;
  border-bottom: 2px solid #ef6213;
}

.detail_con {
  width: 100%;
  padding: 0 0.2rem;
}

.detail_con .detail_address {
  border-bottom: 1px solid #e9e9e9;
  font-size: 0.26rem;
  padding: 0.2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail_address .detail_list1 {
  padding-bottom: 0.1rem;
  max-width: 5rem;
}
.detail_address .pe_name {
  padding: 0.1rem 0;
}
.detail_address .pe_name span {
  padding-right: 0.3rem;
}
.detail_address .nuum {
  border-left: 1px solid #e8e8e8;
  height: 0.8rem;
  padding-left: 0.12rem;
}
.detail_address .nuum span {
  color: #888;
  font-size: 0.24rem;
  padding: 0 0.1rem;
}
.detail_address .nuum h5 {
  padding: 0.1rem;
  font-weight: normal;
}
.detail_con .detail_time {
  text-align: right;
  color: #777777;
}

.mint-button--normal {
  height: 0.8rem;
  padding: 0 0.4rem;
}

.detail_con .mint-button {
  bottom: 1rem;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 1rem;
  margin: auto;
  font-size: 0.3rem;
  width: 6rem;
  height: 0.8rem;
  color: #fff;
  border-radius: 0.2rem;
  background: #ef6213;
  font-size: 0.28rem;
}
.detail_con .nuum .addclass {
  color: #ef6213;
}
</style>
