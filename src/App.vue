<script setup lang="ts">
import { ref, watchEffect, onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";

type tList = {
  id: number;
  name: string;
  count: number;
  icon: string;
};

type imgList = {
  down: string;
  height: string;
  id: string;
  largeurl: string;
  md5: string;
  middleurl: string;
  size: string;
  smallurl: string;
  width: string;
};
const typeList: Ref<tList[]> = ref([]);

const imagesList: Ref<imgList[]> = ref([]);
const API_URL = "https://app4.i4.cn";

const p = ref(1);
const remd = ref(1);
const currentType = ref(0);

const currentImage = ref(-1);

const getTypeList = async () => {
  const url = `${API_URL}/getWallpaperTypeList.xhtml`;
  const res = await (await fetch(url)).json();
  if (res.success) {
    typeList.value = res.list;
  }
};

const getImages = async (type: number = 0, p: number = 0, remd: number = 1) => {
  const url = `${API_URL}/getWallpaperList.xhtml?typeid=${type}&remd=${remd}&model=iPhone12,5&pageno=${p}`;
  const res = await (await fetch(url)).json();
  if (res.success) {
    if (p == 1) {
      imagesList.value = res.list;
    } else {
      imagesList.value = imagesList.value.concat(res.list);
    }
  }
};

const changeType = (n: number = 0) => (
  (currentType.value = n), (remd.value = 4), (p.value = 1)
);
const changeRemd = (n: number = 0) => (
  (remd.value = n), (currentType.value = 0), (p.value = 1)
);

watchEffect(async () => {
  await getImages(currentType.value, p.value, remd.value);
});

let timer: any = undefined;

const debounce = () => {
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight + 200 > scrollHeight) {
      if (imagesList.value.length % 32 == 0) {
        p.value++;
      }
    }
  }, 500);
};
onMounted(async () => {
  // 获取分类
  await getTypeList();
  // 触底加载
  document.getElementById("img-list")?.addEventListener("scroll", debounce);
});
onUnmounted(() => {
  document.getElementById("img-list")?.removeEventListener("scroll", debounce);
});
</script>

<template>
  <div class="bg-gradient-to-r from-sky-400 to-indigo-500">
    <!-- 大图 -->
    <div
      class="fixed inset-0 left-32 bg-black opacity-95 z-10 overflow-hidden"
      v-if="currentImage >= 0"
      @click="currentImage = -1"
    >
      <img
        :src="imagesList[currentImage].largeurl.replace('http:', '')"
        alt=""
        class="h-full m-auto"
      />
    </div>
    <!-- 左侧列表 -->
    <div
      class="fixed w-32 inset-y-0 left-0 bg-slate-100 text-gray-600 overflow-auto"
    >
      <div class="p-2 flex flex-col justify-center items-center gap-2">
        <button
          class="bg-orange-200 text-lg py-1 px-6 rounded-lg"
          @click="changeRemd(3)"
        >
          精选
        </button>
        <button
          class="bg-red-200 text-lg py-1 px-6 rounded-lg"
          @click="changeRemd(1)"
        >
          最新
        </button>
        <button
          class="bg-purple-200 text-lg py-1 px-6 rounded-lg"
          @click="changeRemd(21)"
        >
          排行
        </button>
      </div>
      <div class="p-2 w-full flex flex-col justify-center items-center gap-2">
        <div
          v-for="(t, i) in typeList"
          :key="i"
          class="flex justify-between items-center gap-2 px-1 md:px-2 bg-gray-200 rounded-xl"
          @click="changeType(t.id)"
        >
          <img
            :src="t.icon.replace('http:', '')"
            class="w-8 h-8 rounded-l-xl"
          />
          <p class="mr-2 leading-6 py-1">{{ t.name }}</p>
        </div>
      </div>
    </div>
    <!-- 右侧图片 -->
    <div
      class="flex-1 h-screen grid md:grid-cols-3 lg:grid-cols-6 ml-32 p-4 gap-5 overflow-scroll"
      id="img-list"
    >
      <div
        class="bg-gray-200 rounded-xl flex flex-col justify-center items-center relative"
        v-for="(img, i) in imagesList"
        :key="i"
      >
        <div class="relative" @click="currentImage = i">
          <img :src="img.smallurl.replace('http:', '')" class="rounded-t-xl" />
        </div>

        <div class="flex w-full p-2 justify-evenly items-center h-10 gap-5">
          <p class="leading-6 text-gray-400 text-left">
            {{ img.down == "0" ? "" : img.down }}
          </p>
          <a
            class="bg-lime-200 rounded-2xl py-1 px-4 text-sm"
            :href="img.largeurl"
            target="_blank"
          >
            下载
          </a>
        </div>
        <!-- 徽标 -->
        <p
          class="absolute left-2 top-2 p-1 text-xs text-white bg-red-600/50 rounded-full"
        >
          {{ i }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
