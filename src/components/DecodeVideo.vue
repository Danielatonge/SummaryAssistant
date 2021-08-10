<template>
  <div>
    <v-container class="py-10">
      <v-row>
        <v-col cols="12" class="voice-border">
          <v-sheet height="500px">
            <tiny-editor></tiny-editor>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row class="mt-16">
        <v-col cols="12" md="5" lg="4" xl="3" class="voice-border">
          <v-sheet height="100px" class="d-flex align-end justify-center">
              <v-icon>mdi-play-outline</v-icon>
              <v-icon>mdi-pause</v-icon>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="7" lg="8" xl="9" class="pl-md-10 my-auto">
            <span><v-icon>mdi-help-circle-outline</v-icon></span>
          <v-img :src="require('../assets/signal.png')"></v-img>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TinyEditor from './TinyEditor.vue';
export default {
  components: { TinyEditor },
  data() {
    return {};
  },
};
</script>

<style>
</style>