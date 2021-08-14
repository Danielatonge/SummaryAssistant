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
        <v-col cols="12" lg="7">
          <div class="text-h5 setting-column">
            <v-row class="justify-center text-color">
              <v-col cols="12" class="d-flex">
                <v-icon class="text-color mhide" large @click="RouteConference">
                  mdi-arrow-left
                </v-icon>
                <div class="text-h5 mx-auto">
                  <span> Подключение к конференции </span>
                </div>
              </v-col>
            </v-row>

            <v-row class="justify-center mt-12">
              <v-col cols="10" md="6">
                <v-text-field
                  v-model="conferenceId"
                  label="Номер конференции"
                  outlined
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="justify-center mb-12">
              <v-col cols="10" md="6">
                <v-text-field
                  v-model="participantName"
                  label="Имя участника"
                  outlined
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="justify-center">
              <v-col cols="12" md="6" class="text-center">
                <v-btn
                  @click="joinConference"
                  class="text-h6 bold-button primary-fill"
                  style="width:213px;height:40px;"
                  dark
                  outlined
                  rounded
                >
                 
                  Подключиться
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
export default {
  data() {
    return {
      conferenceId: "",
      participantName: "",
    };
  },
  methods: {
    RouteConference() {
      this.$router.push("/conference");
    },
    joinConference() {
      this.$store
        .dispatch("joinConference", {
          confId: this.conferenceId,
          partName: this.participantName,
        })
        .then((confId) => {
          this.$router.push({ path: `/conference/connected/${confId}` });
        });
    },
  },
};
</script>

<style>

</style>