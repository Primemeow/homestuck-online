<template>
    <nav class="pageNavigation">
        <div class="nextArrow" v-if="nextPages.length > 0">
            <div v-for="(page, index) in nextPages" :key="index">
                <p v-if="('pageId' in page && 'title' in page)">
                &gt; <a :href="commandLink(page)" class="nextArrowLink" v-html="commandText(page)" @click="$updateNewReader(page.pageId)" />
                </p>
            </div>
        </div>
        <div class="footerNav" >
            <ul class="navOptions">
                <li>
                    <a :href="props.startOverLink" class="startOver">Start Over</a>
                </li>
                <li v-if="'previous' in thisPage">
                    <a :href="props.previousPageLink" class="goBack">Go Back</a>
                </li>
            </ul>
            <ul class="meta">
                <li v-if="'timestamp' in thisPage && !!getTimestamp()">
                    <div class="timestamp" :data-timestamp="thisPage.timestamp" v-html="getTimestamp()" />
                </li>
            </ul>
        </div>
    </nav>
</template>
  
<script setup>
import { computed, ref } from 'vue';

const props = defineProps(["thisPage", "nextPages", "startOverLink", "previousPageLink", "story"]);

function commandText(page) {
    return new Option(page.title).innerHTML
};

function commandLink(page) {
    return `/${props.story}/${page.next[0]}`;
}

function getTimestamp() {
    // Returns a formatted timestamp OR undefined
    if (!props.thisPage.timestamp) {
        return undefined;
    } else {
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
    }
};
</script>


<style scoped lang="scss">
  .pageBody {
    color: var(--font-default);
    background: var(--page-pageBody);

    margin: 0;
    padding: 0;
    display: flex;
    flex: 1 0 auto;
    flex-flow: column;
    align-items: center;

    > img {
      align-self: center;
    }

    &.supercartridge {
      .pageFrame {
        padding-top: 0;
        .pageContent {
          max-width: 650px;
        }
      }
    }

    &.hscroll {
      .pageFrame, .navBanner {
        width: 1200px !important;

        .pageContent {
          max-width: 1100px;

          .media {
            align-items: flex-start !important;
            overflow-x: scroll;
            width: 1100px;  

            &:after{
              content: url(assets://scraps2/hscrollarrow.gif);
            }
          }   
        }
      }
    }

    &.scratchIntermission {
      .navBanner {
        width: 940px;
      }
      .pageFrame {
        width: 940px;
      }
    }

    //Small screen check
    @media only screen and (max-width: 850px) {
      &{
        overflow-x: hidden;
        height: max-content;
        .navBanner {
          max-width: 100%;
        }
        .pageFrame {
          max-width: 100%;
        }
        ::v-deep div.footer {
          max-width: 100%;
        }
      }
    }

    .pageFrame {
      background: var(--page-pageFrame);

      width: 950px;
      padding-top: 7px;
      padding-bottom: 23px;
      margin: 0 auto;
      position: relative; // Allow things to align to the page

      flex: 0 1 auto;
      display: flex;
      justify-content: center;

      .pageContent {
        background: var(--page-pageContent);

        max-width: 950px;
        min-width: 650px;
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        flex-flow: column;

        .footnotesContainer {
          width: 100%;
        }

        .mediaContent {
          display: flex;
          align-items: center;
          flex-flow: column;

          h2.pageTitle {
            max-width: 590px;
            text-align: center;
            line-height: 1.1;
            font-size: 32px;
            padding: 15px 0;
          }

          .media {
            display: flex;
            align-items: center;
            flex-flow: column;

            .panel {
              &:not(:last-child) {
                margin-bottom: 20px;
              }
            }            
          }
        }

        .textContent{
          margin-top: 30px;
          width: 600px;
          display: flex;
          flex-direction: column;
          
        }
      }
    }
  }
</style>
