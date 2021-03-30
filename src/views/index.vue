<template lang="pug">
#index
  van-button.like-btn(icon="like", round, plain, size="small", 
    type="danger", @click="showSelect = true"
    :style="{top: equipment === 'android' ? '60px': ''}")
  van-icon.music-btn(v-if="isBirthday" :class="{'rotate-pause': closeSound }", 
    name="music-o", color="#ee0a24", @click="musicClick",
   :style="{top: equipment === 'android' ? '60px': ''}")
  van-row.box(type="flex", justify="center")
    van-col.count-down(v-if="!isBirthday")
      p(style="text-align:center") 距离宁的生日还有
      van-count-down(:time="time")
        template(v-slot="timeData")
          template(v-if="timeData.days")
            van-tag(round, size="large" type="primary") {{ timeData.days }} 天
            |  : 
          van-tag(round, size="large" type="success") {{ timeData.hours }} 时
          |  : 
          van-tag(round, size="large" type="warning") {{ timeData.minutes }} 分
          |  : 
          van-tag(round , size="large" type="danger") {{ timeData.seconds }} 秒
    van-col.bg(v-else)
      video#video(ref="video" poster="@/assets/loading.gif", loop, autoplay,
        :class="theScreen", playsinline, webkit-playsinline,
        x5-video-player-type="h5", preload="auto", x-webkit-airplay="allow", x5-playsinline, x5-video-player-fullscreen="true")
          source(src="@/assets/video.mp4", type="video/mp4")
          //- source(src="@/assets/video.Ogg", type="video/ogg")
          source(src="@/assets/video.webm", type="video/webm")
      //- //- 弹幕区
      //- vue-seamless-scroll.seamless-warp(:data="bulletScreenList" :class-option="classOption", :class="theScreen")
      //-   ul.item
      //-     li(v-for="item in bulletScreenList", v-text="item.title")
  //- 选择框
  van-action-sheet( v-model="showSelect" :actions="selectActions" @select="onSelect" cancel-text="取消")
  //- 兑奖框
  van-dialog(v-model="showRedeemPrize", title="兑奖啦~", show-cancel-button,
  confirmButtonText="👌兑换", cancelButtonText="❌不领", @confirm="redeemPrizeClick")
    van-field.redeem(v-model.number="redeemPrizeNumber", label="🤑兑奖码", min="1000", max="9999"
      right-icon="question-o",  placeholder="输入兑奖码哦~", type="number", :maxlength="4"
      @click-right-icon="$toast('输入4位兑奖码')")
  //- 列表框
  van-action-sheet(v-model="showPrizeList", title="宁的礼物")
    template(v-if="prizeList.length")
      van-list.prize-list-box(:finished="true")
        van-cell.list(v-for="(prize, index) in prizeList", :key="index")
          van-row(type="flex", justify="space-between")
            van-col(span="8")
              van-image(width="80" height="80" round fit="cover" :src="prize.prizeImage")
            van-col.desc-box(span="15")
              p {{ prize.prizeDesc }}
    p(v-else style="text-align:center;line-height:80px") 空空的, 去领取礼物鸭~
  //- 兑奖框
  van-dialog(v-model="showReceivePrize", :title="receivePrize.prizeDesc", confirmButtonText="👌收下啦",@confirm="furlClick")
    van-row(type="flex", justify="center")
      van-col(span="24")
        van-image.prize-img(width="100%", height="100%", fit="contain" :src="receivePrize.prizeImage")
