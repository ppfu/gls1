import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login' //登录页
import Fogetpass from '@/pages/fogetpass' //忘记密码
import Register from '@/pages/register' //注册
import Agreement from '@/pages/agreement' //注册协议
import Tabs from '@/pages/tabbar/tabs' //tab页
import Index from '@/pages/tabbar/index' //首页
import Adopt from '@/pages/tabbar/adopt' //领养页
import Supermarket from '@/pages/homepage/supermarket' //评价超市
import MarketDetail from '@/pages/marketpage/marketDetail' //评价超市
import ProDetail from '@/pages/marketpage/proDetail' //超市商品详情
import MarketClassify from '@/pages/marketpage/marketClassify' //超市商品分类
import MarketShopcar from '@/pages/marketpage/marketShopcar' //超市购物车
import MarketClose from '@/pages/marketpage/MarketClose' //结算
import MarketMine from '@/pages/marketpage/MarketMine' //超市我的
import MarketOrder from '@/pages/marketpage/MarketOrder' //超市我的订单
import MorderDetail from '@/pages/marketpage/MorderDetail' //超市我的订单详情
import MarketAfterSale from '@/pages/marketpage/MarketAfterSale' //超市申请售后
import MarketEvaluate from '@/pages/marketpage/MarketEvaluate' //超市评价
import MarketAddress from '@/pages/marketpage/marketAddress' //超市收货地址页
import MAddAddress from '@/pages/marketpage/mAddAddress' //超市新增收货地址页
import MChangeAddress from '@/pages/marketpage/mChangeAddress' //超市修改收货地址页
import Yipinyidi from '@/pages/homepage/yipinyidi' //一品一地
import Yipindetail from '@/pages/homepage/yipindetail' //一品一地详情
import Yipinclose from '@/pages/homepage/yipinclose' //一品一地结算页
import Reserecord from '@/pages/homepage/reserecord' //预定记录
import Localshop from '@/pages/homepage/localshop' //本地店铺
import Payrecord from '@/pages/homepage/payrecord' //付款记录
import Video from '@/pages/homepage/video' //在线视频
import Recreation from '@/pages/homepage/Recreation' //我的娱乐
import Turntable from '@/pages/homepage/turntable' //大转盘
import Turnresult from '@/pages/homepage/turnresult' //转盘抽奖结果
import MoneyTree from '@/pages/homepage/moneyTree' //摇钱树
import Prize from '@/pages/homepage/prize' //抽奖
import Message from '@/pages/homepage/Message' //平台资讯
import NewsDetail from '@/pages/homepage/newsDetail' //资讯详情
import AdoptRecord from '@/pages/adoptpage/adoptRecord' //领养记录
import AdoptDetail from '@/pages/adoptpage/adoptDetail' //领养田园详情
import StoreHome from '@/pages/tabbar/storeHome' //创客商城首页
import Store from '@/pages/storepage/store' //商品页
import Farm from '@/pages/tabbar/farm' //农场页
import Friendrequest from '@/pages/farmpage/friendrequest' //好友提示
import Friend from '@/pages/farmpage/friend' //好友
import Stealingfood from '@/pages/farmpage/stealingfood' //正在偷粮者
import Addfriend from '@/pages/farmpage/addfriend' //添加好友
import Friendfame from '@/pages/farmpage/friendfame' //添加好友
import Management from '@/pages/farmpage/management' //农场管理
import Myfarm from '@/pages/farmpage/myfarm' //我的农场
import Gamemall from '@/pages/farmpage/gamemall' //农场商城
import Deal from '@/pages/farmpage/deal' //交易
import Dealranking from '@/pages/farmpage/dealranking' //交易排名
import Cultivators from '@/pages/farmpage/cultivators' //开垦机
import Seed from '@/pages/farmpage/seed' //种子
import SeedDetail from '@/pages/farmpage/seedDetail' //种子详情
import Fertilizer from '@/pages/farmpage/fertilizer' //化肥
import My from '@/pages/tabbar/my' //我的页面
import Recharge from '@/pages/mypage/recharge' //充值页
import RechDetail from '@/pages/mypage/rechDetail' //充值明细页
import Withdraw from '@/pages/mypage/withdraw' //提现页
import WithDetail from '@/pages/mypage/withDetail' //提现明细页
import Conver from '@/pages/mypage/conver' //兑换页
import ConverDetail from '@/pages/mypage/converDetail' //兑换明细页
import FarmDetail from '@/pages/mypage/farmDetail' //农场明细页
import RedPacket from '@/pages/mypage/redpacket' //红包明细页
import Redopen from '@/pages/mypage/redopen' //拆红包
import Redmoreopen from '@/pages/mypage/redmoreopen' //多倍拆
import ReceiveRed from '@/pages/mypage/receiveRed' //所领红包
import ShareRed from '@/pages/mypage/shareRed' //分享领红包
import Manycard from '@/pages/mypage/manycard' //多倍卡
import Buymanycard from '@/pages/mypage/buymanycard' //购买多倍卡
import GenerDetail from '@/pages/mypage/generDetail' //推广明细页
import CardBag from '@/pages/mypage/cardBag' //卡包页
import BlackDetail from '@/pages/mypage/blackDetail' //黑土地详情页
import Addmember from '@/pages/mypage/addmember' //加入会员页
import MemberDetail from '@/pages/mypage/memberDetail' //会员卡详情页
import GulianDetail from '@/pages/mypage/gulianDetail' //谷联卡详情
import Orchard from '@/pages/mypage/orchard' //我的果园
import Rural from '@/pages/mypage/rural' //我的田园
import Pasture from '@/pages/mypage/pasture' //我的牧场
import Vote from '@/pages/mypage/Vote' //投票
import MyGroup from '@/pages/mypage/myGroup' //我的团队
import Recommend from '@/pages/mypage/recommend' //推荐有礼
import BusEnter from '@/pages/mypage/busEnter' //商家入驻
import EnterAgreement from '@/pages/mypage/enterAgreement' //商家入驻协议
import ReturnGrain from '@/pages/storepage/returnGrain' //商家返谷分协议
import BusUp from '@/pages/mypage/busUp' //商家升级
import SuperEnter from '@/pages/mypage/superEnter' //谷联超市入驻
import MarketAgreement from '@/pages/mypage/marketAgreement' //谷联超市入驻协议
import Travel from '@/pages/mypage/travel' //实地旅游
import ApplyTravel from '@/pages/mypage/applyTravel' //申请旅游
import ContactSer from '@/pages/mypage/contactSer' //联系客服
import AboutUs from '@/pages/mypage/aboutUs' //关于我们
import Setting from '@/pages/mypage/setting' //设置页
import Phone from '@/pages/mypage/phone' //手机号页
import Autonym from '@/pages/mypage/autonym' //实名认证页
import Bankcard from '@/pages/mypage/bankcard' //银行卡页
import Wechat from '@/pages/mypage/wechat' //微信页面
import Alipay from '@/pages/mypage/alipay' //支付宝页
import Address from '@/pages/mypage/address' //我的地址页
import AddAddress from '@/pages/mypage/addAddress' //新增地址
import ChangeAddress from '@/pages/mypage/changeAddress' //修改地址
import DealPassword from '@/pages/mypage/dealPassword' //交易密码页
import Changepass from '@/pages/mypage/changepass' //修改密码页
import Classify from '@/pages/storepage/classify' //商品分类
import ComDetails from '@/pages/storepage/comDetails' //商品详情
import ShoppingCar from '@/pages/storepage/shoppingCar' //购物车
import Mine from '@/pages/storepage/mine' //我的
import Myorder from '@/pages/storepage/myorder' //我的订单
import OrderDetail from '@/pages/storepage/orderDetail' //订单详情
import Evaluate from '@/pages/storepage/evaluate' //写评价
import ApplyAfterSale from '@/pages/storepage/applyAfterSale' //申请售后
import Busrecom from '@/pages/storepage/busrecom' //我的推广码
import Mybusgroup from '@/pages/storepage/mybusgroup' //我的商家团队
import CloseAccount from '@/pages/storepage/closeAccount' //结算
import SubmitOrder from '@/pages/storepage/submitOrder' //提交订单
Vue.use(Router)
export default new Router({
	// mode: "history",
  // scrollBehavior(to, from, savedPosition) {
	// 	//判断如果滚动条的位置存在直接返回到当前位置，否者返回到起点
	// 	console.log(to);
	// 	console.log(from);
	// 	console.log(savedPosition);
  //   if (to.hash) {
  //     return {
  //       selector: to.hash
  //     }
  //   }
  //   // if (savedPosition) {
	// 	// 	console.log("111");
  //   //   return {x: 500, y: 500}
  //   // } else {
	// 	// 	console.log("222");
  //   //   if (to.hash) {
  //   //     return {
  //   //       selector: to.hash
  //   //     }
  //   //   }
  //   // }
  // },
  routes: [{ //默认路由
      path: '/',
      redirect: "/tabs/index"
    }, {
      path: '/login',
      name: 'Login',
      components: {
        main: Login,
      },
      meta: {
        index: 1,
      }
    },
    {
      path: '/fogetpass',
      name: 'Fogetpass',
      components: {
        main: Fogetpass,
      },
      meta: {
        index: 2,
      }
    },
    {
      path: '/register',
      name: 'Register',
      components: {
        main: Register,
      },
      meta: {
        index: 2,
      }
    },
    {
      path: '/agreement',
      name: 'Agreement',
      components: {
        main: Agreement,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/tabs',
      name: 'Tabs',
      components: {
        main: Tabs,
      },
      children: [{
        path: '/tabs/index',
        name: 'Index',
        components: {
          child: Index,
        },
        meta: {
          index: 2,
        }
      }, {
        path: '/tabs/adopt',
        name: 'Adopt',
        components: {
          child: Adopt,
        },
        meta: {
          index: 2,
          keepAlive: true,
        }
      }, {
        path: '/tabs/storeHome',
        name: 'StoreHome',
        components: {
          child: StoreHome,
        },
        meta: {
          index: 2,
        }
      }, {
        path: '/tabs/farm',
        name: 'Farm',
        components: {
          child: Farm,
        },
        meta: {
          index: 2,
        }
      }, {
        path: '/tabs/my',
        name: 'My',
        components: {
          child: My,
        },
        meta: {
          index: 2,
        }
      }]
    },
    {
      path: '/supermarket',
      name: 'Supermarket',
      components: {
        main: Supermarket,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/marketDetail',
      name: 'MarketDetail',
      components: {
        main: MarketDetail,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/proDetail',
      name: 'ProDetail',
      components: {
        main: ProDetail,
      },
      meta: {
        index: 5,
      }
    },
    {
      path: '/marketClassify',
      name: 'MarketClassify',
      components: {
        main: MarketClassify,
      },
      meta: {
        index: 5,
      }
    },
    {
      path: '/marketShopcar',
      name: 'MarketShopcar',
      components: {
        main: MarketShopcar,
      },
      meta: {
        index: 5,
      }
    },
    {
      path: '/marketClose',
      name: 'MarketClose',
      components: {
        main: MarketClose,
      },
      meta: {
        index: 6,
      }
    },
    {
      path: '/marketMine',
      name: 'MarketMine',
      components: {
        main: MarketMine,
      },
      meta: {
        index: 5,
      }
    },
    {
      path: '/marketOrder',
      name: 'MarketOrder',
      components: {
        main: MarketOrder,
      },
      meta: {
        index: 6,
      }
    },
    {
      path: '/morderDetail',
      name: 'MorderDetail',
      components: {
        main: MorderDetail,
      },
      meta: {
        index: 7,
      }
    },
    {
      path: '/marketAfterSale',
      name: 'MarketAfterSale',
      components: {
        main: MarketAfterSale,
      },
      meta: {
        index: 7,
      }
    },
    {
      path: '/marketEvaluate',
      name: 'MarketEvaluate',
      components: {
        main: MarketEvaluate,
      },
      meta: {
        index: 7,
      }
    },
    {
      path: '/marketAddress',
      name: 'MarketAddress',
      components: {
        main: MarketAddress,
      },
      meta: {
        index: 7,
      }
    },
    {
      path: '/mAddAddress',
      name: 'MAddAddress',
      components: {
        main: MAddAddress,
      },
      meta: {
        index: 8,
      }
    },
    {
      path: '/mChangeAddress',
      name: 'MChangeAddress',
      components: {
        main: MChangeAddress,
      },
      meta: {
        index: 8,
      }
    },
    {
      path: '/yipinyidi',
      name: 'Yipinyidi',
      components: {
        main: Yipinyidi,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/yipindetail',
      name: 'Yipindetail',
      components: {
        main: Yipindetail,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/yipinclose',
      name: 'Yipinclose',
      components: {
        main: Yipinclose,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/reserecord',
      name: 'Reserecord',
      components: {
        main: Reserecord,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/localshop',
      name: 'Localshop',
      components: {
        main: Localshop,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/payrecord',
      name: 'Payrecord',
      components: {
        main: Payrecord,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/video',
      name: 'Video',
      components: {
        main: Video,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/recreation',
      name: 'Recreation',
      components: {
        main: Recreation,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/turntable',
      name: 'Turntable',
      components: {
        main: Turntable,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/moneyTree',
      name: 'MoneyTree',
      components: {
        main: MoneyTree,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/prize',
      name: 'Prize',
      components: {
        main: Prize,
      },
      meta: {
        index: 4,
      }
    },

    {
      path: '/turnresult',
      name: 'Turnresult',
      components: {
        main: Turnresult,
      },
      meta: {
        index: 5,
      }
    },
    {
      path: '/message',
      name: 'Message',
      components: {
        main: Message,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/newsDetail',
      name: 'NewsDetail',
      components: {
        main: NewsDetail,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/adoptRecord',
      name: 'AdoptRecord',
      components: {
        main: AdoptRecord,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/adoptDetail',
      name: 'AdoptDetail',
      components: {
        main: AdoptDetail,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/friendrequest',
      name: 'Friendrequest',
      components: {
        main: Friendrequest,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/friend',
      name: 'Friend',
      components: {
        main: Friend,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/stealingfood',
      name: 'Stealingfood',
      components: {
        main: Stealingfood,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/addfriend',
      name: 'Addfriend',
      components: {
        main: Addfriend,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/friendfame',
      name: 'Friendfame',
      components: {
        main: Friendfame,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/management',
      name: 'Management',
      components: {
        main: Management,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/myfarm',
      name: 'Myfarm',
      components: {
        main: Myfarm,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/gamemall',
      name: 'Gamemall',
      components: {
        main: Gamemall,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/deal',
      name: 'Deal',
      components: {
        main: Deal,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/dealranking',
      name: 'Dealranking',
      components: {
        main: Dealranking,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/cultivators',
      name: 'Cultivators',
      components: {
        main: Cultivators,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/seedDetail',
      name: 'SeedDetail',
      components: {
        main: SeedDetail,
      },
      meta: {
        index: 5,
      }
    },
    {
      path: '/seed',
      name: 'Seed',
      components: {
        main: Seed,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/fertilizer',
      name: 'Fertilizer',
      components: {
        main: Fertilizer,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/recharge',
      name: 'Recharge',
      components: {
        main: Recharge,
      },
      meta: {
        index: 7,
      }
    },
    {
      path: '/rechDetail',
      name: 'RechDetail',
      components: {
        main: RechDetail,
      },
      meta: {
        index: 8,
      }
    },
    {
      path: '/withdraw',
      name: 'Withdraw',
      components: {
        main: Withdraw,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/withDetail',
      name: 'WithDetail',
      components: {
        main: WithDetail,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/conver',
      name: 'Conver',
      components: {
        main: Conver,
      },
      meta: {
        index: 7,
      }
    },
    {
      path: '/converDetail',
      name: 'ConverDetail',
      components: {
        main: ConverDetail,
      },
      meta: {
        index: 8,
      }
    },
    {
      path: '/farmDetail',
      name: 'FarmDetail',
      components: {
        main: FarmDetail,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/vote',
      name: 'Vote',
      components: {
        main: Vote,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/redpacket',
      name: 'RedPacket',
      components: {
        main: RedPacket,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/redopen',
      name: '/Redopen',
      components: {
        main: Redopen,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/redmoreopen',
      name: '/Redmoreopen',
      components: {
        main: Redmoreopen,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/receiveRed',
      name: 'ReceiveRed',
      components: {
        main: ReceiveRed,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/shareRed',
      name: 'ShareRed',
      components: {
        main: ShareRed,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/manycard',
      name: 'Manycard',
      components: {
        main: Manycard,
      },
      meta: {
        index: 5,
      }
    },
    {
      path: '/buymanycard',
      name: 'Buymanycard',
      components: {
        main: Buymanycard,
      },
      meta: {
        index: 6,
      }
    },
    {
      path: '/generDetail',
      name: 'GenerDetail',
      components: {
        main: GenerDetail,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/orchard',
      name: 'Orchard',
      components: {
        main: Orchard,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/rural',
      name: 'Rural',
      components: {
        main: Rural,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/pasture',
      name: 'Pasture',
      components: {
        main: Pasture,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/myGroup',
      name: 'MyGroup',
      components: {
        main: MyGroup,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/recommend',
      name: 'Recommend',
      components: {
        main: Recommend,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/busEnter',
      name: 'BusEnter',
      components: {
        main: BusEnter,
      },
      meta: {
        index: 6,
      }
    },
    {
      path: '/enterAgreement',
      name: 'EnterAgreement',
      components: {
        main: EnterAgreement,
      },
      meta: {
        index: 7,
      }
    },
    {
      path: '/returnGrain',
      name: 'ReturnGrain',
      components: {
        main: ReturnGrain,
      },
      meta: {
        index: 7,
      }
    },
    {
      path: '/busUp',
      name: 'BusUp',
      components: {
        main: BusUp,
      },
      meta: {
        index: 7,
      }
    },
    {
      path: '/superEnter',
      name: 'SuperEnter',
      components: {
        main: SuperEnter,
      },
      meta: {
        index: 6,
      }
    },
    {
      path: '/marketAgreement',
      name: 'MarketAgreement',
      components: {
        main: MarketAgreement,
      },
      meta: {
        index: 7,
      }
    },
    {
      path: '/travel',
      name: 'Travel',
      components: {
        main: Travel,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/applyTravel',
      name: 'ApplyTravel',
      components: {
        main: ApplyTravel,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/contactSer',
      name: 'ContactSer',
      components: {
        main: ContactSer,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/aboutUs',
      name: 'AboutUs',
      components: {
        main: AboutUs,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/cardBag',
      name: 'CardBag',
      components: {
        main: CardBag,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/blackDetail',
      name: 'BlackDetail',
      components: {
        main: BlackDetail,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/addmember',
      name: 'Addmember',
      components: {
        main: Addmember,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/memberDetail',
      name: 'MemberDetail',
      components: {
        main: MemberDetail,
      },
      meta: {
        index: 6,
      }
    },
    {
      path: '/gulianDetail',
      name: 'GulianDetail',
      components: {
        main: GulianDetail,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/setting',
      name: 'Setting',
      components: {
        main: Setting,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/phone',
      name: 'Phone',
      components: {
        main: Phone,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/autonym',
      name: 'Autonym',
      components: {
        main: Autonym,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/bankcard',
      name: 'Bankcard',
      components: {
        main: Bankcard,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/wechat',
      name: 'Wechat',
      components: {
        main: Wechat,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/alipay',
      name: 'Alipay',
      components: {
        main: Alipay,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/address',
      name: 'Address',
      components: {
        main: Address,
      },
      meta: {
        index: 8,
      }
    },
    {
      path: '/addAddress',
      name: 'AddAddress',
      components: {
        main: AddAddress,
      },
      meta: {
        index: 9,
      }
    },
    {
      path: '/changeAddress',
      name: 'ChangeAddress',
      components: {
        main: ChangeAddress,
      },
      meta: {
        index: 9,
      }
    },
    {
      path: '/dealPassword',
      name: 'DealPassword',
      components: {
        main: DealPassword,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/changepass',
      name: 'Changepass',
      components: {
        main: Changepass,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/store',
      name: 'Store',
      components: {
        main: Store,
      },
      meta: {
        index: 3,
      }
    },
    {
      path: '/classify',
      name: 'Classify',
      components: {
        main: Classify,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/comDetails',
      name: 'ComDetails',
      components: {
        main: ComDetails,
      },
      meta: {
        index: 5,
      }
    },
    {
      path: '/shoppingCar',
      name: 'ShoppingCar',
      components: {
        main: ShoppingCar,
      },
      meta: {
        index: 6,
      }
    },
    {
      path: '/mine',
      name: 'Mine',
      components: {
        main: Mine,
      },
      meta: {
        index: 4,
      }
    },
    {
      path: '/myorder',
      name: 'Myorder',
      components: {
        main: Myorder,
      },
      meta: {
        index: 5,
      }
    },
    {
      path: '/orderDetail',
      name: 'OrderDetail',
      components: {
        main: OrderDetail,
      },
      meta: {
        index: 6,
      }
    },
    {
      path: '/evaluate',
      name: 'Evaluate',
      components: {
        main: Evaluate,
      },
      meta: {
        index: 6,
      }
    },
    {
      path: '/applyAfterSale',
      name: 'ApplyAfterSale',
      components: {
        main: ApplyAfterSale,
      },
      meta: {
        index: 6,
      }
    },
    {
      path: '/busrecom',
      name: 'Busrecom',
      components: {
        main: Busrecom,
      },
      meta: {
        index: 5,
      }
    },
    {
      path: '/mybusgroup',
      name: 'Mybusgroup',
      components: {
        main: Mybusgroup,
      },
      meta: {
        index: 5,
      }
    },
    {
      path: '/closeAccount',
      name: 'CloseAccount',
      components: {
        main: CloseAccount,
      },
      meta: {
        index: 7,
      }
    },
    {
      path: '/submitOrder',
      name: 'SubmitOrder',
      components: {
        main: SubmitOrder,
      },
      meta: {
        index: 8,
      }
    },
  ]
});
