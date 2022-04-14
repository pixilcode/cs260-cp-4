import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import { stories, weekGoals } from "./mock-data.js";

Vue.config.productionTip = false;

function getStartOfWeek(date) {
  const startOfWeek = new Date();
  startOfWeek.setDate(date.getDate() - date.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

const today = new Date();
const sunday = getStartOfWeek(today);
const saturday = getStartOfWeek(today);

saturday.setDate(sunday.getDate() + 6);

const data = {
  stories,
  currWeek: {
    startDay: sunday,
    endDay: saturday,
  },
  weekGoals,
};

new Vue({
  router,
  data,
  render: (h) => h(App),
}).$mount("#app");
