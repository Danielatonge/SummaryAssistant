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
                  label="Номер конференции"
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
    </v-container>
  </div>
</template>

<script>
// import { jsPDF } from "jspdf";
let pdfMake = require("pdfmake/build/pdfmake.js");
let pdfFonts = require("pdfmake/build/vfs_fonts.js");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  data() {
    return {
      confId: "",
      rules: {
        required: (value) => !!value || "нужное поле",
      },
      errors: [],
      loading: false,
      success: "",
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
            console.log(data);

            let FILE = window.URL.createObjectURL(new Blob([data]));

            let docUrl = document.createElement("etxa");
            docUrl.href = FILE;
            docUrl.setAttribute("download", "transcription.pdf");
            document.body.appendChild(docUrl);
            docUrl.click();

            // let content = [`Conference: ${data.conferenceName}`];

            // const len = data.entries.length;
            // for (var i = 0; i < len; i++) {
            //   content.push(
            //     `${data.entries[i].participantName} :- ${data.entries[i].text}`
            //   );
            // }

            // var docDefinition = {
            //   content: content,
            // };
            // pdfMake
            //   .createPdf(docDefinition)
            //   .download(`Транскрипция_${data.conferenceName}.pdf`);

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
    },
  },
};
</script>

<style></style>
