<template>
  <div>
    <v-container class="py-10">
      <v-row>
        <v-col cols="12" class="d-flex flex-wrap">
          <v-icon dark class="orange pa-3 rounded-xl">
            mdi-microphone-outline
          </v-icon>
          <v-spacer></v-spacer>
          <div class="d-block d-sm-flex">
            <v-btn class="px-4 mr-3" outlined rounded>
              Получить расшифровку
            </v-btn>
            <v-btn class="px-4" outlined rounded> Завершить конференцию </v-btn>
          </div>
        </v-col>
        <v-col cols="12" class="voice-border">
          <v-row>
            <v-col cols="6" md="4" lg="3">
              <v-navigation-drawer
                permanent
                height="500px"
                v-model="individual"
              >
                <template v-slot:prepend>
                  <v-list-item>
                    <v-list-item-content class="text-center">
                      <v-list-item-title>№ 1286761</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>

                <v-divider></v-divider>

                <v-list dense>
                  <v-list-item
                    v-for="(item, index) in participants"
                    :key="index"
                    link
                  >
                    <v-list-item-icon v-show="item.creator" class="mr-2">
                      <v-icon>mdi-account</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-navigation-drawer>
            </v-col>
            <v-col cols="6" md="8" lg="9"> </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="mt-10">
        <v-col cols="12">
          <v-img :src="require('../assets/signal.jpg')"></v-img>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      individual: null,
      participants: [
        { name: "Александра Андреевна", creator: true },
        { name: "Антон Михайлов", creator: false },
        { name: "Анастасия Иванова", creator: false },
        { name: "Никита Андреевич", creator: false },
        { name: "Казаков А.Н.", creator: false },
        { name: "Петрова Анаствсия Андреев", creator: false },
      ],
    };
  },
};
</script>

<style>
</style>