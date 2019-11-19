import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import Storage from "vue-ls";

Vue.config.productionTip = false;
Vue.use(Storage, {
  storage: "local"
});
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
