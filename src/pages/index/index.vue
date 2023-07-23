<template>
  <view class="index">
    <Counter />
  </view>
</template>

<script>
import "./index.scss";
import Counter from "@components/Counter.vue";
import { aa } from "@utils/autoimport.ts";

// console.log(aa);

export default {
  name: "Index",
  components: {
    Counter,
  },
};
</script>
