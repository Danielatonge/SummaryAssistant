<template>
  <div>
    <v-container>
      <v-row>
        <router-link class="reset-link" to="/">
          <p class="text-h3 font-weight-bold mb-0">Summary</p>
          <p class="body-2 text-center">Your personal assistent</p>
        </router-link>

        <v-spacer></v-spacer>
        <div class="my-auto hidden-lg-and-up">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn elevation="0" large dark v-bind="attrs" v-on="on">
                <v-icon> mdi-menu </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="item in links"
                :key="item.text"
                router
                :to="item.route"
              >
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
              <v-list-item router to="/settings">
                <v-list-item-title>
                  <v-list-item-title> настройки </v-list-item-title>
                </v-list-item-title>
              </v-list-item>
              <v-list-item router to="#">
                <v-list-item-title>Войти</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div class="my-auto d-lg-flex hidden-md-and-down">
          <v-tabs v-model="tab" class="mr-4" background-color="transparent">
            <v-tabs-slider color="blue"></v-tabs-slider>
            <v-tab
              v-for="item in links"
              :key="item.text"
              router
              :to="item.route"
            >
              {{ item.text }}
            </v-tab>
            <v-tab router to="/settings">
              <v-icon>mdi-cog-outline</v-icon>
            </v-tab>
          </v-tabs>
          <v-btn rounded outlined class="my-auto"> Войти </v-btn>
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    tab: "/",
    links: [
      { text: "Расшифровка", route: "/decode" },
      { text: "Конференции", route: "/conference" },
      { text: "Голосовой блокнот", route: "/voice_note" },
      { text: "Справка", route: "/reference" },
    ],
  }),
};
</script>

<style>
.reset-link {
  text-decoration: none;
  color: unset !important;
}
</style>