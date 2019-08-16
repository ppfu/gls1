<template>
  <div id="addAddress">
    <mt-header fixed title="修改地址">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="add_con">
        <div class="add_list">
          <span>联系人</span>
          <input type="text" v-model="name" placeholder="请填写收货人姓名" />
        </div>
        <div class="add_list">
          <div class="add_radio">
            <input type="radio" v-model="sex" value="0" id="paixu1" />
            <label for="paixu1" style="cursor:pointer">先生</label>
            <input type="radio" v-model="sex" value="1" id="paixu2" />
            <label for="paixu2" style="cursor:pointer">女士</label>
          </div>
        </div>
        <div class="add_list">
          <span>手机号</span>
          <input type="text" v-model="phone" placeholder="请填写收货人手机号码" />
        </div>
        <div class="add_list">
          <span>收货地址</span>
          <div class="address">
            <group>
              <x-address
                :title="title"
                v-model="value"
                :list="addressData"
                placeholder="请选择地址"
              >1466666</x-address>
            </group>
          </div>
        </div>
        <div class="add_list">
          <span>详细地址</span>
          <input type="text" v-model="detailed" placeholder="例:16号楼层301市" />
        </div>

        <button @click="changeAddress">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast } from "mint-ui";
import {
  Group,
  XAddress,
  ChinaAddressV4Data,
  XButton,
  Cell,
  Value2nameFilter as value2name
} from "vux";
export default {
  components: {
    Group,
    XAddress,
    XButton,
    Cell,
    Indicator,
    Toast
  },
  data() {
    return {
      title: "",
      value: [],
      id: this.$route.query.id,
      addressData: ChinaAddressV4Data,
      // value4: [],
      // value5: ['广东省', '深圳 市', '南山区'],
      showAddress: false,
      name: "", //收货人
      sex: 0, //性别
      phone: "", //手机号
      detailed: "", //详细地址
      province: "", //省数据
      city: "", //市数据
      area: "" //区数据
    };
  },
  created() {},
  mounted() {
    this.getMyChangeAddress();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    doShowAddress() {
      this.showAddress = true;
      setTimeout(() => {
        this.showAddress = false;
      }, 2000);
    },
    //获取修改页面数据
    getMyChangeAddress() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Goods/addressDetails",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: that.id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            let addressList = res.data.data.address;
            that.name = addressList.name;
            that.sex = addressList.sex;
            that.phone = addressList.phone;
            that.detailed = addressList.detailed;
            that.value[0] = addressList.province;
            that.value[1] = addressList.city;
            that.value[2] = addressList.area;
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
    //修改地址
    changeAddress() {
      let that = this;
      let name = that.name;
      let phone = that.phone;
      let detailed = that.detailed;
      if (!name || name == null) {
        Toast("请输入收货人姓名");
      } else if (!phone || phone == null) {
        Toast("请输入收货人手机号");
      } else if (!detailed || detailed == null) {
        Toast("请输入收货详细地址");
      } else {
        Indicator.open({
          text: "提交中..."
        });
        that.$http
          .post("Goods/save_address", {
            token: localStorage.getItem("token"),
            id: that.id,
            name: name,
            phone: phone,
            sex: that.sex,
            detailed: detailed,
            province: that.value[0],
            city: that.value[1],
            area: that.value[2]
          })
          .then(function(res) {
            Indicator.close();
            let code = res.data.code;
            if (code == 0) {
              Toast("修改成功");
              that.$router.go(-1);
            } else {
              Toast(res.data.msg);
            }
          })
          .catch(function(err) {
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
#addAddress {
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
.add_con {
  width: 100%;
  padding: 0 0.2rem;
}
.mint-header {
  position: relative;
  background: #ef6213;
}
.add_radio > input {
  display: none;
}

.add_radio > label {
  position: relative;
  margin-right: 0.2rem;
}

.add_radio > label::before {
  display: inline-block;
  content: "";
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgb(219, 219, 219);
  margin-right: 6px;
  vertical-align: bottom;
}

.add_radio > input:checked + label::before {
  background-color: #ef6213;
}

.add_radio > input:checked + label::after {
  display: inline-block;
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  position: absolute;
  left: 6px;
  bottom: 6px;
  background-color: white;
}

.add_radio {
  width: 100%;
  text-align: center;
}
.add_con .add_list {
  width: 100%;
  height: 1rem;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  font-size: 0.28rem;
}
.add_con .add_list span {
  width: 22%;
}
.add_con .add_list input {
  flex: 1;
  border: none;
}
.address {
  flex: 1;
}
div.weui-cells.vux-no-group-title {
  margin: 0;
  padding: 0;
}
.address div > .vux-cell-primary .vux-popup-picker-select {
  text-align: left;
}
.weui-cell__hd {
  display: none;
}
.weui-cells:before,
.weui-cells:after {
  display: none;
}
.weui-cell {
  padding: 3px 0.1rem !important;
}
.vux-cell-value,
.vux-popup-picker-placeholder {
  font-size: 0.28rem;
}
div.weui-cell.vux-tap-active.weui-cell_access {
  padding: 3px 0.1rem !important;
}
.vux-popup-picker-select {
  text-align: left !important;
}
.vux-label-desc {
  display: none;
}
.vux-cell-value {
  color: #333 !important;
}
.add_con button {
  display: block;
  margin: auto;
  width: 6rem;
  height: 0.8rem;
  border-radius: 0.2rem;
  background: #ef6213;
  border: none;
  color: #fff;
  margin-top: 0.5rem;
}
</style>
