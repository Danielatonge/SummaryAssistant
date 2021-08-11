<template>
  <div class="top-nav py-4">
    <v-container class="px-6 px-lg-0">
      <v-row class="d-flex justify-space-between">
        <router-link class="reset-link text-color" to="/">
          <p class="text-h3 font-weight-bold mb-0">Summary</p>
          <p class="body-2 text-center mb-0">Your personal assistent</p>
        </router-link>

        <div class="my-auto hidden-lg-and-up">
          <v-btn
            color="transparent"
            @focusout="dropdownActive = false"
            elevation="0"
            height="70"
            large
          >
            <v-icon x-large @click="toggleSideBar()">
              {{ dropdownActive ? "mdi-close" : "mdi-menu" }}
            </v-icon>
          </v-btn>
        </div>
        <div v-if="loggedIn" class="my-auto d-lg-flex hidden-md-and-down">
          <v-tabs v-model="tab" class="mr-4" background-color="transparent">
            <v-tabs-slider class="text-color"></v-tabs-slider>
            <v-tab class="d-none" key="fallback"></v-tab>
            <v-tab
              v-for="item in links"
              :key="item.text"
              router
              :to="item.route"
              class="size-tab text-color"
            >
              {{ item.text }}
            </v-tab>
            <v-tab router to="/settings" key="Настройки">
              <v-icon class="text-color">mdi-cog-outline</v-icon>
            </v-tab>
          </v-tabs>
        </div>

        <v-btn
          rounded
          outlined
          class="my-auto d-lg-flex hidden-md-and-down size-tab text-color"
          v-if="!loggedIn"
        >
          <router-link class="reset-link text-color" to="/login">
            Войти
          </router-link>
        </v-btn>
        <v-btn
          rounded
          outlined
          class="my-auto d-lg-flex hidden-md-and-down size-tab text-color"
          v-else
        >
          <router-link class="reset-link text-color" to="/logout">
            Выйти
          </router-link>
        </v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    dropdownActive: false,
    tab: "",
    links: [
      { text: "Расшифровка", route: "/decode" },
      { text: "Конференции", route: "/conference" },
      { text: "Голосовой блокнот", route: "/voice_note" },
      { text: "Справка", route: "/reference" },
    ],
  }),
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
  },
  methods: {
    toggleSideBar() {
      this.dropdownActive = !this.dropdownActive;
      this.$emit("sidebar-changed");
    },
  },
};
</script>

<style scoped>
.text-color {
  color: #14396a !important;
}
.size-tab {
  font-size: 1.125rem !important;
  font-weight: 400 !important;
}

@media only screen and (max-width: 1260px) {
  .top-nav {
    background-color: #fff !important;
    padding-bottom: 0.6rem;
  }
}
</style>