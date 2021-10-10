<template>
  <v-app class="background">
    <Navbar @sidebar-changed="drawer = !drawer" />
    <v-main>
      <v-navigation-drawer
        v-show="drawer"
        class="hidden-lg-and-up"
        right
        v-model="drawer"
        absolute
        temporary
      >
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

            <v-list-item class="mhide" router to="/settings">
              <v-list-item-title> настройки</v-list-item-title>
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
import "vue-glide-js/dist/vue-glide.css";

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
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Oswald:wght@300&display=swap");

.v-application,
.v-application .text-h3,
.v-application .body-1,
.v-application .body-2,
.v-application .text-h5,
.v-application .text-h4,
.v-application .text-h6 {
  font-family: "Montserrat", "Roboto", sans-serif !important;
}

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

.v-btn {
  text-transform: none !important;
}

.bold-button {
  font-weight: 700 !important;
}

.v-tabs-slider-wrapper {
  height: 3px !important;
}
</style>
