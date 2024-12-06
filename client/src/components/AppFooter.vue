<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="footer-text">
        © 2024 Frencheez. Made by <strong>Doryan Denis</strong> & <strong>Nicolas Papleux</strong>.
      </p>
    </div>
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
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.footer-text {
  font-family: 'Rubik', sans-serif;
  font-size: 16px;
  color: #2c2c27;
  margin: 0;
}
</style>
