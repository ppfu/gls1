<template>
  <div id="vote">
    <mt-header fixed title="投票">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
      <span slot="right" @click="voteRuleFun">投票规则</span>
    </mt-header>
    <div class="con-wrapper">
      <div class="vote_img">
        <img :src="banner" />
      </div>
      <p class="play_game" @click="playGameFun">参与投票活动</p>
      <div class="vote_num">
        <div>
          <span>我的票数</span>
          <span>{{number}}票</span>
        </div>
        <div>
          <span>当前排名</span>
          <span>{{sort}}</span>
        </div>
      </div>
      <div class="vote_link" v-show="playGame == 1">
        <h5>我的投票链接</h5>
        <div class="link">
          <span>{{url}}</span>
          <span v-clipboard:copy="url" v-clipboard:success="onCopy" v-clipboard:error="onError">分享</span>
        </div>
      </div>
      <div class="vote_con">
        <div class="vote_list" v-for="(item,index) in ranking" :key="index">
          <span>{{item.name}} {{item.phone}}</span>
          <span>{{item.number}}票</span>
          <span @click="subVote(item.id)">投票</span>
        </div>
      </div>
    </div>
    <x-dialog v-model="voteRule" class="de_dialog lang_dialog" hide-on-blur>
      <div class="dialog">
        <span class="iconfont icon-tabguanbi" @click="closeDialog"></span>
        <h4>投票规则</h4>
        <div class="dialog_cont" v-html="voteRuleCont"></div>
        <button @click="closeDialog">确定</button>
      </div>
    </x-dialog>
    <x-dialog v-model="voteTimes" class="de_dialog lang_dialog" hide-on-blur>
      <div class="dialog">
        <span class="iconfont icon-tabguanbi" @click="closeVoteTimesFun"></span>
        <h4>提示</h4>
        <div class="dialog_cont" style="height: 2rem;">
          <p>您今日投票次数已达上限, 继续投票需进行投票充值</p>
        </div>
        <button @click="closeDialog">确定</button>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { Indicator, Toast } from "mint-ui";
import { XDialog } from "vux";
export default {
  components: {
    Indicator,
    Toast,
    XDialog
  },
  data() {
    return {
      banner: "",
      ranking: [], //排名
      sort: [], //当前排名
      number: [], //我的票数
      url: "", //链接
      voteRule: false, // 投票规则弹窗
      voteTimes: false, // 投票次数上限
      voteRuleCont: "", //规则
      playGame: "",
    };
  },
  mounted: function() {
    let that = this;
    that.getRanding();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
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
    playGameFun() {
      this.playGame = 1;
    },
    //获取我的投票
    getRanding() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "adopt_randing/randingPage",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.banner = res.data.data.banner;
            that.ranking = res.data.data.ranking;
            that.sort = res.data.data.sort;
            that.number = res.data.data.number;
            that.url = res.data.data.url;
            that.voteRuleCont = res.data.data.guize;
            that.playGame = res.data.data.is_join;
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
    //投票
    subVote(id) {
      let that = this;
      Indicator.open({
        text: "提交中..."
      });
      that
        .$http({
          url: "adopt_randing/voteActive",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            Toast(res.data.msg);
            that.getRanding();
          } else if (res.data.code == -1) {
            //成功回调
            that.voteTimes = true;
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
    //复制失败
    onError() {
      // 移动端走的失败
      Toast({
        message: "链接复制成功，请粘贴到微信分享",
        position: "center",
        duration: 3000
      });
    },
    //复制成功
    onCopy() {
      // web走的成功
      let that = this;
      window.location.replace("weixin://");
      Toast({
        message: "链接复制成功，请粘贴到微信分享",
        position: "center",
        duration: 3000
      });
    },
    voteRuleFun() {
      this.voteRule = true;
    },
    closeDialog() {
      this.voteRule = false;
    },
    closeVoteTimesFun() {
      this.voteTimes = false;
    }
  }
};
</script>

<style scoped="scoped">
#vote {
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
  position: relative;
  background: #ef6213;
}

.vote_img {
  width: 100%;
  height: 4.4rem;
}

.vote_img img {
  width: 100%;
  height: 100%;
}
.play_game {
  display: block;
  margin: 0.2rem auto 0;
  width: 2.6rem;
  height: 0.7rem;
  line-height: .7rem;
  border-radius: .4rem;
  background-color: rgba(239, 98, 19, 1);
  color: rgba(255, 255, 255, 1);
  font-size: 0.28rem;
  text-align: center;
  box-shadow: 3px 3px 0px 0px rgba(185, 73, 10, 1);
}
.vote_con {
  width: 100%;
  padding: 0 0.2rem;
}
.vote_num {
  display: flex;
  justify-content: space-around;
  padding: 0.2rem 0;
}
.vote_num > div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.vote_num > div span:nth-child(2) {
  padding-top: 0.2rem;
  color: #ef6213;
}
.vote_link {
  width: 100%;
  padding: 0 0.2rem;
}
.vote_link h5 {
  font-weight: normal;
  font-size: 0.28rem;
}
.vote_link .link {
  padding: 0.2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.26rem;
}
.vote_link .link span:nth-child(1) {
  width: 80%;
  word-wrap: break-word;
}
.vote_link .link span:nth-child(2) {
  color: #ef6213;
}
.vote_list {
  font-size: 0.28rem;
  display: flex;
  justify-content: space-between;
  padding: 0.2rem 0;
  align-items: center;
}

.vote_list span:nth-child(1) {
  width: 40%;
}
.vote_list span:nth-child(2) {
  color: #ef6213;
}
.vote_list span:nth-child(3) {
  color: #ef6213;
  padding: 0.08rem 0.2rem;
  border: 1px solid #ef6213;
  border-radius: 0.1rem;
}

.dialog {
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.2rem 0;
}
.dialog span.iconfont {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
}
.dialog h4 {
  font-size: 0.3rem;
  font-weight: normal;
  margin-bottom: 0.4rem;
}
.dialog .dialog_cont {
  overflow-x: hidden;
  overflow-y: scroll;
  height: 4rem;
  font-size: 0.28rem !important;
  text-indent: 0.56rem !important;
  text-align: justify;
  line-height: 1.4;
  color: #333;
}
.dialog button {
  width: 50%;
  height: 0.6rem;
  background: #ef6213;
  color: #fff;
  margin-top: 0.2rem;
  border: none;
  font-size: 0.24rem;
  line-height: 0.6rem;
  border-radius: 0.1rem;
}
</style>
