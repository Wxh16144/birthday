export default {
  data: () => ({
    userInfo: {},
    allUser: []
  }),
  computed: {
    isLogin() {
      return !!this.userInfo?.isLogin;
    }
  },
  mounted() {
    this.allUser = this.$ls.get("userList");
    this.userInfo = this.$ls.get("userInfo");
    const routerName = this.$route.name;
    let name = null;
    if (this.isLogin) {
      if (routerName === "login") {
        name = "index";
      }
    } else {
      if (routerName !== "login") {
        name = "login";
      }
    }
    name && this.$router.replace({ name });
  }
};
