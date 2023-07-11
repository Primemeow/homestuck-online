<template>
    <div class="not-found">
      <h1>404</h1>
      <p>Sorry, the page you were looking for could not be found.</p>
      <router-link to="/reader/hs/">Go Home</router-link>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    margin-top: 50px;
  }
  
  .not-found h1 {
    font-size: 50px;
    margin-bottom: 20px;
  }
  
  .not-found p {
    margin-bottom: 20px;
  }
  </style>