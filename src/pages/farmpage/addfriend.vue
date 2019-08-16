<template>
  <div id="addfriend">
    <mt-header fixed title="好友">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="add_content">
        <div class="add_search add_info">
          <input type="text" v-model="phone" name placeholder="输入账号查询" />
          <span class="iconfont icon-tabsearch" @click="searchFriend"></span>
        </div>
        <div class="friend_info">
          <div class="add_list" v-if="data != ''">
            <div class="add_left">
              <img src="../../assets/img/farm.png" />
            </div>
            <div class="add_right">
              <div class="per_info">
                <span>{{data.name}}</span>
                <span>{{data.phone}}</span>
              </div>
              <div class="function">
                <span @click="addFriend(data.id)">添加</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Indicator } from "mint-ui";
// import { PullRefresh } from "vant";
export default {
  components: {
    Toast,
    Indicator
  },
  data() {
    return {
      data: [], //查询好友数据
      phone: "" //根据手机号查询
    };
  },

  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //查询好友
    searchFriend() {
      console.log(123);
      let that = this;
      let phone = that.phone;
      if (!phone || phone == null) {
        Toast("请输入查询手机号");
      } else {
        Indicator.open({
          text: "正在查询..."
        });
        that
          .$http({
            url: "farm_friend/select_user",
            method: "post",
            data: {
              token: localStorage.getItem("token"),
              phone: phone
            }
          })
          .then(function(res) {
            var msg = res.data.msg;
            if (res.data.code == 0) {
              that.data = res.data.data;
              Indicator.close();
              if (that.data == "") {
                Toast("改账号不存在");
              }
            } else {
              Toast(msg);
            }
          })
          .catch(function(error) {
            Toast({
              message: "网络连接失败",
              position: "bottom",
              duration: 5000
            });
          });
      }
    },
    //添加好友
    addFriend(id) {
      console.log(123);
      let that = this;
      let friend_info = $(".friend_info");
      that
        .$http({
          url: "farm_friend/addFriend",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: id
          }
        })
        .then(function(res) {
          console.log(res);
          var msg = res.data.msg;
          if (res.data.code == 0) {
            Toast(msg);
            friend_info.hide();
          } else {
            Toast(msg);
          }
        })
        .catch(function(error) {
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
#addfriend {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.con-wrapper {
  position: fixed;
  width: 100%;
  height: calc(100% - 40px);
  overflow-x: hidden;
  overflow-y: scroll;
  top: 40px;
  background: url(../../assets/img/fa_bg.jpg) no-repeat center top;
  background-size: 116%;
}

.mint-header {
  background: #ef6213;
}

.add_content {
  padding-top: 0.4rem;
}
.add_info {
  width: 90%;
  margin: 0 auto;
}
.add_content .add_search {
  position: relative;
}

.add_content .add_search input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

.add_content .add_search input {
  height: 0.7rem;
  width: 100%;
  background: rgba(255, 255, 255, 0.6);
  border: none;
  border-radius: 0.1rem;
  padding-left: 0.1rem;
}

.add_content .add_search span {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  color: #ef6213;
}

.add_list {
  margin-bottom: 0.2rem;
  height: 1.6rem;
  border-radius: 0.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.3rem;
}
.add_list .add_left {
  width: 20%;
}
.add_list .add_left img {
  width: 70%;
  margin-left: 0.2rem;
}
.add_right {
  flex: 1;
  margin-left: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.add_right .per_info {
  display: flex;
  flex-direction: column;
  font-size: 0.3rem;
  color: #fff;
}
.add_right .per_info span {
  padding: 0.06rem 0;
}
.function {
  display: flex;
}
.function span {
  padding: 0.1rem 0.26rem;
  margin: 0 0.1rem;
  border-radius: 0.2rem;
  font-size: 0.26rem;
}
.function span:nth-child(1) {
  background: #fff;
  color: #ef6213;
}
.function span:nth-child(2) {
  border: 1px solid #fff;
  color: #ef6213;
  color: #fff;
}
</style>
