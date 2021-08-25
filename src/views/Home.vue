<template>
  <div>
    <v-container class="pb-16">
      <v-row class="my-15 d-flex justify-space-between">
        <div class="px-0 text-color mtext-center my-auto contain-width">
          <div class="mt-md-8 mb-4 main-heading mhide">
            Summary – your personal assistant
          </div>
          <div class="mt-md-8 bold-button mb-4 text-h4 d-md-none">
            <div style="font-weight: 800; font-size: 43px">Summary</div>
            your personal assistant
          </div>

          <v-avatar
            class="ma-3 d-md-none d-lg-none d-xl-none mb-6"
            color="transparent"
            size="300"
            tile
          >
            <v-img contain :src="require('../assets/record.png')"></v-img>
          </v-avatar>
          <div class="main-text mb-md-10 text-left px-6 px-md-0">
            Summary позволяет расшифровать конференции в реальном врменени,
            аудио и видео файлы, приложив к этому минимум усилий.
          </div>

          <div class="mt-10">
            <v-btn
              class="px-10 py-6 text-h5 font-weight-bold yellow-fill text-color"
              outlined
              rounded
              width="322px"
              height="57px"
              @click="$router.push({ path: '/decode' })"
            >
              Начать работу
            </v-btn>
          </div>
        </div>
        <v-avatar class="mhide" color="transparent" size="340" tile>
          <v-img contain :src="require('../assets/record.png')"></v-img>
        </v-avatar>
      </v-row>
      <v-row class="d-none d-md-block">
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
                    rounded
                    dark
                    width="350px"
                    height="57px"
                    @click="$router.push({ path: `${item.button_link}` })"
                  >
                    {{ item.button_text }}
                  </v-btn>
                </v-card-actions>
              </v-col>

              <v-avatar class="ma-3" size="255" tile>
                <v-img
                  :src="require('../assets' + item.picture + '.png')"
                ></v-img>
              </v-avatar>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <vue-glide :perView="1" class="hidden-md-and-up pa-0">
        <vue-glide-slide class="pa-0 ml-3" v-for="(item, i) in items" :key="i">
          <div class="border-main max-content rounded-xl pa-10">
            <div class="px-0 text-color text-center">
              <div class="mb-2 main-heading" v-text="item.title"></div>
              <v-avatar class="mb-5" size="185" tile>
                <v-img
                  :src="require('../assets' + item.picture + '.png')"
                ></v-img>
              </v-avatar>
              <div v-text="item.text" class="main-text text-left mb-6"></div>

              <div>
                <v-btn
                  class="px-10 py-6 text-h5 font-weight-bold primary-fill"
                  outlined
                  rounded
                  dark
                  width="100%"
                  @click="$router.push({ path: `${item.button_link}` })"
                >
                  Подробнее
                </v-btn>
              </div>
            </div>
          </div>
        </vue-glide-slide>
      </vue-glide>
    </v-container>
    <v-card
      class="px-2 d-flex align-center justify-center banner-bottom"
      height="356px"
      dark
    >
      <div class="text-center">
        <p class="text-h4 font-weight-bold mb-10">Готовы к удобой работе?</p>
        <v-btn
          class="px-10 py-6 text-h5 font-weight-bold yellow-fill"
          outlined
          rounded
          @click="$router.push({ path: '/decode' })"
        >
          Начать работу
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import { Glide, GlideSlide } from "vue-glide-js";

export default {
  name: "Home",
  mounted() {},
  components: {
    [Glide.name]: Glide,
    [GlideSlide.name]: GlideSlide,
  },
  data: () => ({
    active: 4,
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
  background: url("../assets/main_banner.svg") no-repeat center center !important;
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
.contain-width {
  max-width: 60%;
}
@media only screen and (max-width: 960px) {
  .contain-width {
    max-width: 100%;
  }
  .mtext-center {
    text-align: center;
  }
  .mhide {
    display: none !important;
  }
  .mshow {
    display: block;
  }
  .border-main {
    border: 2px solid #14396a !important;
    background-color: #fff !important;
  }
  .max-content {
    max-width: 80%;
    /* margin: 0 auto; */
  }
  ul.glide_slides {
    padding-left: 0 !important;
  }
}
</style>