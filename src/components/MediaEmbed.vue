<template>
  <img v-if="getMediaType(url) === 'img'"
    :src="resourceURL" alt />
  <video v-else-if="getMediaType(url) ==='vid' && gifmode != undefined"
    :src="resourceURL"
    :width="videoWidth"
    disablePictureInPicture
    autoplay="true" muted="true"
    loop  />
  <video v-else-if="getMediaType(url) ==='vid' && gifmode == undefined"
    :src="resourceURL"
    :width="videoWidth"
    disablePictureInPicture alt
    :autoplay="autoplay" @loadeddata="onVideoLoaded" />
  <iframe v-else-if="getMediaType(url) === 'swf'"
    :key="url" :srcdoc="flashSrc"
    :width='flashProps.width' :height="flashProps.id in cropHeight ? cropHeight[flashProps.id] : flashProps.height"
    seamless/>
  <iframe v-else-if="getMediaType(url) === 'html'"
    :src="resourceURL"
    ref='frame'
    :style="`width: ${flashProps.width}px; height: ${flashProps.height}px; max-width: 100%; max-height: 100%;`"
    @did-finish-load="initHtmlFrame" seamless />
  <div v-else-if="getMediaType(url) === 'txt'"
    v-html="getFile(url)" class="textEmbed" />
  <audio v-else-if="getMediaType(url) === 'audio'"
    class="audioEmbed"
    controls controlsList="nodownload"
    :src="resourceURL"
    type="audio/mpeg" />
</template>

<script setup>
import { ref, computed, onUpdated, onBeforeUnmount } from 'vue'
import { HOMESTUCK_FLASH_PROPS, GAME_OVER_PROPS, HOMESTUCK_FLASH_CROP_HEIGHTS, HOMESTUCK_FLASH_AUDIO_DELAYS, HOMESTUCK_FLASH_PAUSE_AT_TIMESTAMPS } from "../constants/flash";
import { getResourceURL, resolveURL } from "../helpers/resources";
import { getFilenameWithoutExtension, getExtension } from "../helpers/fetchAssets";

const props = defineProps({
  url: String,
  gifmode: Boolean,
  width: Number,
  height: Number,
  autoplay: Boolean
});

// Data
let indexedFlashProps = HOMESTUCK_FLASH_PROPS
let gameOver = GAME_OVER_PROPS
let cropHeight = HOMESTUCK_FLASH_CROP_HEIGHTS
let audioDelay = HOMESTUCK_FLASH_AUDIO_DELAYS
let pauseAtTimestamps = HOMESTUCK_FLASH_PAUSE_AT_TIMESTAMPS
let audio = ref([])
let lastStartedAudio = ref(undefined)
let jsFlashes = ref(true)
let hqAudio = ref(true)
let timer = ref({
  interval: undefined,
  callback: undefined,
  start: undefined,
  delay: undefined,
  remaining: undefined
})

// Computed properties
const resourceURL = computed(() => {
  return resolveURL(getResourceURL(props.url));
});

const videoWidth = computed(() => {
  const filename = getFilenameWithoutExtension(props.url);
  let width = 950;
  if (filename === "08120") {
    width = 1280;
  }

  return `${width}px`;
});

const flashProps = computed(() => {
  let filename = getFilenameWithoutExtension(props.url).split("_")[0];
  const defaultProps = {
    id: filename,
    width: props.width?.value || 650,
    height: props.height?.value || 450,
    bgcolor: '#fff',
    rawStyle: ''
  };

  let customProps = indexedFlashProps?.value?.[filename] || {};

  return { ...defaultProps, ...customProps };
});

const audioTracks = computed(() => {
  // TODO: reimplement this
  // must get audioData from store,
  // const correctedUrl = props.url.replace("_hq.swf", ".swf"),
  // and use that as the key for audioData to fetch the tracks
  // right now everything will work fine as it does in homestuck.com,
  // this getter is for bolin and hq audio 
  return [];
});

