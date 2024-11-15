<template>
  <footer class="footer">
    <p class="footer-text">Made by Doryan Denis & Nicolas Papleux</p>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
.footer {
  background-color: #ddc8c8;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-text {
  font-family: 'Rubik', sans-serif;
  font-size: 24px;
  color: #2c2c27;
}
</style>