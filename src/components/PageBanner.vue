<template>
    <div class="bannerDiv" v-if="!!banner"  @mouseover="mouseEnter" @mousemove="positionTooltip" @mouseleave="mouseLeave" >
        <media-embed :url="banner.url" :title="banner.title" class="bannerImage" />
        <img v-if="imgTooltip" :src="imgTooltip" class="imgTooltip" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import MediaEmbed from './MediaEmbed.vue';

const props = defineProps(['tab', 'page']);

let tooltipActive = ref(false);

let banner = computed(() => {
    let num = parseInt(props.page.pageId);
    if (props.page.theme == 'scratch') {
        return {
            url: `/storyfiles/hs2/scratch/${props.page.scratchBanner}`, 
            title: props.page.scratchTooltip ? props.page.scratchTooltip : undefined
        };
    } else if (props.page.theme == 'cascade') {
        return {url: '/images/header_cascade.gif', title: undefined};
    } else if (props.page.theme == 'trickster') {
        return {url: '/images/trickster_sitegraphics/menu.swf', title: undefined};
    } else if (props.page.flag.includes('X2COMBO')) {
        return {url: '/images/act6act5act1x2combo.gif', title: undefined};
    } else if (num == 9987) {
        return {url: '/images/collide_header.gif', title: undefined};
    } else if (num == 10027) {
        return {url: '/images/act7_header.gif', title: undefined};
    } else {
        return undefined;
    }
});

let imgTooltip = computed(() => {
    const num = parseInt(props.page.pageId);
    if (props.page.theme == 'scratch' && num >= 5976 && num <= 5981) {
        const LEnumber = num - 5975;
        return `assets://storyfiles/hs2/scraps/LEtext${LEnumber}.gif`;
    } else {
        return false;
    }
});

function mouseEnter(e) {
    e = e || window.event;
    e.preventDefault();
    if (imgTooltip.value) {
        const tooltip = document.getElementById(props.tab.key).getElementsByClassName('imgTooltip')[0];  
        tooltip.style.display = 'block';
        tooltipActive.value = true;
        positionTooltip(e);
    } else {
        tooltipActive.value = false;
    }
};

function mouseLeave(e) {
    e = e || window.event;
    e.preventDefault();
    if (imgTooltip.value) {
        if (tooltipActive.value) {
            const tooltip = document.getElementById(props.tab.key).getElementsByClassName('imgTooltip')[0];
            tooltip.style.display = 'none';
            tooltipActive.value = false;
        }
    } else {
        tooltipActive.value = false;
    }
};

function positionTooltip(e) {
    e = e || window.event;
    e.preventDefault();
    if (tooltipActive.value) {
        const page = document.getElementById(props.tab.key);
        const tooltip = page.getElementsByClassName('imgTooltip')[0];
        const offsetXY = [20, 30];

        const tooltipX = e.clientX + offsetXY[0];  // mouse X
        const tooltipY = e.clientY - offsetXY[1];  // mouse Y
        const tooltipWidth = tooltip.clientWidth;
        const tooltipHeight = tooltip.clientHeight;

        tooltip.style.left = 
            (tooltipX + tooltipWidth > page.scrollLeft + page.clientWidth ? 
            tooltipX - tooltipWidth - 2 * offsetXY[0] : 
            tooltipX) + 'px';

        tooltip.style.top = 
            (tooltipY + tooltipHeight > page.scrollTop + page.clientHeight ? 
            page.scrollTop + page.clientHeight - tooltipHeight - offsetXY[1] : 
            tooltipY) + 'px';
    } else {
        mouseEnter(e);
    }
};
</script>


<style lang="scss" scoped>
.bannerDiv{
    margin: 0;
    * {
    display: block;
    }
    .imgTooltip {
    display: none;
    z-index: 1;
    position: absolute;
    left: 0;
    top: 0;
    }
}
</style>
