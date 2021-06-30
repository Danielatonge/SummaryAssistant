<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Footer from './components/Footer.vue';
import Navbar from './components/Navbar.vue';
export default {
  components: { Navbar, Footer },
  name: "App",

  data: () => ({
    //
  }),
};
</script>
