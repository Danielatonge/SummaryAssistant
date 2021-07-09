<template>
  <div>
    <v-container class="text-center mt-10">
      <p class="text-h5 font-weight-bold mb-7">
        Расшифровка аудио и видео файлов
      </p>
      <v-row class="d-flex justify-center">
        <v-col cols="8">
          <v-sheet
            class="rounded-lg mx-auto d-flex flex-wrap justify-center"
            outlined
            color="grey lighten-3"
            height="400"
          >
            <div class="my-auto">
              <v-icon class="icon-file-move pb-2">mdi-file-move</v-icon>
              <p>Пертащите или загрузите файл</p>
              <v-dialog v-model="dialog" persistent max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="px-6" outlined rounded v-bind="attrs" v-on="on"
                    >Загрузить файл</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title class="justify-center">
                    <span class="text-h5">Введите данные о файле</span>
                  </v-card-title>
                  <v-card-text class="pb-0">
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-select
                            class="rounded-lg"
                            v-model="select.language"
                            :items="languages"
                            label="Выберите язык"
                            outlined
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-tooltip right>
                            <template v-slot:activator="{ on, attrs }">
                              <v-select
                                class="rounded-lg"
                                v-model="select.service"
                                :items="services"
                                label="Выберите сервис"
                                outlined
                              >
                                <v-icon
                                  v-bind="attrs"
                                  v-on="on"
                                  slot="append-outer"
                                >
                                  mdi-help-circle-outline
                                </v-icon>
                              </v-select>
                            </template>
                            <span>
                              <b>Телефонный разговор</b> - расшифровка аудио во
                              время <br />
                              телефонного разговора. <br />
                              <b> Командование и поиск </b> - расшифровка более
                              <br />
                              коротких аудиоклипов (голосовые команды или <br />
                              голосовой поиск). <br />
                              <b>По умолчанию </b>- расшифровка аудиосистем не
                              <br />
                              подходящих ни к одной из ранее описанных моделей
                              <br />
                              (длинные аудиозаписи).
                            </span>
                          </v-tooltip>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            class="rounded-lg"
                            label="Количество говорящих"
                            value="1"
                            type="number"
                            outlined
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-tooltip right>
                            <template v-slot:activator="{ on, attrs }">
                              <v-select
                                class="rounded-lg"
                                v-model="select.type"
                                :items="types"
                                label="Выберите тип"
                                outlined
                              >
                                <v-icon
                                  v-bind="attrs"
                                  v-on="on"
                                  slot="append-outer"
                                >
                                  mdi-help-circle-outline
                                </v-icon>
                              </v-select>
                            </template>
                            <span>
                              <b>Телефонный разговор</b> - расшифровка аудио во
                              время <br />
                              телефонного разговора. <br />
                              <b> Командование и поиск </b> - расшифровка более
                              <br />
                              коротких аудиоклипов (голосовые команды или <br />
                              голосовой поиск). <br />
                              <b>По умолчанию </b>- расшифровка аудиосистем не
                              <br />
                              подходящих ни к одной из ранее описанных моделей
                              <br />
                              (длинные аудиозаписи).
                            </span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <router-link to="/decode/video" class="reset-link">
                      <v-btn
                        elevation="0"
                        dark
                        color="blue darken-1"
                        class="px-5"
                        rounded
                      >
                        Расшифровать
                      </v-btn>
                    </router-link>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      rounded
                      text
                      @click="dialog = false"
                    >
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center mt-10">
        <v-col cols="10" class="d-flex">
          <v-text-field
            class="rounded-lg"
            v-model="link"
            label="URL"
            dense
            placeholder="www.youtube.ru"
            outlined
          ></v-text-field>
          <v-btn color="primary" class="rounded-lg ml-5" height="40px">
            Загрузить
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      link: "",
      dialog: false,
      select: {
        type: "По умолчанию",
        service: "Гугл",
        language: "Русский",
      },
      types: ["По умолчанию", "Option 2"],
      services: ["Гугл", "Yahoo", "bing"],
      languages: ["Русский", "English"],
    };
  },
};
</script>

<style scoped>
.icon-file-move {
  font-size: 6rem;
}
</style>