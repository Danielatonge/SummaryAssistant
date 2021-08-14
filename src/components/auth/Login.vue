<template>
  <div>
    <v-container class="py-10">
      <v-row class="justify-center">
        <v-col cols="12" lg="6">
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
                  background-color="grey lighten-2"
                  hide-details="auto"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  class="input-group--focused"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- <div v-if="true" class="mt-n4 mb-4 error--text text-center">
              Error on Login: {{ feedback }}
            </div> -->

            <v-row class="justify-center">
              <v-col cols="6" class="text-center">
                <v-btn
                  class="px-10 primary-fill"
                  dark
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
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      feedback: "",
    };
  },
  methods: {
    login() {
      const This = this;
      this.$store
        .dispatch("retrieveToken", {
          username: this.username,
          password: this.password,
        })
        .then(() => {
          this.$router.push({ name: "Home" });
        })
        .catch((err) => {
          This.feeback = err.message;
          console.log("EEr", err.message)
        });
    },
  },
};
</script>

<style>
</style>