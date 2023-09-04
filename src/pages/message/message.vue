<script setup lang="ts">
import MessageItem from "@/components/message/item.vue";
import { ref } from "vue";
let searchText = ref("");

const onSearchClear = () => {
  searchText.value = " ";
};

const onActionClick = () => {
  console.log(searchText.value);
};
</script>
<template>
  <view class="message">
    <AtSearchBar
      placeholder="搜索聊天记录/联系人"
      v-model:value="searchText"
      @clear="onSearchClear"
      @action-click="onActionClick"
    />
    <MessageItem />
  </view>
</template>

<style lang="scss"></style>
