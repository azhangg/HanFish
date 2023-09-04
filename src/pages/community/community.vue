<script setup lang="ts">
import SocialCard from "@/components/community/SocialCard.vue";

const socialInfos = [
  {
    id: 1,
    text: "的撒大好的记录卡积分单发你打了的阿拉冷淡爱德华把订单哈播撒到拉萨表达了卡萨丁撒开绿灯吧撒肯定撒看德国撒娇的吧啊 近两年打赏",
    imageUrl: "../../assets/images/OIP-C (16).jpg",
    comments: 539,
    likes: 88,
    user: {
      id: 1,
      avatarUrl: "../../assets/images/OIP-C (6).jpg",
      name: "张三封",
      isCollect: false,
    },
  },
  {
    id: 2,
    text: "的撒大好的记录卡积分单发你打了的阿拉冷淡爱德华把订单哈播撒到拉萨表达了卡萨丁撒开绿灯吧撒肯定撒看德国撒娇的吧啊 近两年打赏",
    imageUrl: "../../assets/images/OIP-C (18).jpg",
    comments: 539,
    likes: 88,
    user: {
      id: 1,
      avatarUrl: "../../assets/images/OIP-C (6).jpg",
      name: "张三封",
      isCollect: false,
    },
  },
];
</script>

<template>
  <view class="community">
    <SocialCard
      v-for="item in socialInfos"
      :id="item.id"
      :imageUrl="item.imageUrl"
      :text="item.text"
      :likes="item.likes"
      :user="item.user"
      :comments="item.comments"
    />
  </view>
</template>

<style lang="scss"></style>
