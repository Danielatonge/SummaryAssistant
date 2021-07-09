<template>
  <div>
    <v-container class="py-10">
      <v-row class="justify-center">
        <v-col cols="12" lg="6">
          <div class="text-h5 setting-column">
            <v-row class="justify-center">
              <v-col cols="12" class="d-flex">
                <v-icon large @click="RouteConference"> mdi-arrow-left </v-icon>
                <div class="text-h4 mx-auto">
                  <span class="ml-n10"> Создание конференции </span>
                </div>
              </v-col>
            </v-row>

            <v-row class="justify-center mt-12">
              <v-col cols="6">
                <v-text-field
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
                  label="Имя организатора"
                  outlined
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="justify-center">
              <v-col cols="6" class="text-center">
                <router-link to="/conference/created" class="reset-link">
                  <v-btn class="px-10" outlined rounded> Создать </v-btn>
                </router-link>
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
  methods: {
    RouteConference() {
      this.$router.push("/conference");
    },
  },
};
</script>

<style>
</style>