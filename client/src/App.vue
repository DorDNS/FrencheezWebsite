<template>
  <div id="app">
    <AppHeader />
    <div class="content">
      <router-view /> <!-- This is where the page content will be injected -->
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

/* Reset body margins and padding */
body, html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100%; /* Ensure body and html occupy full height */
}

/* Apply light yellow background to the entire app */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f3e7; /* Light yellow background */
}

.content {
  flex: 1;
}

/* Footer styling to ensure it stays at the bottom */
.router-view {
  padding-bottom: 20px; /* Optional padding for spacing above the footer */
}
</style>