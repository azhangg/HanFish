<script setup lang="ts">
import type { PostType } from "@/models/post/post";
import type { PostCommentType } from "@/models/post/postComment";

import { onMounted, ref, computed } from "vue";
import Taro, { nextTick } from "@tarojs/taro";
import { BASE_URL, PICTURE_ICON } from "@/utils/config";
import { getTime, goLogin, msg, goPage } from "@/utils/common";
import { getPostByIdReq } from "@/apis/post";
import {
  getPostCommentsByPostIdReq,
  addPostCommentReq,
  deletePostCommentReq,
} from "@/apis/postComment";
import Comment from "@/components/community/comment.vue";
import { useAccount } from "@/hooks/useAccount";
import { addPostCollectReq, deletePostCollectReq } from "@/apis/postCollect";
import { addPostLikeReq, deletePostLikeReq } from "@/apis/postLike";
import { addChatMessageReq } from "@/apis/chatMessage";
import { useStore } from "@/stores";

import icon_like from "@/assets/icon/ico_likes.png";
import icon_like_active from "@/assets/icon/ico_likes (1).png";

const uploadFileRef = ref();

const inputRef = ref();

const UPLOADURL = `${BASE_URL}/api/Files/UploadFile`;

const { accessToken } = useStore();

const REQUEST_HEADER = {
  Authorization: `Bearer ${accessToken}`,
};

let isCollect = false;
let isLike = false;

const commentImgUrl = ref("");

const collectState = ref(0);

const showImgPreview = ref(false);

const actionSheetVisible = ref(false);

const currentCommentId = ref(0);

const currentUserId = ref(0);

const into = ref(0);

const comment = ref("");

const inputFocus = ref(false);

const fileList = ref<any[]>([]);

const postInfo = ref<PostType>({
  id: 0,
  text: "",
  status: "",
  imgUrls: [],
  createTime: new Date(),
  publisherId: 0,
  comments: 0,
  likes: 0,
  collects: 0,
  isCollect: false,
  isLike: false,
  publisher: {
    id: 0,
    name: "",
    email: "",
    roleId: 0,
    loginName: "",
    createTime: new Date(),
  },
});

const comments = ref<PostCommentType[]>([]);

const previewImgs = computed(() => {
  if (commentImgUrl.value) {
    return [{ src: `${BASE_URL}/${commentImgUrl.value}` }];
  } else {
    return postInfo.value.imgUrls.map((url) => {
      return { src: `${BASE_URL}/${url}` };
    });
  }
});

const getPostInfo = (id: number) => {
  getPostByIdReq(id, (res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      postInfo.value = data;
      postInfo.value.isCollect = isCollect;
      postInfo.value.isLike = isLike;
    } else {
      msg("该帖子不存在");
      const eventChannel =
        Taro.getCurrentPages()[
          Taro.getCurrentPages().length - 1
        ]?.getOpenerEventChannel();
      if (eventChannel) {
        eventChannel.emit("acceptDataFromPostDetail");
      }
      setTimeout(() => {
        Taro.navigateBack();
      }, 1000);
    }
  });
};

const getPostComments = (postId: number) => {
  getPostCommentsByPostIdReq(postId, (res) => {
    const { isSuccess, data } = res.data;
    if (isSuccess) {
      comments.value = data;
    }
  });
};

const sendCommunityMessage = (comment: PostCommentType) => {
  comment.avatarUrl = useStore().userInfo.avatarUrl;
  comment.userName = useStore().userInfo.name;
  if (comment.pId == 0) {
    if (useStore().userInfo.id != postInfo.value.publisherId)
      addChatMessageReq(
        {
          senderId: 0,
          receiverId: postInfo.value.publisherId,
          content: JSON.stringify({
            postInfo: postInfo.value,
            comment: comment,
          }),
          type: 5,
        },
        (_) => {}
      );
  } else {
    const receiverComment = comments.value.find((c) => c.id === comment.pId);
    if (receiverComment)
      addChatMessageReq(
        {
          senderId: 0,
          receiverId: receiverComment.userId,
          content: JSON.stringify({
            postInfo: postInfo.value,
            comment: comment,
            receiveComment: receiverComment,
          }),
          type: 5,
        },
        (_) => {}
      );
  }
};

const getActionSheetItems = () => {
  const items: { name: string }[] = [];
  if (useStore().userInfo.id != currentUserId.value)
    items.push({ name: "回复" });
  if (useStore().userInfo.id === currentUserId.value)
    items.push({ name: "删除" });
  return items;
};

