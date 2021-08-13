<template>
  <div>
    <v-container class="py-10">
      <v-row class="justify-center">
        <v-col cols="12" lg="6">
          <div class="text-h5 setting-column">
            <v-row class="justify-center">
              <v-col cols="12" class="d-flex">
                <v-icon large @click="RouteConference">mdi-arrow-left</v-icon>
                <div class="text-h5 mx-auto text-color">
                  <span class="ml-n10"> Получение расшифровки </span>
                </div>
              </v-col>
            </v-row>

            <v-row class="justify-center my-12">
              <v-col cols="6">
                <v-text-field
                  v-model="confId"
                  label="Номер конференции"
                  outlined
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="justify-center">
              <v-col cols="6" class="text-center">
                <v-btn
                  @click="getTranscription"
                  class="px-10 bold-button primary-fill"
                  dark
                  outlined
                  rounded
                >
                  Получить
                </v-btn>
              </v-col>
            </v-row>
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
    };
  },
  methods: {
    RouteConference() {
      this.$router.push("/conference");
    },
    getTranscription() {
      this.$store.dispatch("getTranscription", this.confId).then((data) => {
        let doc = jsPDF();
        doc.text(10, 10, JSON.stringify(data));
        doc.save(`Transcription_.pdf`);
        this.$router.push({ path: "/conference" });
      });
    },
  },
};
</script>

<style>
</style>