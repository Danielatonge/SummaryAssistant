<template>
  <v-app class="background">
    <Navbar @sidebar-changed="drawer = !drawer" />
    <v-main>
      <v-navigation-drawer v-show="drawer" class="hidden-lg-and-up" right v-model="drawer" absolute temporary>
        <v-list nav dense class="text-right">
          <div v-if="loggedIn">
            <v-list-item
              v-for="item in links"
              :key="item.text"
              router
              :to="item.route"
            >
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>

            <v-list-item router to="/settings">
              <v-list-item-title> настройки </v-list-item-title>
            </v-list-item>
          </div>
          <v-list-item v-if="!loggedIn" router to="/login">
            <v-list-item-title>Войти</v-list-item-title>
          </v-list-item>
          <v-list-item v-else router to="/logout">
            <v-list-item-title>Выйти</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Footer from "./components/Footer.vue";
import Navbar from "./components/Navbar.vue";
import 'vue-glide-js/dist/vue-glide.css'
export default {
  components: { Navbar, Footer },
  name: "App",

  data: () => ({
    links: [
      { text: "Расшифровка", route: "/decode" },
      { text: "Конференции", route: "/conference" },
      { text: "Голосовой блокнот", route: "/voice_note" },
      { text: "Справка", route: "/reference" },
    ],
    drawer: false,
  }),
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
  },
};
</script>

<style>
div[data-app="true"] {
  background: url("./assets/background.svg") no-repeat center center !important;
  background-size: cover !important;
}
.text-color {
  color: #14396a !important;
}
.reset-link {
  text-decoration: none;
  color: unset !important;
}
</style>