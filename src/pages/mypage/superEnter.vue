<template>
  <div id="superEnter">
    <mt-header fixed title="谷联超市入驻">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="up_con">
        <div class="super_license">上传生产许可证</div>
        <div class="license_box">
          <van-uploader v-model="fileList_pro" :after-read="afterReadPro" multiple :max-count="1" />
        </div>
        <div class="super_license">上传营业执照</div>
        <div class="license_box">
          <van-uploader v-model="fileList_bus" :after-read="afterReadBus" multiple :max-count="1" />
        </div>
        <div class="super_license">上传生产流通许可证</div>
        <div class="license_box">
          <van-uploader v-model="fileList_cir" :after-read="afterReadCir" multiple :max-count="1" />
        </div>
        <div class="checket">
          <van-checkbox v-model="checked" id="checked" @click="check" checked-color="#EF6213"></van-checkbox>
          <p>
            我已阅读并同意
            <span @click="gotoArgument">《超市入驻协议》</span>
          </p>
        </div>
        <div class="button">
          <button
            class="accept"
            id="accept"
            @click="superEnter"
            disabled="disabled"
            type="default"
          >确认</button>
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
      disabled: true,
      checked: false,
      fileList_pro: [], //展示已上传生产许可证
      fileList_bus: [], //展示已上传营业执照
      fileList_cir: [], //展示已上传生产流通许可证
      manufacturing_license: "", //生产许可证
      business_license: "", // 营业执照
      circulation_license: "" //生产流通许可证
    };
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //入驻协议
    gotoArgument() {
      this.$router.push({
        path: "/marketAgreement"
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
    //超市入驻
    superEnter() {
      let that = this;
      if (that.fileList_pro.length < 1) {
        Toast("请上传生产许可证");
      } else if (that.fileList_bus.length < 1) {
        Toast("请上传营业执照");
      } else if (that.fileList_cir.length < 1) {
        Toast("请上传生产流通许可证");
      } else {
        Indicator.open({
          text: "提交中..."
        });
        that
          .$http({
            url: "Pjshop/userReg",
            method: "post",
            data: {
              token: localStorage.getItem("token"),
              manufacturing_license: that.manufacturing_license,
              business_license: that.business_license,
              circulation_license: that.circulation_license
            }
          })
          .then(function(res) {
            if (res.data.code == 0) {
              //成功回调
              Toast("资料提交成功");
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
    },
    // 上传生产许可证
    afterReadPro(file) {
      let that = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.file); // 读取文件
      reader.onload = function(arg) {
        var formData = new FormData();
        formData.append("file", file.file);
        formData.append("token", localStorage.getItem("token"));
        $.ajax({
          url: "http://glsapi.jinjifuweng.com/api/goods_order/upload/",
          type: "POST",
          data: formData,
          dataType: "JSON",
          cache: false,
          processData: false,
          contentType: false
        }).done(function(res) {
          if (res.code == 0) {
            //成功回调
            Toast(res.msg);
            that.manufacturing_license = res.data;
          } else {
            //失败
            Toast(res.msg);
          }
          Indicator.close();
        });
      };
    },
    // 上传营业执照
    afterReadBus(file) {
      let that = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.file); // 读取文件
      reader.onload = function(arg) {
        var formData = new FormData();
        formData.append("file", file.file);
        formData.append("token", localStorage.getItem("token"));
        $.ajax({
          url: "http://glsapi.jinjifuweng.com/api/goods_order/upload/",
          type: "POST",
          data: formData,
          dataType: "JSON",
          cache: false,
          processData: false,
          contentType: false
        }).done(function(res) {
          if (res.code == 0) {
            //成功回调
            Toast(res.msg);
            that.business_license = res.data;
          } else {
            //失败
            Toast(res.msg);
          }
          Indicator.close();
        });
      };
    },
    // 上传生产流通许可证
    afterReadCir(file) {
      let that = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.file); // 读取文件
      reader.onload = function(arg) {
        var formData = new FormData();
        formData.append("file", file.file);
        formData.append("token", localStorage.getItem("token"));
        $.ajax({
          url: "http://glsapi.jinjifuweng.com/api/goods_order/upload/",
          type: "POST",
          data: formData,
          dataType: "JSON",
          cache: false,
          processData: false,
          contentType: false
        }).done(function(res) {
          if (res.code == 0) {
            //成功回调
            Toast(res.msg);
            that.circulation_license = res.data;
          } else {
            //失败
            Toast(res.msg);
          }
          Indicator.close();
        });
      };
    }
  }
};
</script>

<style>
#superEnter {
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

.mint-header .shengji {
  font-size: 0.6rem;
}
.up_con {
  width: 100%;
  padding: 0 0.2rem;
}
.img_title {
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
  color: #969696;
  font-size: 0.25rem;
}
.super_license {
  padding: 0.2rem 0;
  font-size: 0.28rem;
}
.license_box {
  width: 100%;
  height: 3.54rem;
  margin: 0 auto;
  position: relative;
}
.van-uploader {
  width: 100% !important;
  /* 	height: 3.54rem !important; */
}
.license_box .van-uploader__upload {
  width: 100% !important;
  height: 3.54rem !important;
  margin: 0;
}
.license_box .van-uploader__preview-image {
  width: 100% !important;
  height: 3.54rem !important;
}
.checket {
  display: flex;
  justify-content: center;
  font-size: 0.26rem;
  color: #555;
  margin-top: 0.2rem;
}

.checket span {
  color: #ef6213;
}
.checket p {
  padding-left: 0.1rem;
}
.up_con .beizhu {
  font-size: 0.26rem;
  color: #ef6213;
  margin-top: 0.1rem;
  margin-bottom: 0.3rem;
}

.up_con .button {
  text-align: center;
}

.up_con button {
  width: 6rem;
  height: 0.8rem;
  color: #fff;
  margin: 0 auto;
  margin: 0.3rem 0;
  border-radius: 0.2rem;
  background: #ccc;
  font-size: 0.3rem;
  border: none;
}
</style>