const addComment = () => {
  if (!comment.value || comment.value.trim() === "") {
    comment.value = "";
    msg("请输入评论");
    return;
  }
  addPostCommentReq(
    {
      postId: postInfo.value.id,
      comment: comment.value,
      imgUrl:
        fileList.value.length > 0
          ? fileList.value.find((f) => f.status === "success").name
          : undefined,
      pId: currentCommentId.value,
    },
    (res) => {
      const { isSuccess, data } = res.data;
      if (isSuccess) {
        getPostComments(postInfo.value.id);
        postInfo.value.comments += 1;
        comment.value = "";
        fileList.value = [];
        inputFocus.value = false;
        inputRef.value.blur();

        //社区消息
        sendCommunityMessage(data);
      }
      currentCommentId.value = 0;
    }
  );
};

const onImgTap = (index: number) => {
  commentImgUrl.value = "";
  showImgPreview.value = true;
  into.value = index;
};

const onCollectTap = () => {
  if (useAccount().isLogin) {
    collectState.value === 1
      ? addPostCollectReq(postInfo.value.id, (res) => {
          const { isSuccess } = res.data;
          if (isSuccess) {
            postInfo.value.collects += 1;
          }
        })
      : deletePostCollectReq(postInfo.value.id, (res) => {
          const { isSuccess } = res.data;
          if (isSuccess) {
            postInfo.value.collects -= 1;
          }
        });
  } else {
    goLogin();
  }
};

const onLikeTap = () => {
  if (useAccount().isLogin) {
    isLike = !isLike;
    postInfo.value.isLike = isLike;
    isLike
      ? addPostLikeReq(postInfo.value.id, (res) => {
          const { isSuccess } = res.data;
          if (isSuccess) {
            postInfo.value.likes += 1;
          }
        })
      : deletePostLikeReq(postInfo.value.id, (res) => {
          const { isSuccess } = res.data;
          if (isSuccess) {
            postInfo.value.likes -= 1;
          }
        });
  } else {
    goLogin();
  }
};

const onPictureTap = () => {
  uploadFileRef.value.chooseImage();
};

const onUploadSuccess = (res) => {
  const result = JSON.parse(res.data.data);
  const { isSuccess, data, message } = result;
  if (isSuccess) {
    if (fileList.value.length > 1) fileList.value.shift();
    fileList.value[fileList.value.length - 1].name = data[0];
  } else {
    msg(message ?? "上传失败");
  }
};

const onUploadFailure = () => {
  if (fileList.value.length > 1) fileList.value.shift();
};

const onCommentPublish = () => {
  addComment();
};

const onCommentLonePress = (comment: PostCommentType) => {
  actionSheetVisible.value = true;
  currentCommentId.value = comment.id;
  currentUserId.value = comment.userId;
};

const onActionSheetChoose = ({ name }) => {
  switch (name) {
    case "回复":
      inputRef.value.focus();
      break;
    case "删除":
      deletePostCommentReq(currentCommentId.value, (res) => {
        const { isSuccess } = res.data;
        if (isSuccess) {
          getPostComments(postInfo.value.id);
        }
      });
      break;
    default:
      break;
  }
};

const onInputBlur = () => {
  currentCommentId.value = 0;
  inputFocus.value = false;
  inputRef.value.blur();
};

const onCommentImgClick = (url?: string) => {
  if (url) {
    commentImgUrl.value = url;
    showImgPreview.value = true;
    into.value = 0;
  }
};

const onInputFocus = () => {
  inputRef.value.focus();
  inputFocus.value = true;
};

