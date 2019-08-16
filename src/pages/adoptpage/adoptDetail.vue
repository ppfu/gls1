<template>
  <div id="adoptDetail">
    <mt-header fixed title="详情">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <!-- 内容 -->
    <div class="con-wrapper">
      <div class="adopt_img">
        <img :src="data.details_img" />
        <span>{{data.phase}}</span>
      </div>
      <div class="adopt_con">
        <div class="adopt_info">
          <div class="adopt_stat">
            <span>{{data.title}}</span>
            <span>{{data.surplus}}</span>
          </div>
          <div class="adopt_stat">
            <div v-if="moldname=='委托代售'" class="stat_list">
              <span>预计代售券</span>
              <span>{{data.bonus}}</span>
            </div>
            <div class="stat_list">
              <span>米宝/亩</span>
              <span>{{data.price}}</span>
            </div>
            <div class="stat_list">
              <span>期限</span>
              <span>{{data.term}}</span>
            </div>
          </div>
          <div class="base_address">
            <span>基地地址：</span>
            <span>{{data.address}}</span>
          </div>
          <div class="money">
            <span>米宝: {{number * data.price}}</span>
            <van-stepper v-model="number" :min="1" input-width="1rem" button-size="0.4rem" />
          </div>
          <div class="commiss">
            <button>{{moldname}}</button>
          </div>
          <div class="remark" v-if="moldname=='领养到家'">
            <h4>备注：</h4>
            <textarea v-model="remake" placeholder="请备注将来送达的地址,包装要求,预约家里食用月配送米量,配送时间计划"></textarea>
          </div>
          <div class="invoice">
            <span>发票类型</span>
            <select id="test" v-model="invoice_type" @change="gradeChange()" class="selectpicker">
              <option v-for="item in options" :key="item.id" :value="item.id">{{item.name}}</option>
            </select>
          </div>
          <div class="invoice_info" v-show="fainfo">
            <h4>发票信息</h4>
            <div class="invoice_radio">
              <input type="radio" v-model="invoice_user" @click="resultone" value="1" id="paixu1" />
              <label for="paixu1" style="cursor:pointer">个人</label>
              <input type="radio" v-model="invoice_user" @click="resulttwo" value="2" id="paixu2" />
              <label for="paixu2" style="cursor:pointer">公司</label>
            </div>
            <div class="rise" id="person" v-show="showper">
              <!-- 个人 -->
              <div class="rise_list">
                <span>发票抬头</span>
                <input type="text" placeholder="个人 (不可修改)" disabled="disabled" />
              </div>
              <div class="rise_list">
                <span>手机号</span>
                <input type="number" v-model="invoice_phone" placeholder="请输入手机号" />
              </div>
            </div>
            <div class="rise" id="gongsi" v-show="gongsi">
              <!-- 公司 -->
              <div class="rise_list">
                <span>发票抬头</span>
                <input type="text" name v-model="invoice_header" placeholder="请输入发票抬头" />
              </div>
              <div class="rise_list">
                <span>手机号</span>
                <input type="number" v-model="invoice_phone" placeholder="请输入手机号" />
              </div>
              <div class="rise_list">
                <span>识别号</span>
                <input type="text" v-model="invoice_code" placeholder="请输入纳税人识别号或统一社会信用代码" />
              </div>
            </div>
          </div>
        </div>
        <div class="ad_btn">
          <button @click="showDialog">提交</button>
        </div>
      </div>
    </div>
    <x-dialog v-model="lang_dlg" class="de_dialog lang_dialog" hide-on-blur>
      <div class="dialogt">
        <span class="iconfont icon-tabguanbi" @click="closeDialog"></span>
        <h4>确认信息</h4>
        <span class="haufei">
          领养需花费
          <a>{{spend}}</a> 米宝
        </span>
        <div class="number">
          <p>交易密码</p>
          <input type="password" v-model="payment_password" placeholder="请输入交易密码" />
        </div>
        <button @click="adoptSubmit">确定</button>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import {} from "vux";
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
      number: 1,
      spend: 0, // 花费
      fainfo: false, //发票信息隐藏
      showper: true, //个人发票信息显示
      gongsi: false, //公司发票信息隐藏
      data: {}, //领养详情
      id: this.$route.query.storeId, //领养id
      moldname: this.$route.query.name || "委托代售", //获取购买类型
      tabindex: this.$route.query.tabindex || 0, //果园、田园、牧场
      type: "", // 购买类型
      lang_dlg: false, //弹窗隐藏
      invoice_header: "", //发票抬头
      invoice_phone: "", //发票手机号
      invoice_code: "", //发票识别码
      payment_password: "", //密码
      invoice_user: 1, //发票信息（个人）
      invoice_type: 1, //发票类型不开发票
      remake: "",
      options: [
        {
          //发票类型
          id: 1,
          name: "不开发票"
        },
        {
          id: 2,
          name: "电子发票"
        },
        {
          id: 3,
          name: "纸质发票"
        }
      ]
    };
  },
  created: function() {
    this.getAdoptDetail();
  },
  mounted: function() {},
  methods: {
    //返回领养列表页
    back() {
      let that = this;
      that.$router.push({
        path: "/tabs/adopt",
        query: {
          tabindex: that.tabindex
        }
      });
    },
    adoptSubmit() {
      let that = this;
      let number = that.number;
      let invoice_header = that.invoice_header;
      let invoice_phone = that.invoice_phone;
      let invoice_code = that.invoice_code;
      let invoice_type = that.invoice_type;
      let invoice_user = that.invoice_user;
      let payment_password = that.payment_password;
      let moldname = that.moldname;
      let type = that.type;
      let remake = that.remake;
      var jsonData;
      if (payment_password == "") {
        // Toast("请输入交易密码");
        that.$toast("请输入交易密码");
      } else {
        if (moldname == "委托代售") {
          if (invoice_type == 1) {
            // 不开发票
            jsonData = {
              token: localStorage.getItem("token"),
              id: that.id,
              number: number,
              invoice_type: 1,
              type: 1,
              payment_password: payment_password
            };
          } else if (invoice_type == 2) {
            //电子发票
            if (invoice_user == 1) {
              //个人
              jsonData = {
                token: localStorage.getItem("token"),
                id: that.id,
                number: number,
                invoice_type: 2,
                type: 1,
                invoice_header: "个人",
                invoice_phone: invoice_phone,
                invoice_user: invoice_user,
                payment_password: payment_password
              };
            } else {
              //公司
              jsonData = {
                token: localStorage.getItem("token"),
                id: that.id,
                number: number,
                invoice_type: 2,
                type: 1,
                invoice_header: invoice_header,
                invoice_phone: invoice_phone,
                invoice_user: invoice_user,
                payment_password: payment_password,
                invoice_code: invoice_code
              };
            }
          } else if (invoice_type == 3) {
            //纸质发票
            if (invoice_user == 1) {
              // 个人
              jsonData = {
                token: localStorage.getItem("token"),
                id: that.id,
                number: number,
                invoice_type: 3,
                type: 1,
                invoice_header: "个人",
                invoice_phone: invoice_phone,
                invoice_user: invoice_user,
                payment_password: payment_password
              };
            } else {
              // 公司
              jsonData = {
                token: localStorage.getItem("token"),
                id: that.id,
                number: number,
                invoice_type: 3,
                type: 1,
                invoice_header: invoice_header,
                invoice_phone: invoice_phone,
                invoice_user: invoice_user,
                payment_password: payment_password,
                invoice_code: invoice_code
              };
            }
          }
        } else if (moldname == "领养到家") {
          //领养到家
          if (invoice_type == 1) {
            jsonData = {
              token: localStorage.getItem("token"),
              id: that.id,
              number: number,
              invoice_type: 1,
              type: 2,
              remake: remake,
              payment_password: payment_password
            };
          } else if (invoice_type == 2) {
            if (invoice_user == 1) {
              jsonData = {
                token: localStorage.getItem("token"),
                id: that.id,
                number: number,
                invoice_type: 2,
                type: 2,
                invoice_header: "个人",
                invoice_phone: invoice_phone,
                invoice_user: invoice_user,
                remake: remake,
                payment_password: payment_password
              };
            } else {
              jsonData = {
                token: localStorage.getItem("token"),
                id: that.id,
                number: number,
                invoice_type: 2,
                type: 2,
                invoice_header: invoice_header,
                invoice_phone: invoice_phone,
                invoice_user: invoice_user,
                remake: remake,
                payment_password: payment_password,
                invoice_code: invoice_code
              };
            }
          } else if (invoice_type == 3) {
            // 纸质发票
            if (invoice_user == 1) {
              // 个人
              jsonData = {
                token: localStorage.getItem("token"),
                id: that.id,
                number: number,
                invoice_type: 3,
                type: 2,
                invoice_header: "个人",
                invoice_phone: invoice_phone,
                invoice_user: invoice_user,
                remake: remake,
                payment_password: payment_password
              };
            } else {
              // 公司
              jsonData = {
                token: localStorage.getItem("token"),
                id: that.id,
                number: number,
                invoice_type: 3,
                type: 2,
                invoice_header: invoice_header,
                invoice_phone: invoice_phone,
                invoice_user: invoice_user,
                remake: remake,
                payment_password: payment_password,
                invoice_code: invoice_code
              };
            }
          }
        }
        that.httpSubmit(jsonData);
      }
    },
    // 提交 请求
    httpSubmit(jsonData) {
      let that = this;
      Indicator.open({
        text: "提交中..."
      });
      that
        .$http({
          url: "Adopt/joinActive",
          method: "post",
          data: jsonData
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            Toast(res.data.msg);
            that.lang_dlg = false;
            that.back();
          } else {
            Toast(res.data.msg);
          }
        })
        .catch(function(error) {});
    },
    //判断选中的是那种发票类型
    gradeChange: function() {
      let options = $("#test option:selected"); //获取选中的项
      // alert(options.val()); //拿到选中项的值
      // alert(options.text()); //拿到选中项的文本
      if (options.text() == "电子发票" || options.text() == "纸质发票") {
        this.showFa();
      } else {
        this.hideFa();
      }
    },
    //判断选中的是个人还是公司
    resultone: function() {
      let that = this;
      let paixu1 = $("#paixu1");
      if (paixu1.is(":checked")) {
        that.showper = true;
        that.gongsi = false;
      } else {
        that.showper = false;
      }
    },
    resulttwo: function() {
      let that = this;
      let paixu2 = $("#paixu2");
      if (paixu2.is(":checked")) {
        that.gongsi = true;
        that.showper = false;
      } else {
        that.gongsi = false;
      }
    },
    verifyFun() {
      // 验证发票
      var that = this;
      let options = $("#test option:selected"); //获取选中的项
      if (options.text() == "不开发票") {
        that.lang_dlg = true;
      } else {
        if (that.showper) {
          if (that.invoice_phone == "") {
            Toast("请输入手机号");
          } else {
            that.lang_dlg = true;
          }
        } else {
          if (that.invoice_header == "") {
            Toast("请输入发票抬头");
          } else if (that.invoice_phone == "") {
            Toast("请输入手机号");
          } else if (that.invoice_code == "") {
            Toast("请输入识别号");
          } else {
            that.lang_dlg = true;
          }
        }
      }
    },
    //弹出确认弹窗
    showDialog: function() {
      var that = this;
      if (that.moldname == "委托代售") {
        that.verifyFun();
        that.spend = that.number * that.data.price;
      } else if (that.moldname == "领养到家") {
        if (that.remake == "") {
          Toast("请输入备注");
          // that.$toast("请输入备注");
        } else {
          that.spend =
            (that.number - that.data.free_number <= 0
              ? 0
              : that.number - that.data.free_number) * that.data.price;
          that.verifyFun();
        }
      }
    },
    //关闭确认弹窗
    closeDialog: function() {
      var that = this;
      that.lang_dlg = false;
    },
    gotoStore() {
      this.$router.push({
        path: "store"
      });
    },
    showFa: function() {
      var that = this;
      that.fainfo = true;
    },
    hideFa: function() {
      var that = this;
      that.fainfo = false;
    },
    //获取领养详情
    getAdoptDetail() {
      let that = this;
      that
        .$http({
          url: "Adopt/adoptDetails",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: that.id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.data = res.data.data;
          } else {
            Toast("获取信息失败");
          }
        })
        .catch(function(error) {});
    }
  }
};
</script>

