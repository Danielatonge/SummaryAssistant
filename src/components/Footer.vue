<template>
  <v-footer padless class="footer-background" dark>
    <v-container class="px-6 px-lg-0">
      <v-row class="py-5">
        <router-link class="home-link" to="/">
          <p class="text-h3 font-weight-bold mb-0">Summary</p>
          <p class="body-2 text-center mt-n2 mb-0">Your personal assistent</p>
        </router-link>
        <div class="text-decoration-underline my-auto ml-15">
          info@summary.com
        </div>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {};
</script>

<style scoped>
.home-link {
  text-decoration: none;
  color: unset;
}
.footer-background {
  background: url("../assets/footer_background.svg") no-repeat center center !important;
  background-size: cover !important;
}
</style>