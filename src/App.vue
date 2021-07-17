<template>
  <v-app class="background">
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Footer from "./components/Footer.vue";
import Navbar from "./components/Navbar.vue";
export default {
  components: { Navbar, Footer },
  name: "App",

  data: () => ({
    //
  }),
};
</script>

<style>
div[data-app='true'] {
  background: url("./assets/background.svg") no-repeat center center !important;
  background-size: cover !important;
}
.text-color {
  color: #14396a !important;
}
</style>