</template>
<script>
import loginMininx from "@/public/mininx/loginMininx";
import { formatTime, getMorningTime, equipment } from "@/public/utils";
import vueSeamless from "vue-seamless-scroll";
import {
  CountDown,
  Tag,
  Row,
  Col,
  Button,
  ActionSheet,
  Field,
  Toast,
  Dialog,
  List,
  Cell,
  Image,
  Icon,
  Notify
} from "vant";
const fly = require("flyio");
export default {
  name: "index",
  mixins: [loginMininx],
  components: {
    [CountDown.name]: CountDown,
    [Tag.name]: Tag,
    [Row.name]: Row,
    [Button.name]: Button,
    [ActionSheet.name]: ActionSheet,
    [Dialog.Component.name]: Dialog.Component,
    [Field.name]: Field,
    [Toast.name]: Toast,
    [List.name]: List,
    [Col.name]: Col,
    [Cell.name]: Cell,
    [Icon.name]: Icon,
    [Image.name]: Image,
    [Notify.name]: Notify,
    "vue-seamless-scroll": vueSeamless
  },
  data: () => ({
    showSelect: false, // 选择框
    showRedeemPrize: false, // 兑奖框
    showPrizeList: false, // 奖品列表框
    redeemPrizeNumber: "", // 兑奖码
    listenerEvent: "resize",
    theScreen: "vertical",
    giftList: [], // 礼物池
    closeSound: false, // 关闭声音
    equipment: equipment(), // 设备
    showReceivePrize: false, // 显示礼物
    receivePrize: {}, // 礼物信息
    classOption: {
      hoverStop: false,
      direction: 2,
      limitMoveNum: 2
    },
    bulletScreenList: [], // 弹幕数据
    _time: null
  }),
  computed: {
    isBirthday() {
      const { _birthday, birthday = _birthday } = this.userInfo;
      const birthdayMonthDay = formatTime(birthday, "MMdd");
      const currentMonthDay = formatTime(Date.now(), "MMdd");
      return birthdayMonthDay === currentMonthDay;
    },
    time() {
      const { _birthday, birthday = _birthday } = this.userInfo;
      const birthdayMonthDay = formatTime(birthday, "MMdd");
      const currentMonthDay = formatTime(Date.now(), "MMdd");
      const currentYear = formatTime(Date.now(), "yyyy");
      console.log(birthdayMonthDay, currentMonthDay, currentYear);

      // 计算差异
      const differ = (date, year) =>
        new Date(formatTime(date, `${year}/MM/dd`)).getTime();
      // 还没到生日
      if (currentMonthDay < birthdayMonthDay) {
        return differ(birthday, currentYear) - Date.now();
      } else if (currentMonthDay > birthdayMonthDay) {
        const time = differ(Date.now(), +currentYear + 1);
        return getMorningTime(time - Date.now());
      } else {
        return 0;
      }
    },
    selectActions() {
      return [
        {
          name: "🏃退出登录",
          key: "logOut"
        },
        {
          name: "🎉兑换礼物",
          disabled: !this.isBirthday,
          subname: this.isBirthday ? "" : "生日当天才能兑换哦~",
          key: "redeemPrize"
        },
        {
          name: "🎁我的礼物",
          disabled: !this.isBirthday,
          subname: this.isBirthday ? "" : "别着急，生日还到呀~",
          key: "priizeList"
        }
      ];
    },
    prizeList() {
      return this.userInfo.prizeList || [];
    }
  },
  methods: {
    logOut() {
      this.$dialog
        .confirm({
          message: "🥰记得想我好不好~",
          confirmButtonText: "好😘",
          cancelButtonText: "不好☹️"
        })
        .then(() => {
          this.saveData({
            _lastOut: formatTime(),
            lastOut: Date.now(),
            isLogin: false
          });
          this.$ls.remove("userInfo");
          this.$router.replace({ name: "login" });
        });
    },
    onSelect({ key }) {
      if (key === "logOut") {
        this.logOut();
      } else if (key === "priizeList") {
        this.showPrizeList = true;
      } else if (key === "redeemPrize") {
        this.showRedeemPrize = true;
      }
      this.showSelect = false;
    },
    listenerEventFunction() {
      if (window.orientation === 180 || window.orientation === 0) {
        this.theScreen = "vertical";
      }
      if (window.orientation === 90 || window.orientation === -90) {
        this.theScreen = "across";
      }
    },
    getPrizeListsByServer() {
      return fly
        .get(
          "https://gist.githubusercontent.com/Wxh16144/45c3aa2ad2e7277dc96262f87caa60ef/raw/giftLists.json",
          { _: Date.now() }
        )
        .then(({ status, data = {} }) => {
          if (status === 200 && data.code === 200) {
            this.giftList = data.giftList || [];
            this.bulletScreenList = data.bulletScreenList || [];
            this.$ls.set("giftList", this.giftList);
          } else {
            this.$notify({ type: "danger", message: "礼物包开小差啦~" });
          }
        });
    },
    musicClick() {
      const { video } = this.$refs;
      if (video.muted) {
        video.muted = false;
        this.closeSound = false;
      } else {
        video.muted = true;
        this.closeSound = true;
      }
    },
    // 兑奖click
    redeemPrizeClick() {
      // 先判断有没有兑换
      const oldIndex = this.prizeList.findIndex(({ number = -1 }) => {
        return this.redeemPrizeNumber === number;
      });
      if (~oldIndex) {
        // 已经存在
        this.$notify({ type: "danger", message: "已经兑换过啦, 不要贪心哦~" });
        this.redeemPrizeNumber = "";
        return false;
      }
      // 去奖品池查找礼物
      const prize = this.giftList.find(({ number }) => {
        return this.redeemPrizeNumber === number;
      });
      if (prize) {
        // 这里就是兑奖查询到的礼物
        this.award(prize);
      } else {
        this.$notify({ type: "danger", message: "兑奖码不存在，仔细检查哦~" });
      }
      this.redeemPrizeNumber = "";
    },
    award(prize) {
      this.receivePrize = prize;
      this.showReceivePrize = true;
    },
    // 收礼
    furlClick() {
      this.userInfo.prizeList.unshift(this.receivePrize);
      this.$notify({
        type: "success",
        message: "领取成功~快去我的礼物里面看看吧~"
      });
    },
    saveData(needSaveData = {}) {
      const { userId, prizeList = [] } = this.userInfo;
      let newAllUser = this.allUser.filter(({ userId: uId }) => userId !== uId);
      newAllUser.push(
        Object.assign(this.userInfo, {
          prizeList,
          _lastSave: formatTime(),
          lastSave: Date.now(),
          ...needSaveData
        })
      );
      this.$ls.set("userList", newAllUser);
    }
  },
  mounted() {
    this.listenerEvent =
      "onorientationchange" in window ? "orientationchange" : "resize";
    this.listenerEventFunction();
    window.addEventListener(this.listenerEvent, this.listenerEventFunction);
    this._time = setInterval(() => {
      this.saveData();
    }, 10000);
    // 获取数据
    this.getPrizeListsByServer();
    if (this.isBirthday) {
      this.$dialog
        .alert({
          title: "🎉生日到啦🎉",
          message: "🎉健康美丽🎂开心久久。🎉",
          confirmButtonText: "生日快乐"
        })
        .then(() => {
          const { video } = this.$refs;
          setTimeout(() => video.play(), 500);
        });
    }
  },
  destroyed() {
    window.removeEventListener(this.listenerEvent, this.listenerEventFunction);
    clearInterval(this._time);
  }
};
</script>
<style lang="stylus" scoped>
@import '~@/public/stylus/variable.styl'

#index
  width 100%
  height 100%
  position relative
  display flex
  overflow hidden

  .box
    width 100%
    height 100%
    margin auto

    .count-down
      display flex
      flex-direction column
      justify-content center

  .like-btn
    position absolute
    right 20px
    top 20px
    z-index 99

  // 音乐
  .music-btn
    position absolute
    top 20px
    left 20px
    z-index 99
    font-size 28px
    display inline-block
    flex 0 0 auto
    animation rotating 2.6s linear infinite
    animation-play-state running

    &.rotate-pause
      animation-play-state paused

  .bg
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center

  #video
    object-fit cover

    // background url('~@/assets/loading.gif') cover no-repeat
    &.vertical
      transform rotate(90deg)
      min-height 100vw
      min-width 100vh

    &.across
      width 100vw
      height 100vh
      transform rotate(0deg)

  // 兑奖框
  .redeem
    margin 12px 0

  .prize-list-box
    max-height 80%
    min-height 20%
    overflow-y auto
    overflow-x hidden

    .list
      padding 0 24px

    .desc-box
      display flex
      align-items center
      font-size 16px

.prize-img
  max-height 320px
</style>
