<template>
  <div id="app">
    <AppHeader />
    <div class="content">
      <router-view /> 
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

export default {
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Leckerli+One&family=Rubik:wght@400;500&display=swap');

body, html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100%; 
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f3e7; 
}

.content {
  flex: 1;
}

.router-view {
  padding-bottom: 20px; 
}
</style>