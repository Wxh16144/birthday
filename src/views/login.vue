<template lang="pug">
.login
  van-row.login-box
    van-col.input(span="24")
      van-cell-group
        van-field(
          v-model="username", clearable, label="🧚称呼"
          maxlength="12", placeholder="怎么称呼宁呀~")
        van-field(
          v-model="password", type="password", clearable,
          label="💌暗号", placeholder="写小秘密, 不要告诉别人哦~", maxlength="16")
        van-field(
          v-model="affirmPassword", v-if="register", type="password",
          clearable, label="💌确认", maxlength="16", placeholder="不要忘记宁的暗号哦~")
    van-col(span="24")
      van-row(type="flex", justify="space-around")
        van-col(span="10")
          van-button(round, :plain="!register", type="info",
            style="width:100%", @click="registerClick") {{ register ? '注册' : '切到注册' }}
        van-col(span="10")
          van-button( round, :plain="register" type="info", style="width:100%", @click="loginClick") {{ register ? '切到登录' : '登录' }}
  van-popup(v-model="show", round, position="bottom", :close-on-click-overlay="false")
    van-datetime-picker(v-model="birthday", type="date", 
    :min-date="minDate", :max-date="maxDate", :formatter="formatter" 
    @cancel="selectDateOk", @confirm="selectDateOk")
</template>

<script>
import {
  Field,
  Row,
  Col,
  Button,
  CellGroup,
  DatetimePicker,
  Popup,
  Notify,
  Toast
} from "vant";
import { formatTime } from "@/public/utils";
import loginMininx from "@/public/mininx/loginMininx";
export default {
  name: "login",
  mixins: [loginMininx],
  components: {
    [Field.name]: Field,
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
    [CellGroup.name]: CellGroup,
    [Popup.name]: Popup,
    [Toast.name]: Toast,
    [DatetimePicker.name]: DatetimePicker,
    Notify
  },
  data: () => ({
    username: "",
    password: "",
    affirmPassword: "",
    register: false,
    birthday: new Date(1997, 10, 1),
    minDate: new Date(1990, 1, 1),
    maxDate: new Date(2009, 10, 1),
    show: false,
    userList: []
  }),
  methods: {
    formatter(type, value) {
      const obj = {
        year: "年",
        month: "月",
        day: "日"
      };
      return `${value}${obj[type]}`;
    },
    registerClick() {
      if (this.register) {
        const err = this.checkInput();
        if (err) {
          this.$notify({ type: "danger", message: err });
        } else {
          this.$toast("还要选择生日哦~");
          this.show = true;
        }
      } else {
        this.reset([
          `${this.username && "username"}`,
          `${this.password && "password"}`
        ]);
        this.register = true;
      }
    },
    loginClick() {
      if (this.register) {
        this.reset([
          `${this.username && "username"}`,
          `${this.password && "password"}`
        ]);
        this.register = false;
      } else {
        if (this.username === "") {
          this.$notify({ type: "danger", message: "请输入名字哦~" });
          return false;
        }
        if (this.password === "") {
          this.$notify({ type: "danger", message: "请输入密码哦~" });
          return false;
        }
        // 获取用户名和密码匹配的用户
        const userInfo = this.userList.find(({ username, password }) => {
          return this.username === username && this.password === password;
        });
        // 登录成功
        if (userInfo) {
          this.$notify({ type: "success", message: "登录成功~" });
          this.$ls.set(
            "userInfo",
            {
              loginTime: Date.now(),
              _loginTime: formatTime(),
              ...userInfo,
              isLogin: true
            },
            30 * 60 * 1000
          );
          this.reset();
          this.$router.replace({
            name: "index"
          });
        } else {
          this.$notify({ type: "danger", message: "昵称或暗号错啦~" });
        }
      }
    },
    selectDateOk() {
      this.registerFunc();
      this.show = false;
      this.$notify({ type: "success", message: "注册成功" });
      this.register = false;
      // 用户名不清空
      this.reset(["username"]);
    },
    registerFunc() {
      const userInfo = {
        username: this.username,
        password: this.password,
        birthday: new Date(this.birthday).getTime(),
        _birthday: formatTime(this.birthday),
        _createTime: formatTime(),
        userId: Date.now(),
        prizeList: []
      };

      this.$ls.set("userList", [...this.userList, userInfo]);
      this.userList = this.$ls.get("userList");
    },
    checkInput() {
      if (this.username === "") return "昵称不能为空呀~";
      const findIndex = this.userList.findIndex(({ username }) => {
        return username === this.username;
      });
      if (~findIndex) return "有人抢了你的名字~";
      if (this.password === "") return "暗号不能为空呀~";
      if (this.affirmPassword === "") return "确定暗号不能为空呀~";
      if (this.affirmPassword !== this.password) return "两次暗号不一致哦~";
    },
    // 清空表单
    reset(notKey = []) {
      !notKey.includes("username") && (this.username = "");
      !notKey.includes("password") && (this.password = "");
      !notKey.includes("affirmPassword") && (this.affirmPassword = "");
    }
  },
  mounted() {
    this.userList = this.$ls.get("userList", []);
  }
};
</script>
<style lang="stylus" scoped>
@import '~@/public/stylus/variable.styl'

.login
  width 100%
  height 100%
  display flex

  &-box
    width 80%
    background-color #fff
    padding 20px 10px
    border-radius 10px
    overflow hidden
    margin auto

    .input
      margin-bottom 20px
</style>
