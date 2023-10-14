<template>
    <GenericPage v-if="!isLoading">
        <div class="pageContent" v-if="log">
            <h2 class="pageTitle">Adventure Logs</h2>
            <a v-if="log.length > 0" href="#" class="switchOrder" @click="onClickReverseOrder">{{ reverseText }}</a>
            <div class="logItems" v-if="log.length > 0">
                <span class="line" v-for="page in log" :key="page.id">
                    {{page.date}} - <router-link :to="page.href">{{page.title}}</router-link>
                </span>
            </div>
            <MediaEmbed v-else url="/advimgs/jb/mspaintadventure08.gif" />
        </div>
        <div class="pageContent" v-else>
            <h2 class="pageTitle">Adventure Logs</h2>
            <div class="adventureLinks">
                <div class="adventure" v-for="advlink in adventureLinks" :key="advlink.href">
                    <a :href="advlink.href"><MediaEmbed :url="advlink.img" /><br /><span v-text="advlink.label" /></a>
                </div>
            </div>
        </div>
    </GenericPage>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import GenericPage from '../components/GenericPage.vue'
import MediaEmbed from '../components/MediaEmbed.vue';
import { useMspaStore } from '../store/mspaStore';

const store = useMspaStore();

const props = defineProps(['story']);

const sortOrder = ref('asc');

const sortMethods = {
    asc: (a, b) => (a.page_num > b.page_num) ? 1 : -1,
    desc: (a, b) => (a.page_num < b.page_num) ? 1 : -1,
    alpha: (a, b) => (a.title > b.title) ? 1 : -1,
    random: (a, b) => 0.5 - Math.random()
};

const sortNames = ref({
    asc: 'oldest to newest',
    desc: 'newest to oldest'
});

const adventureLinks = ref([
    {href: "/log/jb", img: "/images/archive_jb.gif", label: "Jailbreak"},
    {href: "/log/bq", img: "/images/archive_bq.gif", label: "Bard Quest"},
    {href: "/log/ps", img: "/images/archive_ps.gif", label: "Problem Sleuth"},
    {href: "/log/hs", img: "/images/archive_hs.gif", label: "Homestuck"},
]);

const isLoading = computed(() => store.isLoading);

const log = computed(() => {
    if (!props.story) return null;
    return storyLogRaw(props.story).sort(sorter.value);
});

const reverseText = computed(() => {
    return "View " + (sortNames.value[sortOrderNext.value] || "log");
});

const sortOrderNext = computed(() => {
    let next = (sortOrder.value == 'desc' ? 'asc' : 'desc');
    return next;
});

const sorter = computed(() => {
    let defaultSorting = "asc";
    return sortMethods[sortOrder.value] || sortMethods[defaultSorting];
});

function onClickReverseOrder() {
    sortOrder.value = sortOrderNext.value;
}

function pad(pad, str, padLeft) {
    // https://stackoverflow.com/a/24398129
    if (typeof str === 'undefined') 
        return pad;
    if (padLeft) {
        return (pad + str).slice(-pad.length);
    } else {
        return (str + pad).substring(0, pad.length);
    }
}

function pushToPageNums(pageNums, pageNum) {
    const paddedPageNum = pad('000000', pageNum, true)
    pageNums.push(paddedPageNum)
}

function getAllPagesInStory(story, includeSecret=false) {
  const pageNums = []
  if (story == 'jb'){
    for (let i = 2; i <= 6; i++) pushToPageNums(pageNums, i)
    for (let i = 8; i <= 135; i++) pushToPageNums(pageNums, i)
    pageNums.push("jb2_000000")
  } else if (story == 'bq'){
    pushToPageNums(pageNums, Number(136))
    for (let i = 171; i <= 216; i++) pushToPageNums(pageNums, i)
  } else if (story == 'mc'){
    pageNums.push("mc0001")
  } else if (story == 'ps'){
    for (let i = 219; i <= 991; i++) pushToPageNums(pageNums, i)
    for (let i = 993; i <= 1892; i++) pushToPageNums(pageNums, i)
  } else if (story == 'hsbeta'){
    for (let i = 1893; i <= 1900; i++) pushToPageNums(pageNums, i)
  } else if (story == 'hs'){
    for (let i = 1901; i <= 4298; i++) pushToPageNums(pageNums, i)
    for (let i = 4300; i <= 4937; i++) pushToPageNums(pageNums, i)
    for (let i = 4939; i <= 4987; i++) pushToPageNums(pageNums, i)
    for (let i = 4989; i <= 9801; i++) pushToPageNums(pageNums, i)
    for (let i = 9805; i <= 10030; i++) pushToPageNums(pageNums, i)
    if (includeSecret) {
      pageNums.push("darkcage")
      pageNums.push("darkcage2")
      pageNums.push("pony")
      pageNums.push("pony2")
    }
  } else if (story == 'ryanquest'){
    for (let i = 1; i <= 15; i++) pushToPageNums(pageNums, i)
  }

  if (story == 'snaps') {
    for (let i = 1; i <= 64; i++) pushToPageNums(pageNums, String(i))
  }
  return pageNums
}

function storyLogRaw (story) {
    if (!story) return [];
    return getAllPagesInStory(story).map((pageNum) => getLogEntry(pageNum));
}

function getLogEntry(pageNum) {
    const story = store.mspaJson.story;
    const page = story[pageNum];
    let date;
    if (page.timestamp) {
        const seconds = Number(page.timestamp);
        const dateObj = new Date(seconds * 1000);
        const options = { timeZone: 'America/New_York', year: '2-digit', month: '2-digit', day: '2-digit', hour12: false };
        date = dateObj.toLocaleString('en-US', options);
    } else {
        date = "??/??/??";
    }
    return {
    title: page.title,
    page_num: page.pageId,
    href: `/${props.story}/${page.pageId}`,
    date
    }
}

watchEffect(async () => {
  if (!store.mspaJson) {
    await store.fetchMSPAJson();
  }
})
</script>
  
<style scoped lang="scss">  
  .pageContent {
    align-items: unset !important;
  }
  
  .adventureLinks {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    margin: 0 auto;
    width: 600px;
  
    .adventure {
      margin-bottom: 20px;
      text-align: center;
      line-height: 1.1;
      font-size: 18px;
    }
  }
  .switchOrder {
    padding-left: 30px;
  }
  .logItems {
    // width: calc(100% - 60px);
    padding: 30px;
  
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 12px;
    span.line {
      display: block;
    }
  }
  
  </style>
  
  