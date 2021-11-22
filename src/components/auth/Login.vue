<template>
  <div>
    <v-container class="py-10">
      <v-row class="justify-center">
        <v-col cols="12" lg="8">
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
          <div class="setting-column">
            <v-row class="justify-center text-color">
              <v-col cols="12" class="d-flex">
                <div class="mx-auto">
                  <p class="text-h6">Login</p>
                  <span>
                    Eсли у вас нет учетной записи, вы можете зарегистрироваться
                    <router-link to="/register">здесь</router-link>
                  </span>
                </div>
              </v-col>
            </v-row>
            <v-row class="justify-center mt-6">
              <v-col cols="10" sm="8" md="6">
                <v-text-field
                  v-model="username"
                  label="ФИО"
                  outlined
                  autocomplete="new-password"
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="justify-center mb-4">
              <v-col cols="10" sm="8" md="6">
                <v-text-field
                  label="Пароль"
                  v-model="password"
                  outlined
                  autocomplete="new-password"
                  background-color="grey lighten-2"
                  hide-details="auto"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  class="input-group--focused"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </v-col>
            </v-row>
            <div
              v-if="errors.length !== 0"
              class="mt-n4 mb-4 error--text text-center"
            >
              Ошибка входа: {{ errors ? errors[0] : "" }}
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
                  class="text-h6 bold-button primary-fill"
                  dark
                  style="width: 213px; height: 40px"
                  outlined
                  rounded
                  @click.prevent="login"
                >
                  Войти
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
  name: "Login",
  computed: {
    errorFeedback() {
      return this.username.length !== 0 && this.password.length !== 0;
    }
  },
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      errors: [],
      loading: null,
      success: ""
    };
  },
  methods: {
    login() {
      this.errors = [];
      this.loading = true;
      if (this.errorFeedback) {
        this.$store
          .dispatch("retrieveToken", {
            username: this.username,
            password: this.password
          })
          .then(() => {
            this.loading = false;
            this.success = "Вход выполнен успешно";
            setTimeout(() => {
              this.$router.push({ name: "Home" });
            }, 1500);
          })
          .catch((err) => {
            this.loading = false;
            const feedback = err.response
              ? err.response.data.errorMessage
              : err.message;
            this.errors.push(feedback);
            console.log("EEr", err.message);
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
