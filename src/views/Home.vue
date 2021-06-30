<template>
  <div>
    <v-container class="pb-16">
      <v-row class="my-15">
        <v-col class="" cols="12">
          <v-card flat>
            <v-row class="justify-space-between">
              <v-col cols="8" md="6">
                <v-card-title class="text-h5 mb-4 font-weight-bold"
                  >Summary – your personal assistant</v-card-title
                >

                <v-card-subtitle
                  >Summary позволяет расшифровать конференции в реальном
                  врменени, аудио и видео файлы, приложив к этому минимум
                  усилий.</v-card-subtitle
                >

                <v-card-actions>
                  <v-btn class="px-6" outlined rounded> Начать работу </v-btn>
                </v-card-actions>
              </v-col>

              <v-avatar class="ma-3" size="250" tile>
                <v-img :src="require('../assets/record.jpg')"></v-img>
              </v-avatar>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="mt-15" cols="12" v-for="(item, i) in items" :key="i">
          <v-card flat>
            <v-row class="justify-space-between">
              <v-col cols="8" md="6">
                <v-card-title
                  class="text-h5 mb-4 font-weight-bold"
                  v-text="item.title"
                ></v-card-title>

                <v-card-subtitle v-text="item.text"></v-card-subtitle>

                <v-card-actions>
                  <v-btn class="px-6" outlined rounded>
                    {{ item.button_text }}
                  </v-btn>
                </v-card-actions>
              </v-col>

              <v-avatar class="ma-3" size="185" tile>
                <v-img
                  :src="require('../assets' + item.picture + '.jpg')"
                ></v-img>
              </v-avatar>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div class="grey" color="grey">
      <div class="text-center py-16">
        <p class="text-h4 font-weight-bold mb-10">Готовы к удобой работе?</p>
        <v-btn class="px-6" outlined rounded> Начать работу </v-btn>
      </div>
    </div>
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
        button_link: "",
      },
      {
        picture: "/microphone",
        title: "Конференция",
        text: "Summary позволяет расшифровать конференции в реальном врменени, аудио и видео файлы, приложив к этому минимум усилий.",
        button_text: "Начать конференцию",
        button_link: "",
      },
      {
        picture: "/note",
        title: "Голосовой блокнот",
        text: "Summary позволяет расшифровать конференции в реальном врменени, аудио и видео файлы, приложив к этому минимум усилий.",
        button_text: "Записать голос",
        button_link: "",
      },
    ],
  }),
};
</script>