onMounted(() => {
  const { params } = Taro.useRouter();
  isCollect = params.isCollect == "true";
  isLike = params.isLike == "true";
  const postId = Number(params.id);
  collectState.value = isCollect ? 1 : 0;
  getPostInfo(postId);
  getPostComments(postId);
  //初始化inputRef
  nextTick(() => {
    inputRef.value.blur();
  });
});
</script>
<template>
  <view class="post-detail">
    <view class="user-info">
      <view
        class="flex items-center gap-2"
        @tap="
          goPage(`/package/user/personal/home?userId=${postInfo.publisher.id}`)
        "
      >
        <image
          v-if="postInfo.publisher.avatarUrl"
          :lazy-load="true"
          :src="`${BASE_URL}/${postInfo.publisher.avatarUrl}`"
        />
        <text>
          {{ postInfo.publisher.name }}
        </text>
      </view>
      <view class="time">
        {{ getTime(postInfo.createTime) }}
      </view>
    </view>
    <view class="content">
      {{ postInfo.text }}
      <view class="flex justify-center flex-wrap">
        <image
          class="m-2 rounded-1"
          v-for="(url, index) in postInfo.imgUrls"
          :lazy-load="true"
          :src="`${BASE_URL}/${url}`"
          @tap="onImgTap(index)"
        />
      </view>
    </view>
    <view class="comment">
      <view class="head"> 评论 • {{ postInfo.comments }} </view>
      <Comment
        v-if="comments.length > 0"
        :data="comments"
        :publisher-id="postInfo.publisherId"
        @on-long-press="onCommentLonePress"
        @on-img-click="onCommentImgClick"
      />
      <view v-else class="text-center c-stone">评论空空如也~</view>
    </view>
    <nut-image-preview
      :show="showImgPreview"
      :images="previewImgs"
      :init-no="into"
      @close="showImgPreview = false"
    />
    <view v-if="inputFocus" class="cover-input" @tap="onInputBlur"></view>
    <view class="bottom-fixed">
      <nut-uploader
        v-if="inputFocus"
        ref="uploadFileRef"
        class="upload"
        :url="UPLOADURL"
        v-model:file-list="fileList"
        name="formFile"
        :headers="REQUEST_HEADER"
        maximum="2"
        :multiple="false"
        @success="onUploadSuccess"
        @failure="onUploadFailure"
      ></nut-uploader>
      <image
        v-if="inputFocus"
        class="w-65 h-65"
        :src="`${BASE_URL}/${PICTURE_ICON}`"
        @tap.stop="onPictureTap"
      />
      <input
        ref="inputRef"
        class="bg-#F5F3F2 c-#696a6d p-2 w-400 rounded-3"
        v-model="comment"
        :cursor-spacing="15"
        placeholder="说点什么~"
        @focus="onInputFocus"
      />
      <nut-button
        v-if="inputFocus"
        type="primary"
        size="small"
        @click="onCommentPublish"
      >
        发布
      </nut-button>
      <view v-else class="flex flex-row-reverse">
        <text>&ensp;{{ postInfo.likes }}</text>
        <image
          :lazy-load="true"
          class="w-40 h40 ml-2"
          :src="postInfo.isLike ? icon_like_active : icon_like"
          @tap.stop="onLikeTap"
        />
        <text>&ensp;{{ postInfo.collects }}</text>
        <nut-rate
          v-model="collectState"
          count="1"
          active-color="#ff6b81"
          @tap.stop="onCollectTap"
        />
      </view>
    </view>
    <nut-action-sheet
      v-model:visible="actionSheetVisible"
      :menu-items="getActionSheetItems()"
      cancel-txt="取消"
      @choose="onActionSheetChoose"
      @cancel="currentCommentId = 0"
      @close="currentCommentId = 0"
    ></nut-action-sheet>
  </view>
</template>
<style lang="scss">
.post-detail {
  display: flex;
  padding: 16rpx;
  flex-direction: column;
  .user-info {
    display: flex;
    align-items: center;
    gap: 16rpx;
    justify-content: space-between;
    image {
      height: 65rpx;
      width: 65rpx;
      border-radius: 50%;
    }
    .time {
      color: #696a6d;
    }
  }
  .content {
    padding: 16rpx;
  }
  .comment {
    padding: 0 16rpx;
    margin-bottom: calc(150rpx + env(safe-area-inset-bottom));
    .head {
      margin-bottom: 16rpx;
    }
  }
  .bottom-fixed {
    width: calc(100% - 32rpx);
    position: fixed;
    bottom: 0;
    left: 0;
    margin: 0;
    padding: 16rpx;
    display: flex;
    background-color: #fff;
    justify-content: space-between;
    align-items: center;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    box-shadow: rgba(0, 0, 0, 0.25) 32rpx 25rpx 50rpx 8rpx;
    .nut-avatar-round {
      overflow: hidden;
    }
  }
  .cover-input {
    position: fixed;
    height: 100%;
    width: 96%;
  }
  .upload {
    position: fixed;
    bottom: 190rpx;
    left: 16rpx;
    pointer-events: none;
    .nut-uploader__upload {
      visibility: hidden;
    }
    .nut-uploader__preview {
      pointer-events: auto;
    }
  }
  .nut-popup {
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  }
}
</style>
