<template>
  <div>
    <v-container>
      <v-row>
        <router-link class="home-link" to="/">
          <p class="text-h3 font-weight-bold mb-0">Summary</p>
          <p class="body-2 text-center">Your personal assistent</p>
        </router-link>

        <v-spacer></v-spacer>
        <div class="my-auto d-flex">
          <v-tabs v-model="tab" background-color="transparent" grow>
            <v-tabs-slider color="blue"></v-tabs-slider>
            <v-tab
              v-for="item in links"
              :key="item.text"
              router
              :to="item.route"
            >
              {{ item.text }}
            </v-tab>
          </v-tabs>
          <v-btn rounded text class="mr-2 my-auto">
            <v-icon>mdi-cog-outline</v-icon>
          </v-btn>
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
      { text: "Расшифровка", route: "/decoder" },
      { text: "Конференции", route: "/conference" },
      { text: "Голосовой блокнот", route: "/voice_note" },
      { text: "Справка", route: "/reference" },
    ],
  }),
};
</script>

<style scoped>
.home-link {
  text-decoration: none;
  color: unset;
}
</style>