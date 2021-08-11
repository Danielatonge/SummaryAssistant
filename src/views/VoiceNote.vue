<template>
  <div>
    <v-container class="py-10 mhide">
      <v-row>
        <v-col cols="12">
          <v-icon dark class="orange pa-3 rounded-xl">
            mdi-microphone-outline
          </v-icon>
        </v-col>
        <v-col cols="12" class="voice-border">
          <v-row>
            <v-col cols="6" md="4" lg="3">
              <v-navigation-drawer
                permanent
                height="500px"
                color="transparent"
                v-model="archives"
              >
                <template v-slot:prepend>
                  <v-list-item>
                    <v-list-item-content class="text-center">
                      <v-list-item-title>Архив записей</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>

                <v-divider></v-divider>

                <v-list dense>
                  <v-list-item v-for="item in items" :key="item.title" link>
                    <v-list-item-icon>
                      <v-icon>mdi-folder</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-navigation-drawer>
            </v-col>
            <v-col cols="6" md="8" lg="9">
              <tiny-editor></tiny-editor>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="mt-10">
        <v-col cols="12">
          <v-img :src="require('../assets/signal.png')"></v-img>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="py-10 hidden-md-and-up">
      <v-row>
        <v-col cols="12" class="d-flex">
          <v-icon dark class="orange pa-3 mr-5 rounded-xl">
            mdi-microphone-outline
          </v-icon>
          <v-img width="80%" :src="require('../assets/signal.png')"></v-img>
        </v-col>
        <v-col cols="12" class="voice-border">
          <v-sheet height="500px">
            <tiny-editor></tiny-editor>
          </v-sheet>
        </v-col>
        <v-col cols="12">
          <v-navigation-drawer
            permanent
            width="100%"
            height="200px"
            color="transparent"
            v-model="archives"
          >
            <template v-slot:prepend>
              <v-list-item>
                <v-list-item-content class="text-center">
                  <v-list-item-title>Архив записей</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-divider></v-divider>

            <v-list dense>
              <v-list-item v-for="item in items" :key="item.title" link>
                <v-list-item-icon>
                  <v-icon>mdi-folder</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TinyEditor from "@/components/TinyEditor.vue";

export default {
  components: { TinyEditor },
  data() {
    return {
      archives: null,
      items: [
        { title: "#803762003" },
        { title: "#797518030" },
        { title: "#752856189" },
      ],
    };
  },
};
</script>

<style>
.voice-border {
  border: 1px solid #e0e0e0;
  border-radius: 15px;
}
</style>