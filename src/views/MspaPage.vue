<template>
  <div v-if="!isLoading">
    <h1>{{ pageData.title }}</h1>
    <div class="media-content">
      <div class="media" ref="media">
        <media-embed v-for="url in pageMedia" :key="url" :url="url" class="media-element"/>
      </div>
    </div>
    <div class="text-content">
      <page-text v-if="pageData.content" :content="pageData.content" :page-id="pageData.pageId"/>
    </div>
    <div class="command">
      <router-link :to="nextPageLink">{{ nextPageTitle }}</router-link>
    </div>
    <router-link :to="startOverLink">Start Over</router-link>
    <router-link :to="previousPageLink">Go Back</router-link>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import PageText from '../components/PageText.vue';
import MediaEmbed from '../components/MediaEmbed.vue';
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

let nextPageTitle = computed(() => {
  if (store.currentPage && store.currentPage.next && store.mspaJson && story.value) {
    const nextPageNumber = store.currentPage.next[0];
    return store.mspaJson.story[nextPageNumber]?.title || "Next";
  }
  return "Next";
})

let audioDataOverrides = computed(() => {
  // TODO: add opinionated bolin replacements and such here
  return {};
})

let audioData = computed(() => {
  const media = Array.from(store.currentPage.media)
  deretcon(media)
  return audioDataOverrides[media[0]]
})

let pageMedia = computed(() => {
  const media = Array.from(store.currentPage.media)
  deretcon(media)
  const mediakey = media[0]

  if (mediakey) {
    if (audioData.value) {
      const flashPath = mediakey.substring(0, mediakey.length - 4)
      media[0] = `${flashPath}_hq.swf`
    } 
  }

  return media
});

function shouldRetcon(retconId) {
  // TODO: implement this (localStorage?)
  return true;
}

function deretcon(media) {
  if (
  (store.currentPage.flag.includes('R1') && shouldRetcon('retcon1')) ||
  (store.currentPage.flag.includes('R2') && shouldRetcon('retcon2')) ||
  (store.currentPage.flag.includes('R3') && shouldRetcon('retcon3')) ||
  (store.currentPage.flag.includes('R4') && shouldRetcon('retcon4')) ||
  (store.currentPage.flag.includes('R5') && shouldRetcon('retcon5')) ){
      for (let i in media) {
        media[i] = media[i]
        .replace(/1([0-9]{4})\/1[0-9]{4}\.swf/g, "0$1/0$1.swf")
        .replace(/_?retcon(heir)?/, "");
      }
  }
  return media
};

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