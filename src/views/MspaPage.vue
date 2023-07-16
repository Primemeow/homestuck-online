<template>
  <div v-if="!isLoading" class="pageBody" :class="pageBodyClasses">
    <div class="mediaContent">
      <h2 class="pageTitle" v-text="pageData.title" v-if="!isSupercartridge" ref="pageTitle"/>
      <div class="media" ref="media">
        <media-embed v-for="url in pageMedia" :key="url" :url="url" class="mediaElement"/>
      </div>
    </div>
    <div class="textContent">
      <page-text v-if="pageData.content" :content="pageData.content" :page-id="pageData.pageId"/>
      <page-navigation :this-page="store.currentPage" :next-pages="nextPagesArray" 
      :previous-page-link="previousPageLink" :start-over-link="startOverLink" :story="story"
      ref="pageNav" :class="{'hidden': hidePageNav}" />
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
import PageNavigation from '../components/PageNavigation.vue';
import MediaEmbed from '../components/MediaEmbed.vue';
import { computed,  onMounted, ref, onBeforeUnmount, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMspaStore } from '../store/mspaStore';
import { RETCON_6_PASSWORD_PAGES } from '../constants/retcon';

const store = useMspaStore();
const route = useRoute();
const router = useRouter();

const retcon6PasswordPages = ref(RETCON_6_PASSWORD_PAGES);

let story = computed(() => route.params.story);
let page = computed(() => route.params.page);
let isLoading = computed(() => store.isLoading);

const pageBodyClasses = computed(() => {
  const classes = [];
  if (isSupercartridge.value) classes.push('supercartridge');
  if (isScratchIntermission.value) classes.push('scratchIntermission');
  return classes;
})

const isSupercartridge = computed(() => {
  return store?.currentPage?.flag?.includes('S');
})

const hidePageNav = computed(() => {
  return store?.currentPage?.flag?.includes('H');
})

const isScratchIntermission = computed(() => {
  return store.currentPage.theme == 'scratch';
})

const nextPageLink = computed(() => {
  if (store.currentPage && story.value) {
    return `/${story.value}/${store.currentPage.next[0]}`;
  }
  return '#';
})

const nextPagesArray = computed(() => {
  let nextPages = []
  store.currentPage.next.forEach((nextPageNumber) => {
    // Removes [??????] password links if the retcon hasn't been triggered yet
    if (!shouldRetcon('retcon6') && retcon6PasswordPages.value.includes(nextPageNumber)) return
    nextPages.push(store.mspaJson.story[nextPageNumber])
  })
  console.log(nextPages);
  return nextPages;
})

const previousPageLink = computed(() => {
  if (store.currentPage && store.currentPage.previous && story.value) {
    return `/${story.value}/${store.currentPage.previous}`;
  }
  return '#';
})

const startOverLink = computed(() => {
  if (story.value) {
    return `/${story.value}/`;
  }
  return '#';
})

const nextPageTitle = computed(() => {
  if (store.currentPage && store.currentPage.next && store.mspaJson && story.value) {
    const nextPageNumber = store.currentPage.next[0];
    return store.mspaJson.story[nextPageNumber]?.title || "Next";
  }
  return "Next";
})

const audioDataOverrides = computed(() => {
  // TODO: add opinionated bolin replacements and such here
  return {};
})

const audioData = computed(() => {
  const media = Array.from(store.currentPage.media)
  deretcon(media)
  return audioDataOverrides[media[0]]
})

const pageMedia = computed(() => {
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

</style>