<script setup lang="ts">
import { ref, watchEffect, onMounted, onUnmounted, watch } from "vue";

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
const typeList = ref<tList[]>([]);
const imagesList = ref<imgList[]>([]);

const p = ref(1);
const remd = ref(1);
const typeId = ref(0);
const leftTabShow = ref(false);

const currentImage = ref<imgList | null>(null);
const currentIndex = ref(0);

const getTypeList = async () => {
  const url = `/api/getWallpaperTypeList.xhtml`;
  const res = await (await fetch(url)).json();
  if (res.success) {
    typeList.value = res.list;
  }
};

const getImages = async (type: number = 0, p: number = 0, remd: number = 1) => {
  const url = `/api/getWallpaperList.xhtml?typeid=${type}&remd=${remd}&model=iPhone12,5&pageno=${p}`;
  const res = await (await fetch(url)).json();
  if (res.success) {
    if (p == 1) {
      imagesList.value = res.list;
    } else {
      imagesList.value = imagesList.value.concat(res.list);
    }
  }
};

watch(currentIndex, (newIndex) => {
  currentImage.value = imagesList.value[newIndex];
});

watch([remd, typeId], () => {
  p.value = 1;
  leftTabShow.value = false;
  currentImage.value = null;
});

watchEffect(async () => {
  await getImages(typeId.value, p.value, remd.value);
});

let timer: any = undefined;

const debounce = () => {
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight + 100 > scrollHeight) {
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
  document.addEventListener("scroll", debounce);
});
onUnmounted(() => {
  document.removeEventListener("scroll", debounce);
});
</script>

<template>
  <div class="bg-gradient-to-r from-sky-400 to-indigo-500">
    <!-- 大图 -->
    <div
      class="fixed inset-0 md:left-32 bg-black z-20 overflow-x-auto flex justify-center items-center"
      v-if="currentImage"
    >
      <div class="relative h-full text-slate-300">
        <img
          :src="currentImage.largeurl.replace('http://d.paper.i4.cn','/app4')"
          alt=""
          class="h-full object-scale-down object-center touch-pinch-zoom cursor-zoom-in"
        />
        <!-- 左右切换 -->
        <button
          class="absolute left-0 top-1/2 p-1 bg-slate-600/20 rounded-full"
          @click="currentIndex--"
          v-if="currentIndex > 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-10 h-10"
          >
            <path
              fill-rule="evenodd"
              d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <button
          class="absolute right-0 top-1/2 p-1 rounded-full bg-slate-600/20"
          v-if="currentIndex < imagesList.length - 1"
          @click="currentIndex++"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-10 h-10"
          >
            <path
              fill-rule="evenodd"
              d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <button
        class="fixed right-3 top-3 text-white p-1 rounded-full bg-red-500"
        @click="currentImage = null"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6"
        >
          <path
            fill-rule="evenodd"
            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
    <!-- 左侧列表 -->
    <button
      class="fixed left-2 top-0 flex z-10 bg-red-500 text-gray-300 p-2 rounded-b-full"
      @click="leftTabShow = true"
      :class="leftTabShow ? 'hidden' : ['block', 'md:hidden']"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-6 h-6"
      >
        <path
          fill-rule="evenodd"
          d="M2.25 4.5A.75.75 0 013 3.75h14.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm0 4.5A.75.75 0 013 8.25h9.75a.75.75 0 010 1.5H3A.75.75 0 012.25 9zm15-.75A.75.75 0 0118 9v10.19l2.47-2.47a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 111.06-1.06l2.47 2.47V9a.75.75 0 01.75-.75zm-15 5.25a.75.75 0 01.75-.75h9.75a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <div
      class="fixed md:w-32 inset-y-0 left-0 bg-slate-100 text-gray-600 overflow-auto z-10"
      :class="leftTabShow ? 'block' : ['hidden', 'md:block']"
    >
      <div class="p-2 flex flex-col justify-center items-center gap-2">
        <button
          class="bg-orange-200 text-lg py-1 px-6 rounded-lg"
          @click="(remd = 3), (typeId = 0)"
        >
          精选
        </button>
        <button
          class="bg-red-200 text-lg py-1 px-6 rounded-lg"
          @click="(remd = 1), (typeId = 0)"
        >
          最新
        </button>
        <button
          class="bg-purple-200 text-lg py-1 px-6 rounded-lg"
          @click="(remd = 21), (typeId = 0)"
        >
          排行
        </button>
      </div>
      <div class="p-2 w-full flex flex-col justify-center items-center gap-2">
        <button
          v-for="(t, i) in typeList"
          :key="i"
          class="flex justify-between items-center gap-2 px-2 bg-gray-200 rounded-xl"
          @click="(remd = 4), (typeId = t.id)"
        >
          <img :src="t.icon.replace('http://d.paper.i4.cn','/app4')" class="w-8 h-8 rounded-l-xl" />
          <p class="mr-2 leading-6 py-1">{{ t.name }}</p>
        </button>
      </div>
    </div>
    <!-- 右侧图片 -->
    <div
      class="flex-1 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-6 p-2 md:ml-32 gap-5"
      id="img-list"
    >
      <div
        class="bg-gray-200 rounded-xl flex flex-col justify-center items-center relative"
        v-for="(img, i) in imagesList"
        :key="i"
      >
        <img
          :src="img.smallurl.replace('http://d.paper.i4.cn','/app4')"
          class="rounded-t-xl w-full"
          @click="currentIndex = i"
        />

        <div class="flex w-full p-2 justify-between items-center h-10 gap-5">
          <p class="leading-6 text-gray-400 text-left">
            {{ (parseFloat(img.size) / 1024 / 1024).toFixed(2) }}M
          </p>
          <a
            class="bg-lime-200 rounded-2xl py-1 px-4 text-sm"
            :href="img.largeurl.replace('http://d.paper.i4.cn','/app4')"
            target="_blank"
          >
            下载此壁纸
          </a>
        </div>
        <!-- 徽标 -->
        <p
          class="absolute left-2 top-2 px-2 text-xs leading-5 text-white bg-red-600/50 rounded-full"
        >
          {{ i + 1 }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
