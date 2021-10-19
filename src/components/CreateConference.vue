<template>
  <div>
    <v-container class="py-16 mt-md-10">
      <v-row class="justify-center">
        <v-col class="hidden-md-and-up" cols="12">
          <v-icon class="text-color" large @click="RouteConference">
            mdi-arrow-left
          </v-icon>
          <v-spacer></v-spacer>
        </v-col>
        <v-col cols="12" md="8" lg="6">
          <div class="text-h5 setting-column">
            <v-row class="justify-center">
              <v-col cols="12" class="d-flex">
                <v-icon class="text-color mhide" large @click="RouteConference">
                  mdi-arrow-left
                </v-icon>
                <div class="text-h5 mx-auto text-color">
                  <span class="ml-n10 font-weight-bold">
                    Создание конференции
                  </span>
                </div>
              </v-col>
            </v-row>

            <v-row class="justify-center mt-12">
              <v-col cols="10" md="6" xl="5">
                <v-text-field
                  :rules="[rules.required]"
                  v-model="conferenceName"
                  label="Hазвание конференции"
                  outlined
                  class="rounded-lg"
                  background-color="rgba(196, 196, 196, 0.2)"
                  color="rgba(20, 57, 106, 0.8)"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="justify-center mb-12">
              <v-col cols="10" md="6" xl="5">
                <v-text-field
                  :rules="[rules.required]"
                  v-model="organizerName"
                  label="Имя организатора"
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
                  @click="createConference"
                  class="text-h6 bold-button primary-fill"
                  style="width: 213px; height: 40px"
                  dark
                  outlined
                  rounded
                >
                  Создать
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
export default {
  data() {
    return {
      conferenceName: "",
      organizerName: "",
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
      return this.conferenceName.length !== 0 && this.organizerName.length != 0;
    },
  },
  methods: {
    createConference() {
      this.errors = [];
      this.loading = true;
      if (this.errorFeedback) {
        this.$store
          .dispatch("createConference", {
            conferenceName: this.conferenceName,
            organizerName: this.organizerName,
          })
          .then((confId) => {
            this.loading = false;
            this.success = "Успешно созданная конференция";
            setTimeout(() => {
              this.$router.push({ path: `/conference/created/${confId}` });
            }, 1500);
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
    RouteConference() {
      this.$router.push("/conference");
    },
  },
};
</script>

<style>
.outer {
  position: absolute;
  height: 100%;
  width: 100%;
}

.theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state)
  > .v-input__control
  > .v-input__slot
  fieldset {
  color: rgba(20, 57, 106, 0.2);
}

.theme--light.v-text-field--outlined
  > .v-input__control
  > .v-input__slot:hover {
  color: rgba(20, 57, 106, 0.8);
}
</style>