const flashSrc = computed(() => {
  return `
    <html>
    <head>
    <style>
      body{margin:0;overflow:hidden;background:${flashProps.value.bgcolor}}
      object{${flashProps.value.rawStyle}}
    </style>
    <script>
      // JS Enhancements: ${jsFlashes.value}
      // HQ Audio: ${hqAudio.value}
      window.onhashchange = (e) => {
        if (window.location.hash != '#unset') {
          let hash = window.location.hash.substr(1).split('&')
          window.location.hash = '#unset';
          hash.forEach((func)=>{
            vm.invokeFromFlash(func)
          })
        }
      }
    <\/script>
    </head>
    <body>
    <object type="application/x-shockwave-flash" 
      width="${flashProps.value.width}" 
      height="${flashProps.value.height}" 
      data="${resourceURL.value}">
        <param name='movie' value="${resourceURL.value}"/>
        <param name='play' value="true"/>
        <param name='loop' value="true"/>
        <param name='quality' value="high" />
        <param name='bgcolor' value="${flashProps.value.bgcolor}"/>
        <param name='devicefont' value="false"/>
        <param name="allowScriptAccess" value="always" />
        <param name="splashScreen" value="false" />
    </object>
    </body>
    </html>
  `;
});

// Methods
function onVideoLoaded(event) {
  // Don't show controls until video is loaded and element is sized
  event.srcElement.controls = true
  event.srcElement.controlsList = "nodownload"

  const pauseAt = pauseAtTimestamps[flashProps.value.id]
  if (pauseAt) {
    const pause = function(){
      // We pass this function to srcElement later, that's what the this refers to
      if (this.currentTime > pauseAt) {
        console.log("pausing video at", this.currentTime)
        this.controls = true
        this.pause()
        this.removeEventListener("timeupdate", pause)
      }
    }
    event.srcElement.controls = false
    event.srcElement.addEventListener("timeupdate", pause)
  }
};

function invokeFromFlash(func) {
  const [funcName, param] = func.split('?')
  switch (funcName) {
    case 'audioInit':
      audioInit(param)
      break
    case 'audioStart':
      audioStart(param)
      break
    case 'audioPause':
      audioPause()
      break
    case 'audioResume':
      audioResume()
      break
    case 'audioReset':
      audioReset()
      break
    case 'audioSeek': 
      audioSeek(param)
      break
    case 'vol': 
      audioVolume(param)
      break
    case 'link':
      // open new tab with param
      // TODO: check this actually works
      window.open(param, '_blank');
      break
    case 'heightStart':
      if (jsFlashes.value) {
        heightStart(param)
      }
      break
    case 'heightPause':
      if (jsFlashes.value) {
        pauseTimer()
      }
      break
    case 'heightResume':
      if (jsFlashes.value) {
        resumeTimer()
      }
      break
    case 'heightReset':
      if (jsFlashes.value) {
        this.$el.style.transition = 'height 0.2s'
        this.$el.style.height = cropHeight.value[flashProps.value.id]
      }
      break

    case 'gameOver':
      if (jsFlashes.value) {
        gameOver.count = 0
        startTimer(() => {
          const next_step = gameOver.steps[gameOver.count]
          if (Date.now() >= timer.value.start + next_step) {
            gameOver.count++
            if (gameOver.count >= gameOver.steps.length) {
              clearInterval(timer.value.interval)
              timer.value = {}
            }
          }
        }, 0)
      }
      break
  }
}

function audioInit() {
  if (audio.value.length < 1) {
    if (audioTracks.value.length > 0) {
      audioTracks.value.forEach(track => {
        audio.value.push(createAudioElement(track))
      })
    }
  } else {
    audioReset()
  }
}


function createAudioElement(track) {
  const audioElement = new Audio(getResourceURL(track.href));
  audioElement.preload = 'auto';
  audioElement.loop = track.loop;
  audioElement.load();
  return audioElement;
}

function audioStart (n = 1) {
  audioInit();
  let cascadeDelay = 0;
  if (indexedFlashProps.value.id == '04106') {
    if (n.toString().endsWith('.5')) {
      n = n.toString().substr(0, 1);
      if (n == '1')
        cascadeDelay = -52900;
      else if (n == '4')
        cascadeDelay = -125250;
      else if (n == '5')
        cascadeDelay = -77900;
    }
  }
  n = parseInt(n) - 1;
  if (!audio.value[n]) return;

  lastStartedAudio.value = n;
  let replay = false;

  if (audio.value[n].currentTime > 30) {
    audioReset();
    replay = true;
  }

  let delay = 0;
  if (cascadeDelay) delay = cascadeDelay;
  else if (audioTracks.value && audioTracks.value[0].audioDelay) delay = audioTracks.value[0].audioDelay;
  else if (replay && (`${indexedFlashProps.value.id}_replay`) in audioDelay.value) delay = audioDelay.value[`${indexedFlashProps.value.id}_replay`];
  else if (`${indexedFlashProps.value.id}_${n + 1}` in audioDelay.value) delay = audioDelay.value[`${indexedFlashProps.value.id}_${n + 1}`];
  else if (indexedFlashProps.value.id in audioDelay.value) delay = audioDelay.value[indexedFlashProps.value.id];
  if (delay > 0) {setTimeout(() => {if (audio.value[n]) audio.value[n].play()}, delay)} else {
    if (delay < 0) audio.value[n].currentTime = -0.001 * delay;
    audio.value[n].play()
  }
}


