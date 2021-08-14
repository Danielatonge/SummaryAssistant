<template>
  <div>
    <v-container class="text-center mt-10">
      <v-row>
        <v-col cols="8">
          <p
            class="
              text-h4
              px-8
              font-weight-bold
              mb-4
              text-color text-left
              hidden-md-and-up
            "
          >
            Конференции
          </p>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="8">
          <v-sheet
            class="rounded-lg mx-auto d-flex flex-wrap justify-center"
            color="transparent"
            height="400"
          >
            <div class="my-auto">
              <div class="mb-6" v-for="(item, index) in functions" :key="index">
                <router-link :to="item.link" class="reset-link">
                  <v-btn
                    class="text-h5 normalize font-weight-bold px-10 py-7"
                    dark
                    style="width: 500px; height: 57px"
                    outlined
                    rounded
                    :class="item.blue ? 'primary-fill' : 'orange-fill'"
                  >
                    {{ item.text }}
                  </v-btn>
                </router-link>
              </div>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    functions: [
      { text: "Создать конференцию", link: "/conference/create", blue: false },
      {
        text: "Подключиться к конференции",
        link: "/conference/connect",
        blue: true,
      },
      {
        text: "Получить расшифровку",
        link: "/conference/get-encoding",
        blue: true,
      },
    ],
  }),
};
</script>

<style>
.orange-fill {
  background-color: #fb6337;
  border: unset;
}

@media only screen and (max-width: 600px) {
  .normalize {
    width: 100% !important;
    height: 70px !important;
  }
  .v-btn__content {
    width: 100% !important;
    white-space: normal !important;
  }
}
</style>