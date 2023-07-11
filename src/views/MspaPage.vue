<template>
  <div v-if="!isLoading">
    <h1>{{ pageData.title }}</h1>
    <div v-for="(assetSrc, index) in pageData.assets" :key="index">
      <object v-if="isSwf" :data="assetSrc" type="application/x-shockwave-flash"></object>
      <img v-else :src="assetSrc" />
    </div>
    <p v-html="pageData.content"></p>
    <div class="command">
      <router-link :to="nextPageLink">{{ nextPageTitle }}</router-link>
    </div>
    <router-link :to="startOverLink">Start Over</router-link>
    <router-link :to="previousPageLink">Go Back</router-link>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { computed,  onMounted, onBeforeUnmount, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMspaStore } from '../store/mspaStore';

const store = useMspaStore();
const route = useRoute();
const router = useRouter();

let story = computed(() => route.params.story);
let page = computed(() => route.params.page);
let isLoading = computed(() => store.isLoading);

let nextPageLink = computed(() => {
  if (store.currentPage && story.value) {
    return `/${story.value}/${store.currentPage.next[0]}`;
  }
  return '#';
})
let previousPageLink = computed(() => {
  if (store.currentPage && store.currentPage.previous && story.value) {
    return `/${story.value}/${store.currentPage.previous}`;
  }
  return '#';
})
let startOverLink = computed(() => {
  if (story.value) {
    return `/${story.value}/`;
  }
  return '#';
})

let isSwf = computed(() => {
  if (store.currentPage && store.currentPage.assets) {
    return store.currentPage.flag.includes('F');
  }
  return false;
})

let nextPageTitle = computed(() => {
  if (store.currentPage && store.currentPage.next && store.mspaJson && story.value) {
    const nextPageNumber = store.currentPage.next[0];
    return store.mspaJson.story[nextPageNumber]?.title || "Next";
  }
  return "Next";
})

watchEffect(async () => {
  if (!store.mspaJson) {
    await store.fetchMSPAJson();
  }
  await store.fetchPage({ story: story.value, page: page.value });
})

let pageData = computed(() => store.currentPage);

onMounted(() => {
  const handleKeyDown = (event) => {
    switch(event.key) {
      case 'ArrowRight':
        if (store.currentPage && store.currentPage.next) {
          router.push(nextPageLink.value);
        }
        break;
      case 'ArrowLeft':
        if (store.currentPage && store.currentPage.previous) {
          router.push(previousPageLink.value);
        }
        break;
    }
  }
  window.addEventListener('keydown', handleKeyDown);

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown);
  })
})
</script>
<style lang="scss" scoped>
.command {
  font-size: 1.5rem;
}
</style>