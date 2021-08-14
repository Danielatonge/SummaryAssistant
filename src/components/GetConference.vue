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
                  v-model="confId"
                  label="Номер конференции"
                  outlined
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="justify-center">
              <v-col cols="12" md="6" class="text-center">
                <v-btn
                  @click="getTranscription"
                  class="text-h6 bold-button primary-fill"
                  style="width:213px;height:40px;"
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