<template>
  <div>
    <v-container class="py-10">
      <v-row class="justify-center">
        <v-col class="hidden-md-and-up" cols="12">
          <v-icon class="text-color" large @click="RouteConference">
            mdi-arrow-left
          </v-icon>
          <v-spacer></v-spacer>
        </v-col>
        <v-col cols="12" lg="6">
          <div class="text-h5 setting-column">
            <v-row class="justify-center">
              <v-col cols="12" class="d-flex">
                <v-icon class="text-color mhide" large @click="RouteConference"
                  >mdi-arrow-left
                </v-icon>
                <div class="text-h5 mx-auto text-color">
                  <span class="ml-n4 font-weight-bold">
                    Получение расшифровки
                  </span>
                </div>
              </v-col>
            </v-row>

            <v-row class="justify-center my-12">
              <v-col cols="10" md="6">
                <v-text-field
                  :rules="[rules.required]"
                  v-model="confId"
                  label="Код приглашения"
                  outlined
                  class="rounded-lg"
                  background-color="rgba(196, 196, 196, 0.2)"
                  color="rgba(20, 57, 106, 0.8)"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <div
              v-if="errors.length !== 0"
              class="mt-n8 mb-4 body-2 error--text text-center"
            >
              Ошибка: {{ errors ? errors[0] : "" }}
            </div>
            <div
              v-if="success.length !== 0"
              class="mt-n4 mb-4 success--text text-center"
            >
              {{ success }}
            </div>
            <v-row class="justify-center">
              <v-col cols="12" md="6" class="text-center">
                <v-btn
                  @click="getTranscription"
                  class="text-h6 bold-button primary-fill"
                  style="width: 213px; height: 40px"
                  dark
                  outlined
                  rounded
                >
                  Получить
                </v-btn>
              </v-col>
            </v-row>
            <v-dialog v-model="loading" hide-overlay persistent width="300">
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
          </div>
        </v-col>
      </v-row>
      <v-row class="mt-16 d-flex justify-center">
        <v-col cols="7" class="voice-border pa-0">
          <v-navigation-drawer
            permanent
            height="200px"
            width="100%"
            v-model="individual"
            color="rgba(17,125,236,0.05)"
          >
            <template v-slot:prepend>
              <v-list-item>
                <v-list-item-content class="text-center">
                  <v-list-item-title>
                    <div class="font-weight-bold mb-1">Конференции</div>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-divider class="voice-divider"></v-divider>

            <v-list dense class="ml-n2">
              <v-list-item
                v-for="(item, index) in conferences"
                :key="index"
                link
                @click="getConferenceTranscription(item.inviteCode)"
              >
                <v-list-item-content
                  class="d-flex justify-between align-center"
                >
                  <div class="font-weight-bold px-5 d-flex">
                    Название: {{ item.conferenceName }}
                  </div>
                  <div class="font-weight-bold px-5 d-flex">
                    Код приглашения:
                    {{ item.inviteCode }}
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
let pdfMake = require("pdfmake/build/pdfmake.js");
let pdfFonts = require("pdfmake/build/vfs_fonts.js");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import download from "downloadjs";

export default {
  data() {
    return {
      confId: "",
      rules: {
        required: (value) => !!value || "нужное поле"
      },
      errors: [],
      loading: false,
      success: "",
      individual: null,
      conferences: []
    };
  },
  mounted() {
    this.$store.dispatch("getConferences").then((response) => {
      this.conferences = response ? response.conferences : [];
    });
  },
  computed: {
    errorFeedback() {
      return this.confId.length !== 0;
    }
  },
  methods: {
    getConferenceTranscription(inviteCode) {
      this.$store.dispatch("getTranscription", inviteCode).then((response) => {
        const content = response.headers["content-type"];
        download(
          response.data,
          `Conference Transcription ${inviteCode}`,
          content
        );
      });
    },
    RouteConference() {
      this.$router.push("/conference");
    },
    getTranscription() {
      this.errors = [];
      this.loading = true;
      if (this.errorFeedback) {
        this.$store
          .dispatch("getTranscription", this.confId)
          .then((response) => {
            const content = response.headers["content-type"];
            download(
              response.data,
              `Conference Transcription ${this.confId}`,
              content
            );

            this.loading = false;
            this.success = "получена транскрипция успешно";
            setTimeout(() => {
              this.$router.push({ path: "/conference" });
            }, 1500);
          })
          .catch(() => {
            this.loading = false;
            // const feedback = err.response
            //   ? err.response.data.errorMessage
            //   : err.message;
            this.errors.push("Конференция не существует");
          });
      } else {
        this.loading = false;
        this.errors.push("обязательные поля");
      }
    }
  }
};
</script>

<style></style>
