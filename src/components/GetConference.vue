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
                  >mdi-arrow-left</v-icon
                >
                <div class="text-h5 mx-auto text-color">
                  <span class="ml-n10"> Получение расшифровки </span>
                </div>
              </v-col>
            </v-row>

            <v-row class="justify-center my-12">
              <v-col cols="10" md="6">
                <v-text-field
                  :rules="[rules.required]"
                  v-model="confId"
                  label="Номер конференции"
                  outlined
                  background-color="grey lighten-2"
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
    </v-container>
  </div>
</template>

<script>
import { jsPDF } from "jspdf";

export default {
  data() {
    return {
      confId: "",
      rules: {
        required: (value) => !!value || "нужное поле",
      },
      errors: [],
      loading: false,
    };
  },
  computed: {
    errorFeedback() {
      return this.confId.length !== 0;
    },
  },
  methods: {
    RouteConference() {
      this.$router.push("/conference");
    },
    getTranscription() {
      this.errors = [];
      this.loading = true;
      if (this.errorFeedback) {
        this.$store
          .dispatch("getTranscription", this.confId)
          .then((data) => {
            let doc = jsPDF();
            doc.text(10, 10, JSON.stringify(data));
            doc.save(`Transcription_.pdf`);
            this.$router.push({ path: "/conference" });
          })
          .catch((err) => {
            this.loading = false;
            const feedback = err.response
              ? err.response.data.errorMessage
              : err.message;
            this.errors.push(feedback);
          });
      } else {
        this.loading = false;
        this.errors.push("обязательные поля");
      }
    },
  },
};
</script>

<style>
</style>