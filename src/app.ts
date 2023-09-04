import { createApp } from "vue";
import { createPinia } from "pinia";
import { createUI } from "taro-ui-vue3";

import "./app.scss";
import "taro-ui-vue3/dist/style/index.scss";

const App = createApp({
  onShow(options) {},
});

App.use(createPinia());
App.use(createUI());

export default App;
