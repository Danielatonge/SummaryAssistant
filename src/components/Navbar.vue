<template>
  <div>
    <v-container>
      <v-row class="d-flex justify-space-between">
        <router-link class="reset-link text-color" to="/">
          <p class="font-weight-bold mb-0" style="font-size: 36px">Summary</p>
          <p class="body-2 text-center">Your personal assistent</p>
        </router-link>

        <div class="my-auto hidden-lg-and-up">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn elevation="0" large dark v-bind="attrs" v-on="on">
                <v-icon> mdi-menu </v-icon>
              </v-btn>
            </template>
            <v-list>
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
          </v-menu>
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
};
</script>

<style>
.reset-link {
  text-decoration: none;
  color: unset !important;
}
.size-tab {
  font-size: 1.125rem !important;
  font-weight: 400 !important;
}
</style>