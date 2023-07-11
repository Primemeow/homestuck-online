<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script setup>
</script>

<style lang="scss">
@import "./assets/fonts.scss";
@import './assets/mspaThemes.scss';

html, body {
  height: 100%;
}
body, h1, h2, h3, h4, h5, h6, p, ul, ol, li, div{
  margin: 0;
  padding: 0;
}
body {
  font-family: "Courier New", courier, monospace;
  font-size: 14px;
  font-weight: bolder;
  overflow-wrap: break-word;
}
.tabFrame {
  input, img {
    &:focus {
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);
    }
  }
}
#app {
  display: flex;
  flex-flow: column;
  height: 100%;

  .invisible {
    visibility: hidden !important;
  }
  .hidden {
    &.forceLoad {
      height: 0;
      opacity: 0;
      visibility: hidden;
      overflow: hidden;
      flex-grow: 0;
    }
    &:not(.forceLoad){
      display: none !important;
    }
  }
}

a, .bookmarkUrlDisplay {
  &[href^="http://"]:not([href*="127.0.0.1"]):not([href*="localhost"]),
  &[href^="https://"]:not([href*="127.0.0.1"]):not([href*="localhost"]),
  &[href^="mailto"]:not([href*="127.0.0.1"]):not([href*="localhost"]),
  &[href$=".pdf"],
  // &[href$=".html"]:not([href*="assets://"]) {
  &[href$=".html"] {
    &::after{
      margin: 0 1px 0 2px;
      line-height: inherit;
    }
  }
  &[href$=".jpg"],&[href$=".png"],&[href$=".gif"],&[href$=".swf"],&[href$=".txt"],&[href$=".mp3"],&[href$=".wav"],&[href$=".mp4"],&[href$=".webm"]{
    &::after{
      margin: 0 1px 0 2px;
      line-height: inherit;
    }
  }
}

iframe{
  border: 0;
}
.systemButton {
  font-weight: normal;
  text-align: center;
  vertical-align: middle;

  background: none;
  outline: none;
  border: none;
  transition: background-color 0.1s;
}
*:focus {
  outline: none;
}
</style>