<template>
    <nav class="pageNavigation">
        <div class="nextArrow" v-if="nextPages.length > 0">
            <div v-for="(page, index) in nextPages" :key="index">
                <p v-if="('pageId' in page && 'title' in page)">
                &gt;
                <router-link :to="commandLink(page)" class="nextArrowLink">
                    <span v-html="commandText(page)"/>
                </router-link>
                </p>
            </div>
        </div>
        <div class="footerNav" >
            <ul class="navOptions">
                <li>
                    <router-link :to="props.startOverLink" class="startOver">Start Over</router-link>
                </li>
                <li v-if="'previous' in thisPage">
                    <router-link :to="props.previousPageLink" class="goBack">Go Back</router-link>
                </li>
            </ul>
            <ul class="meta">
                <li v-if="'timestamp' in thisPage && pageTimestamp">
                    <div class="timestamp" :data-timestamp="thisPage.timestamp" v-html="pageTimestamp" />
                </li>
            </ul>
        </div>
    </nav>
</template>
  
<script setup>
import { computed } from 'vue';

const props = defineProps(["thisPage", "nextPages", "startOverLink", "previousPageLink", "story"]);

function commandText(page) {
    return new Option(page.title).innerHTML
};

function commandLink(page) {
    return `/${props.story}/${page.pageId}`;
}

const pageTimestamp = computed(() => {
    // Returns a formatted timestamp OR undefined
    if (props.thisPage.timestamp) {
        try {
            const seconds = Number(props.thisPage.timestamp);
            const date = new Date(seconds * 1000);
            // use Boston timezone
            const options = { timeZone: 'America/New_York', hour12: false };
            return date.toLocaleString('en-US', options);
        } catch (e) {
            this.$logger.error(e);
            return "Invalid Date";
        }
    } else {
        return undefined;
    }
});
</script>


<style scoped lang="scss">
  .nextArrow{
    margin: 0 0 30px 0;
    font-family: Verdana, Arial, Helvetica, sans-serif;
    font-size: x-large;
    font-weight: normal;
  }
  .footerNav{
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    line-height: 10px;
    ul {
      list-style: none;
      font-size: 10px;
      font-family: Verdana, Arial, Helvetica, sans-serif;
      li {
        float: left;
        padding-bottom: 15px;
        * {display: inline-block;}
        &:not(:last-child):after {
          content: "|";
          margin: 0 0.3em
        }
      }
    }
    .meta {
      font-weight: 300;
      color: var(--page-nav-meta);
      a {
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    }
  }
</style>
