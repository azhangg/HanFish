import { VueComponentType } from "@tarojs/components";

let components: VueComponentType[] = [];
const aa = require.context("@components", true, /\.vue/);

export { components, aa };