function audioPause() {
  // Flash can take up to one frame (40ms) to play/pause. This is the best we can do to smooth that out.
  audio.value[lastStartedAudio.value].pause();
}

function audioResume() {
  setTimeout(() => 
    { if (audio.value[lastStartedAudio.value]) audio.value[lastStartedAudio.value].play() },
   30);
}

function audioReset() {
  audio.value.forEach(track => {
    track.pause();
    track.currentTime = 0.0;
  })
}

function audioVolume(vol) {
  audio.value.forEach(track => {
    track.volume = vol
  })
}

function audioSeek(param) {
  audio.value[lastStartedAudio.value].currentTime = param
}

function heightStart(n) {
  if (this.$el.style.height != cropHeight[flashProps.value.id]) {
    this.$el.style.transition = 'height 0.2s'
    this.$el.style.height = cropHeight[flashProps.value.id]
    window.getComputedStyle(this.$el)
  }
  let time
  let transition = 'height 0.2s'
  let heightTo = this.flashProps.height + 'px'
  switch (n) {
    case 'cascade1':
      time = 60900
      transition = 'height 8s linear'
      break
    case 'cascade1.5':
      time = 8067
      transition = 'height 8s linear'
      break
    case 'A6A6I1':
      time = 18833
      transition = 'height 17.53s cubic-bezier(0.12, 0, 0.39, 0)'
      break
    case 'pipeorgan':
      time = 100100
      // time = 100
      transition = 'height 11.3s linear'
      heightTo = '629px'
      break
    case 'vriskagram': 
      time = 10650
      transition = 'height 1.3s'
      break
    case 'remem8er': 
      time = 16130
      transition = 'height 10s'
      break
  }

  if (time) {
    this.startTimer(() => {
      if (Date.now() >= timer.value.start + timer.value.delay) {
        this.$el.style.transition = transition
        this.$el.style.height = heightTo

        clearInterval(this.timer.interval)
        timer.value = {}
      }
    }, time)
  } else {
    this.$el.style.transition = transition
    this.$el.style.height = heightTo
  }
}

function startTimer(callback, delay) {
  timer.value.callback = callback
  timer.value.delay = delay
  this.resumeTimer()
}

function pauseTimer() {
  clearInterval(timer.value.interval)
  timer.value.delay -= Date.now() - timer.value.start - 50 // Mitigate paused track from drifting
}

function resumeTimer() {
  timer.value.start = Date.now()
  clearInterval(timer.value.interval)
  timer.value.interval = setInterval(timer.value.callback, 20)
}

function getFile(url) {
   // TODO: vue doesn't have fs, since it runs in the browser, figure out how to replace it
   // it must fetch the content from .txt file and place it in the template
   return url;
}

function getMediaType(url) {
  url = url.toLowerCase();
  const ext = getExtension(url);
  switch (ext) {
    case ".swf":
      return 'swf';
    case ".mp4":
    case ".webm":
      return 'vid';
    case ".txt":
      return 'txt';
    case ".html":
      return 'html';
    case ".mp3":
    case ".wav":
      return 'audio';
    default:
      return 'img';
  };
}

function destroyAudio() {
  audio.value.forEach(track => {
    track.pause();
  });
  audio.value = [];
  pauseTimer();
}


onUpdated(() => {
  destroyAudio();
  this.$el.value.style = '';
})

onBeforeUnmount(() => {
  destroyAudio();
})
</script>


<style lang="scss" scoped>
  .textEmbed {
    overflow-y: scroll;
    background-color:white;
    white-space: pre-wrap;
    width: 80vw;
    height: 70vh;
    max-width: 1155px;
    max-height: 900px;
    padding: 10px;
  }
  audio {
    width: 100%;
    min-width: 650px;
  }
</style>