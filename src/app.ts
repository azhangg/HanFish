import { createApp } from "vue";
import { createPinia } from "pinia";
import { createUI } from "taro-ui-vue3";
import NutUI from "@nutui/nutui-taro";

import "./app.scss";
import "taro-ui-vue3/dist/style/index.scss";
import "uno.css";
import "@nutui/nutui-taro/dist/style.css";

const App = createApp({
  onShow(options) {},
});

App.use(NutUI);
App.use(createPinia());
App.use(createUI());

export default App;
