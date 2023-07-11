<template>
    <p class="prattle text bold" v-html="filteredPrattle" v-if="textType == 'prattle' && !!content" />
        
    <div class="log" :class="{logHidden: logHidden}" v-else-if="textType == 'log'">
		<button class="logButton" @click="loggle()">
            {{ logButtonText }}
		</button>
		<p class="logContent text bold" v-html="content.replace(/\|.*?\| *\<br \/\>/, '')"></p>
	</div>

    <div class="authorlog" v-else-if="textType == 'authorlog'">
		<p class="logContent text bold" v-html="content.replace(/\|.*?\| *\<br ?\/?\>/, '')"></p>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps(['pageId', 'content']);
const logHidden = ref(true);
const isMounted = ref(false);
const fullwidthImages = ref([
    'andthenightbeforechristmas.jpg',
    'areyounext.gif',
    'corpsesmooch.gif',
    'THIS.gif',
    'IS.gif',
    'STUPID.gif',
    'WHOSTHISDOUCHEBAG.gif',
    'nextbowl.gif',
    'nextbowl2.gif',
    'nextbowl3.gif',
    'nextbowl4.gif',
    'HELPHIM.gif',
    'weirdhonk.gif',
    'OHBOY.gif',
    'wizordofoz.jpg'
]);

function getTextType(content) {
    if (!content) return null

    if (/^\|AUTHORLOG\|/.test(content)){
        return "authorlog"
    } else if (/^\|.*?\|/.test(content)){
        return "log"
    } else {
        return "prattle"
    }
};

const textType = computed(() => {
    return getTextType(props.content);
});

const logButtonText = computed(() => {
    let text = props.content.match(/\|(.*?)\|/)[1];
    const state = (logHidden.value) ? 'Show ' : 'Hide ';

    if (/P4SSWORD H1NT/i.test(text)){
        return text;
    }
    else if (/trkstrlog/i.test(text)){
        text = 'tricksterlog';
    }
    else if (/sriousbiz/i.test(text)){
        text = 'serious business';
    }
    return state + text.toLowerCase();
})

const filteredPrattle = computed(() => {
    let result = props.content;
    if (/<img src="/.test(result)){
        fullwidthImages.value.some(img => {
            result = result.replace(`${img}" `, `${img}" class='fullWidth'`)
        })
    }
    
    return result
});


function loggle() {
    logHidden.value = !logHidden.value;
}

onMounted(() => {
    isMounted.value = true;
});
</script>

<style scoped lang="scss">
:deep(a) {
    color: var(--page-links);
    &.visited {
        color: var(--page-links-visited);
    }
}

.text {
    font-family: 'Courier New', Courier, monospace;
    font-weight: normal;
    font-size: 14px;

    &.bold {
        font-weight: bold;
    }
    
    &.courierPrime {
        font-family: 'Courier Prime';
    }
    &.verdana {
        font-family: Verdana, Arial, Helvetica, sans-serif;
    }
    &.times {
        font-family: 'Times New Roman', Times, serif;
    }
    &.comicSans {
        font-family: "Comic Sans MS", "Comic Sans", cursive;
    }
    &.openDyslexic {
        font-family: 'OpenDyslexic';
    }
}

.prattle {
    width: 600px;
    text-align: center;
    margin: 0 0 30px 0;
    
    :deep(img.fullWidth) {
        position: relative;
        left: -25px;
    }
}

.authorlog {
    width: 600px;
    margin: 0 0 30px 0;
    border: 3px solid var(--page-pageBorder, var(--page-pageFrame));
    background: white;
    padding: 1px;
    text-align: center;
    align-self: center;
    .logContent{
        color: var(--font-log);
        padding: 15px 5%;
        text-align: left;
    }
}

.log {
    width: 600px;
    margin: 0 0 30px 0;
    border: 1px dashed var(--page-log-border);
    background: var(--page-log-bg);
    padding: 1px;
    text-align: center;
    align-self: center;
    position: relative;
    
    &.highContrast {
        background: #ffffff;
    }
    button {
        text-transform: capitalize;
        position: inherit;
        z-index: 0;
    }
    
    .logContent{
        color: var(--font-log);
        padding: 15px 5%;
        text-align: left;
        position: inherit;
        z-index: 0;
    }

    &.logHidden {
        .logContent, .bgshade {
            display: none; 
        }
    }

    .bgshade {
        width: 100%;
        height: 100%;
        position: absolute;
        pointer-events: none;
        top: 0;
        left: 0;
        z-index: -1;
    }
}
</style>