<style>
#adoptDetail {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#test {
  display: block;
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

.adopt_img {
  width: 100%;
  height: 3.4rem;
}

.adopt_img img {
  width: 100%;
  height: 100%;
}

.adopt_img span {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.1rem 0.2rem;
  background: rgba(255, 255, 255, 0.4);
  font-size: 0.24rem;
  color: #ef6213;
}

.adopt_con {
  width: 100%;
  padding: 0 0.2rem;
}

.adopt_stat {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  font-size: 0.26rem;
  padding-top: 0.2rem;
}
.base_address {
  font-size: 0.28rem;
  padding: 0.2rem 0;
  border-bottom: 1px solid #e9e9e9;
}

.adopt_stat span:nth-child(2) {
  color: #ef6213;
}

.remark h4 {
  font-size: 0.28rem;
  line-height: 0.5rem;
  font-weight: normal;
}

.remark textarea {
  width: 100%;
  height: 2rem;
  padding-top: 0.1rem;
  padding-left: 0.1rem;
}

.weui-cell:before {
  display: none !important;
}

.money {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 0;
}

.commiss {
  width: 100%;
  text-align: right;
}

.commiss .yu_com {
  font-size: 0.26rem;
}

.commiss .yu_com span:nth-child(2) {
  color: #ef6213;
}

