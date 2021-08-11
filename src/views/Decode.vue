<template>
  <div>
    <v-container class="text-center mt-10 mhide">
      <p class="text-h5 font-weight-bold mb-7 text-color">
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
            <div class="my-auto text-color justify-center">
              <div class="mx-auto">
                <v-file-input
                  v-model="file_upload"
                  class="pb-10 icon-file"
                  prepend-icon="mdi-file-move"
                  hide-input
                  truncate-length="1"
                ></v-file-input>
              </div>
              <p>Пертащите или загрузите файл</p>
              <v-dialog v-model="dialog" persistent max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="px-6 primary-fill"
                    dark
                    outlined
                    rounded
                    v-bind="attrs"
                    v-on="on"
                  >
                    Загрузить файл
                  </v-btn>
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
                            v-model="select.num_speakers"
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
                  <v-card-actions class="px-9 pb-7">
                    <v-btn
                      :disabled="loadDialog"
                      :loading="loadDialog"
                      elevation="0"
                      dark
                      color="blue darken-1"
                      class="px-5"
                      rounded
                      @click="goToDecodeVideo"
                    >
                      Расшифровать
                    </v-btn>
                    <v-dialog
                      v-model="loadDialog"
                      hide-overlay
                      persistent
                      width="300"
                    >
                      <v-card color="primary" dark>
                        <v-card-text class="pt-4">
                          Подождите, пожалуйста
                          <v-progress-linear
                            indeterminate
                            color="white"
                            class="my-4"
                          ></v-progress-linear>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
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
          <v-btn
            @click="dialog = true"
            color="primary"
            class="rounded-lg ml-5"
            height="40px"
          >
            Загрузить
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="mt-10 hidden-md-and-up text-color px-8">
      <p class="text-h4 font-weight-bold mb-7 text-left">Расшифровка</p>
      <div class="main-text text-left mb-10">
        Summary позволяет расшифровать конференции в реальном врменени, аудио и
        видео файлы, приложив к этому минимум усилий.
      </div>
      <div class="d-flex text-color justify-center">
        <div class="">
          <v-file-input
            v-model="file_upload"
            class="pb-10 icon-file"
            prepend-icon="mdi-file-move"
            hide-input
            truncate-length="1"
          ></v-file-input>
        </div>
      </div>
      <div class="text-center mb-6">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="px-6 primary-fill"
              dark
              outlined
              rounded
              v-bind="attrs"
              v-on="on"
            >
              Загрузить файл
            </v-btn>
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
                          <v-icon v-bind="attrs" v-on="on" slot="append-outer">
                            mdi-help-circle-outline
                          </v-icon>
                        </v-select>
                      </template>
                      <span>
                        <b>Телефонный разговор</b> - расшифровка аудио во время
                        <br />
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
                      v-model="select.num_speakers"
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
                          <v-icon v-bind="attrs" v-on="on" slot="append-outer">
                            mdi-help-circle-outline
                          </v-icon>
                        </v-select>
                      </template>
                      <span>
                        <b>Телефонный разговор</b> - расшифровка аудио во время
                        <br />
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
            <v-card-actions class="px-9 pb-7">
              <v-btn
                elevation="0"
                dark
                color="blue darken-1"
                class="px-5"
                rounded
                @click="goToDecodeVideo"
              >
                Расшифровать
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" rounded text @click="dialog = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <p class="text-h5 font-weight-bold mb-2 text-left">
        Расшифровка по ссылке
      </p>
      <div class="main-text text-left mb-0">Введите адрес:</div>
      <div class="mt-4 mb-0">
        <v-text-field
          class="rounded-lg"
          v-model="link"
          label="URL"
          dense
          placeholder="www.youtube.ru"
          outlined
        ></v-text-field>
      </div>
      <div>
        <v-btn
          class="px-6 primary-fill"
          dark
          outlined
          rounded
          @click="dialog = true"
          >Расшифровать
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadDialog: false,
      link: "",
      file_upload: "",
      dialog: false,
      select: {
        type: "По умолчанию",
        service: "google",
        language: "Русский",
        num_speakers: 1,
      },
      types: ["По умолчанию", "По умолчанию 2"],
      services: ["google", "yahoo", "bing"],
      languages: ["Русский", "English"],
    };
  },
  methods: {
    goToDecodeVideo() {
      this.loadDialog = true;
      this.$store
        .dispatch("getStorageLink", this.select.service)
        .then((response) => {
          // https://cors-anywhere.herokuapp.com/
          this.$store
            .dispatch("uploadMediaToStorage", {
              file: this.file_upload,
              url: response.storageUrl,
            })
            .then(() => {
              const transId = this.$store.getters.transcribeId;
              this.$store
                .dispatch("beginTranscription", transId)
                .then((response) => {
                  this.$store
                    .dispatch("verifyTranscriptionStatus", response)
                    .then((state) => {
                      console.log(state)
                      const transId = this.$store.getters.transcribeId;
                      this.$store
                        .dispatch("getDecodedTranscription", transId)
                        .then(() => {
                          this.$router.push({ path: "decode/video" });
                        });
                    });
                });
            });
        });
    },
  },
};
</script>

<style>
.icon-file .v-icon.v-icon--link.mdi.mdi-file-move.theme--light {
  font-size: 6rem !important;
  color: #14396a !important;
  margin-left: 13rem;
}
@media only screen and (max-width: 960px) {
  .icon-file .v-icon.v-icon--link.mdi.mdi-file-move.theme--light {
    margin: 0;
  }
}
</style>