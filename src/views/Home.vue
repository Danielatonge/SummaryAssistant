<template>
  <div>
    <v-container class="pb-16">
      <v-row class="my-15">
        <v-col cols="12" class="px-0">
          <v-card flat color="transparent">
            <v-row class="justify-space-between">
              <v-col cols="8" md="6" class="px-0 text-color">
                <v-card-title class="mb-4 main-heading"
                  >Summary – your personal assistant</v-card-title
                >

                <v-card-subtitle class="main-text"
                  >Summary позволяет расшифровать конференции в реальном
                  врменени, аудио и видео файлы, приложив к этому минимум
                  усилий.</v-card-subtitle
                >

                <v-card-actions>
                  <v-btn
                    class="px-10 py-6 text-h5 font-weight-bold yellow-fill text-color"
                    outlined
                    rounded
                    width="350px"
                  >
                  <router-link class="reset-link" to="/decode">
                    Начать работу
                  </router-link>
                  </v-btn>
                </v-card-actions>
              </v-col>

              <v-avatar class="ma-3" color="transparent" size="250" tile>
                <v-img :src="require('../assets/record.png')"></v-img>
              </v-avatar>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="mt-15 px-0" cols="12" v-for="(item, i) in items" :key="i">
          <v-card flat color="transparent">
            <v-row class="justify-space-between">
              <v-col cols="8" md="6" class="px-0 text-color">
                <v-card-title
                  class="mb-4 main-heading"
                  v-text="item.title"
                ></v-card-title>

                <v-card-subtitle
                  v-text="item.text"
                  class="main-text"
                ></v-card-subtitle>

                <v-card-actions>
                  <v-btn
                    class="px-10 py-6 text-h5 font-weight-bold primary-fill"
                    outlined
                    rounded dark
                    width="350px"
                  >
                  <router-link class="reset-link" :to="item.button_link">
                    {{ item.button_text }}
                  </router-link>
                  </v-btn>
                </v-card-actions>
              </v-col>

              <v-avatar class="ma-3" size="185" tile>
                <v-img
                  :src="require('../assets' + item.picture + '.png')"
                ></v-img>
              </v-avatar>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-card class="d-flex align-center justify-center banner-bottom" height="356px" dark>
      <div class="text-center">
        <p class="text-h4 font-weight-bold mb-10">Готовы к удобой работе?</p>
        <v-btn class="px-10 py-6 text-h5 font-weight-bold yellow-fill" outlined rounded> Начать работу </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Home",

  components: {},
  data: () => ({
    items: [
      {
        picture: "/music",
        title: "Расшифровка",
        text: "Summary позволяет расшифровать конференции в реальном врменени, аудио и видео файлы, приложив к этому минимум усилий.",
        button_text: "Загрузить файл",
        button_link: "/decode",
      },
      {
        picture: "/microphone",
        title: "Конференция",
        text: "Summary позволяет расшифровать конференции в реальном врменени, аудио и видео файлы, приложив к этому минимум усилий.",
        button_text: "Начать конференцию",
        button_link: "/conference",
      },
      {
        picture: "/note",
        title: "Голосовой блокнот",
        text: "Summary позволяет расшифровать конференции в реальном врменени, аудио и видео файлы, приложив к этому минимум усилий.",
        button_text: "Записать голос",
        button_link: "/voice_note",
      },
    ],
  }),
};
</script>

<style>
.main-text {
  font-size: 1.25rem !important;
  font-weight: 400 !important;
  line-height: 24.38px !important;
  font-style: normal !important;
}
.main-heading {
  font-size: 1.875rem !important;
  font-weight: 700 !important;
}
.banner-bottom {
  background: url('../assets/main_banner.svg') no-repeat center center !important;
  background-size: cover !important;
}
.yellow-fill {
  background-color: #ffc600;
  border: unset;
}
.primary-fill {
  background-color: #117dec;
  border: unset;
}
</style>