.commiss button {
  font-size: 0.28rem;
  background: #ef6213;
  border: none;
  padding: 0.1rem 0.2rem;
  color: #fff;
  border-radius: 0.1rem;
}

.invoice {
  display: flex;
  align-items: center;
  font-size: 0.28rem;
  padding-top: 0.2rem;
}

.invoice select {
  height: 0.6rem;
  flex: 1;
  border-radius: 0.1rem;
  margin-left: 0.3rem;
}

.invoice_info h4 {
  padding: 0.2rem 0;
}

.invoice_radio {
  border-bottom: 1px solid #e9e9e9;
  padding-bottom: 0.3rem;
  font-size: 0.28rem;
}

.invoice_radio > input,
.cl_radio > input {
  display: none;
}

.invoice_radio > label,
.cl_radio > label {
  position: relative;
  margin-right: 0.2rem;
}

.invoice_radio > label::before,
.cl_radio > label::before {
  display: inline-block;
  content: "";
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgb(219, 219, 219);
  margin-right: 6px;
  vertical-align: bottom;
}

.invoice_radio > input:checked + label::before,
.cl_radio > input:checked + label::before {
  background-color: #ef6213;
}

.invoice_radio > input:checked + label::after,
.cl_radio > input:checked + label::after {
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

.invoice_radio {
  text-align: center;
}

.invoice_btn {
  display: flex;
  justify-content: space-around;
}

.invoice_btn button {
  padding: 0.1rem 0.5rem;
  border: none;
  color: #fff;
  border-radius: 0.1rem;
}

.invoice_btn button:nth-child(1) {
  background: #ef6213;
}

.rise .rise_list {
  display: flex;
  align-items: center;
  padding: 0.2rem 0;
  font-size: 0.28rem;
}

.rise .rise_list span:nth-child(1) {
  width: 24%;
}

.rise_list input {
  flex: 1;
  height: 0.6rem;
  border: none;
  background: #fff;
}

.adopt_con .ad_btn {
  text-align: center;
  margin: 0.5rem 0;
}

.adopt_con .ad_btn button {
  width: 6rem;
  height: 0.8rem;
  border: none;
  background: #ef6213;
  color: #fff;
  border-radius: 0.1rem;
}

.dialogt {
  width: 90%;
  margin: 0 auto;
  height: 4rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 0.2rem;
}

.dialogt span.iconfont {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
}

.dialogt h4 {
  font-size: 0.3rem;
  font-weight: normal;
}

.dialogt .haufei {
  padding-top: 0.4rem;
  font-size: 0.28rem;
}

.dialogt .haufei a {
  color: #ef6213;
}

.dialogt .number {
  width: 90%;
  margin: 0.3rem 0;
  display: flex;
  justify-content: space-between;
  font-size: 0.26rem;
  align-items: center;
}

.dialogt .number input {
  width: 70%;
  border: 1px solid #e8e8e8;
  height: 0.6rem;
  padding-left: 0.1rem;
}

.dialogt button {
  width: 50%;
  height: 0.6rem;
  background: #ef6213;
  color: #fff;
  margin-top: 0.4rem;
  border: none;
  border-radius: 0.1rem;
}
</style>
