<template>
  <div id="busenter">
    <mt-header fixed title="商家入驻">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
      <svg slot="right" t="1564486939492" @click="gotoEimg" class="icon right_icon" viewBox="0 0 1280 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1992" width="200" height="200"><path d="M1176.58112 403.584a346.88 346.88 0 0 0-189.248-101.568C958.14912 127.616 811.52512 0.256 640.00512 0.256c-171.52 0-318.08 127.36-347.328 301.76a346.88 346.88 0 0 0-189.184 101.568A366.72 366.72 0 0 0 0.00512 660.416c0 96.768 36.736 187.968 103.424 256.832C170.24512 986.112 258.56512 1024 352.38912 1024h294.4c35.712 0 64.704-29.888 64.704-66.752v-254.336l52.224 53.952a63.36 63.36 0 0 0 91.52 0 68.288 68.288 0 0 0 0-94.464L692.48512 494.464l-0.128-0.128-2.176-2.176-1.28-1.024-1.152-1.088-1.536-1.28-0.896-0.704-1.728-1.28-0.832-0.64a62.464 62.464 0 0 0-4.48-2.752l-0.96-0.64a47.104 47.104 0 0 0-1.728-0.832l-1.152-0.64-1.6-0.64-1.408-0.64-1.472-0.64a29.312 29.312 0 0 0-2.816-1.024l-1.792-0.64-1.088-0.256-1.984-0.576-1.024-0.256-2.112-0.448-1.024-0.192a68.992 68.992 0 0 0-2.048-0.384l-1.152-0.128a43.264 43.264 0 0 0-3.52-0.32l-1.6-0.128-2.88-0.128h-0.512c-0.96 0-1.92 0-2.88 0.128-0.512 0-1.024 0-1.6 0.128l-1.536 0.064-1.92 0.256-1.216 0.128a38.08 38.08 0 0 0-2.048 0.384l-1.024 0.192-2.112 0.448-0.96 0.256-1.984 0.576-1.088 0.32-1.856 0.64-1.216 0.384-1.6 0.64-1.472 0.576-1.408 0.64-1.536 0.64-1.216 0.64-1.664 0.896-1.024 0.576a55.424 55.424 0 0 0-1.728 1.024l-0.896 0.64c-0.64 0.32-1.216 0.704-1.792 1.152l-0.896 0.64a61.76 61.76 0 0 0-1.664 1.216l-0.96 0.768-1.536 1.216-1.216 1.088-1.152 1.024c-0.768 0.704-1.472 1.536-2.24 2.176l-0.128 0.128-0.128 0.128a42.56 42.56 0 0 0-2.048 2.24l-1.024 1.28-1.024 1.216-0.512 0.64-157.888 163.008a68.288 68.288 0 0 0 0 94.4 63.36 63.36 0 0 0 91.52 0l52.288-53.952v187.008h-229.76c-122.88 0-222.912-103.168-222.912-230.016 0-126.848 100.032-230.016 222.976-230.016h64.64V363.52C417.09312 236.8 517.12512 133.568 640.00512 133.568c122.88 0 222.912 103.168 222.912 230.016v66.816h64.704c122.944 0 222.976 103.168 222.976 230.016 0 126.848-100.032 230.016-222.976 230.016-35.712 0-64.64 29.888-64.64 66.816 0 36.864 28.928 66.752 64.64 66.752 93.824 0 182.208-37.888 248.96-106.752A366.976 366.976 0 0 0 1280.00512 660.48a366.912 366.912 0 0 0-103.424-256.832z" p-id="1993" fill="#ffffff"></path></svg>
    </mt-header>
    <div class="con-wrapper">
      <div class="bus_con">
        <div class="bus_list">
          <span>公司法人：</span>
          <input type="text" v-model="legal_person" placeholder="请输入公司法人姓名" />
        </div>
        <div class="bus_list">
          <span>法人身份证：</span>
          <input type="text" v-model="legal_identity" placeholder="请输入法人身份证号码" />
        </div>
        <div class="bus_list">
          <span>银行账号：</span>
          <input type="text" v-model="bank_card" placeholder="请输入银行账户" />
        </div>
        <div class="bus_list">
          <span>开户行：</span>
          <input type="text" v-model="bank_name" placeholder="请输入开户行" />
        </div>
        <div class="bus_list">
          <span>推荐商邀请码：</span>
          <input type="text" v-model="invitation_code" placeholder="请输入推荐商邀请码" />
        </div>
        <div class="bus_list">
          <span>行业选择：</span>
          <select v-model="industry_id" class="selectpicker">
            <option v-for="(item,index) in industry" :key="index" :value="item.id">{{item.name}}</option>
          </select>
        </div>
        <div class="checket">
          <van-checkbox v-model="checked" id="checked" @click="check" checked-color="#EF6213"></van-checkbox>
          <p>
            我已阅读并同意
            <span @click="gotoArgument">《商家入驻协议》</span>
          </p>
        </div>
        <div class="button">
          <button class="accept" id="accept" @click="busEnter" disabled="disabled" type="default">确认</button>
        </div>
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
      checked: false,
      disabled: true,
      legal_person: "", //公司法人
      legal_identity: "", //法人身份证
      bank_card: "", //银行账户
      bank_name: "", //开户行
      industry_id: 1, //行业id
      invitation_code: "", //商家邀请码
      industry: [] //行业
    };
  },
  mounted: function() {
    this.getData();
    this.getIndustrylist();
  },
  //数据保存到session
  watch: {
    legal_person(val) {
      if (val || val != null || val != undefined) {
        sessionStorage.setItem("legal_person", val);
      }
    },
    legal_identity(val) {
      if (val || val != null || val != undefined) {
        sessionStorage.setItem("legal_identity", val);
      }
    },
    bank_card(val) {
      if (val || val != null || val != undefined) {
        sessionStorage.setItem("bank_card", val);
      }
    },
    bank_name(val) {
      if (val || val != null || val != undefined) {
        sessionStorage.setItem("bank_name", val);
      }
    },
    industry_id(val) {
      if (val || val != null || val != undefined) {
        sessionStorage.setItem("industry_id", val);
      }
    },
    invitation_code(val) {
      if (val || val != null || val != undefined) {
        sessionStorage.setItem("invitation_code", val);
      }
    }
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //商家升级
    gotoEimg() {
      this.$router.push({
        path: "/busUp"
      });
    },
    //入驻协议
    gotoArgument() {
      this.$router.push({
        path: "/enterAgreement"
      });
    },
    //判断注册协议是否选择
    check() {
      let that = this;
      if (that.checked == false) {
        $("#accept").prop("disabled", false);
        $("#accept").css("background", "#EF6213");
      } else {
        $("#accept").prop("disabled", true);
        $("#accept").css("background", "#c6c6c6");
      }
    },
    // 刷新页面数据不消失
    getData() {
      this.legal_person = sessionStorage.getItem("legal_person");
      this.legal_identity = sessionStorage.getItem("legal_identity");
      this.bank_card = sessionStorage.getItem("bank_card");
      this.bank_name = sessionStorage.getItem("bank_name");
      this.invitation_code = sessionStorage.getItem("invitation_code");
      this.industry_id = sessionStorage.getItem("industry_id");
    },
    //商家入驻
    busEnter() {
      let that = this;
      let legal_person = that.legal_person;
      let legal_identity = that.legal_identity;
      let bank_card = that.bank_card;
      let bank_name = that.bank_name;
      let invitation_code = that.invitation_code;
      let industry_id = that.industry_id;
      if (!legal_person || legal_person == null) {
        Toast("请输入法人姓名");
      } else if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(legal_identity)) {
        Toast("请输入正确的法人身份证号");
      } else if (!bank_card || bank_card == null) {
        Toast("请输入银行账号");
      } else if (!bank_name || bank_name == null) {
        Toast("请输入开户行名称");
      } else if (!invitation_code || invitation_code == null) {
        Toast("请输入商家邀请码");
      } else if (!industry_id || industry_id == null) {
        Toast("请选择行业");
      } else {
        Indicator.open({
          text: "提交中..."
        });
        that.$http
          .post("Ckshop/userReg", {
            token: localStorage.getItem("token"),
            legal_person: legal_person,
            legal_identity: legal_identity,
            bank_card: bank_card,
            bank_name: bank_name,
            invitation_code: invitation_code,
            industry_id: industry_id
          })
          .then(function(res) {
            Indicator.close();
            let code = res.data.code;
            if (code == 0) {
              Toast("提交成功，请等待审核");
              that.legal_person = sessionStorage.getItem("");
              that.legal_identity = sessionStorage.getItem("");
              that.bank_card = sessionStorage.getItem("");
              that.bank_name = sessionStorage.getItem("");
              that.invitation_code = sessionStorage.getItem("");
              that.industry_id = sessionStorage.getItem("");
              // that.$router.push({
              // 	path: '/'
              // })
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
    },
    //获取区域列表
    getIndustrylist() {
      let that = this;
      that.$http
        .post("Ckshop/industryList", {})
        .then(function(res) {
          if (res.data.code == 0) {
            that.industry = res.data.data;
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
};
</script>

<style scoped="scoped">
#busenter {
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

.right_icon {
  width: .8rem;
  height: .8rem;
  padding: 0.225rem 0 0.225rem 0.2rem;
}

.bus_con {
  width: 100%;
  padding: 0.2rem;
}

.bus_con .bus_list {
  display: flex;
  flex-direction: column;
  padding-bottom: 0.2rem;
}

.bus_con .bus_list span {
  display: block;
  width: 100%;
  color: #333;
  font-size: 0.28rem;
  padding-bottom: 0.1rem;
}

.bus_con .bus_list input,
.bus_con .bus_list select {
  height: 0.8rem;
  border: 1px solid #c8c8c8;
  border-radius: 0.1rem;
  padding-left: 0.1rem;
  background: #fff;
}

.checket {
  display: flex;
  justify-content: center;
  font-size: 0.26rem;
  color: #555;
}

.checket span {
  color: #ef6213;
}
.checket p {
  padding-left: 0.1rem;
}

.bus_con button {
  position: relative;
  width: 6rem;
  left: 50%;
  margin-left: -3rem;
  height: 0.8rem;
  color: #fff;
  margin-top: 0.3rem;
  border: none;
  border-radius: 0.2rem;
  background: #ccc;
  font-size: 0.3rem;
}
</style>
