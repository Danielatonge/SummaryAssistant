<template>
  <div>
    <v-container class="py-10">
      <v-row class="justify-center">
        <v-col cols="12" lg="6">
          <div class="text-h5 setting-column">
            <v-row class="justify-center">
              <v-col cols="12" class="d-flex">
                <v-icon class="text-color" large @click="RouteConference">
                  mdi-arrow-left
                </v-icon>
                <div class="text-h5 mx-auto text-color">
                  <span class="ml-n10"> Создание конференции </span>
                </div>
              </v-col>
            </v-row>

            <v-row class="justify-center mt-12">
              <v-col cols="6">
                <v-text-field
                  v-model="conferenceName"
                  label="Hазвание конференции"
                  outlined
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="justify-center mb-12">
              <v-col cols="6">
                <v-text-field
                  v-model="organizerName"
                  label="Имя организатора"
                  outlined
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="justify-center">
              <v-col cols="6" class="text-center">
                <v-btn @click="createConference" class="px-10 primary-fill" dark outlined rounded>
                  Создать
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
      conferenceName: "",
      organizerName: "",
    };
  },
  methods: {
    createConference() {
      this.$store
        .dispatch("createConference", {
          conferenceName: this.conferenceName,
          organizerName: this.organizerName,
        })
        .then(() => {
          this.$router.push({ path: "/conference/created" });
        });
    },
    RouteConference() {
      this.$router.push("/conference");
    },
  },
};
</script>

<style>
</style>