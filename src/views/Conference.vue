<template>
  <div>
    <v-container class="text-center mt-10">
      <v-row class="d-flex justify-center">
        <v-col cols="8">
          <v-sheet
            class="rounded-lg mx-auto d-flex flex-wrap justify-center"
            color="transparent"
            height="400"
          >
            <div class="my-auto">
              <div class="mb-6" v-for="(item, index) in functions" :key="index">
                <router-link :to="item.link" class="reset-link">
                  <v-btn class="px-6" outlined rounded>
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
      { text: "Создать конференцию", link: "/conference/create" },
      { text: "Подключиться к конференции", link: "/conference/connect" },
      { text: "Получить расшифровку", link: "/conference/get-encoding" },
    ],
  }),
};
</script>

<style>
</style>