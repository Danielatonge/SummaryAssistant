<template>
  <div>
    <v-container class="py-10 mhide">
      <v-row>
        <v-col cols="12" class="d-flex flex-wrap">
          <v-icon
            dark
            class="orange pa-3 rounded-xl"
            @click="recording = !recording"
          >
            {{ recording ? "mdi-stop" : "mdi-microphone-outline" }}
          </v-icon>
          <v-spacer></v-spacer>
          <div class="d-block d-sm-flex">
            <v-btn class="px-4 primary-fill" dark outlined rounded>
              <router-link to="/conference" class="reset-link">
                Выйти
              </router-link>
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" class="voice-border">
          <v-row>
            <v-col cols="6" md="4" lg="2">
              <v-navigation-drawer
                permanent
                height="500px"
                v-model="individual"
                color="transparent"
              >
                <template v-slot:prepend>
                  <v-list-item>
                    <v-list-item-content class="text-center">
                      <v-list-item-title>
                        Обсуждение проекта {{ participants }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>

                <v-divider></v-divider>

                <v-list dense class="ml-n2">
                  <v-list-item
                    v-for="(item, index) in participants"
                    :key="index"
                    link
                  >
                    <v-list-item-icon class="mr-2" v-show="item.host">
                      <v-icon>mdi-account</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-navigation-drawer>
            </v-col>
            <v-col cols="6" md="8" lg="10">
              <editor
                v-model="editorText"
                apiKey="06j1sdk82snkig4i7v5u03ne6nrs1dabbh9ftqntbcutrvv6"
                :disabled="false"
                :init="{
                  height: 500,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help',
                }"
              />
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
      <p class="text-h4 text-color font-weight-bold mb-7 text-left">
        Конференция №11111111
      </p>

      <v-row>
        <v-col cols="12" class="d-flex">
          <v-icon
            dark
            class="orange pa-3 mr-5 rounded-xl"
            @click="recording = !recording"
          >
            {{ recording ? "mdi-stop" : "mdi-microphone-outline" }}
          </v-icon>
          <v-img
            width="80%"
            :src="require('../assets/signal.png')"
          ></v-img>
        </v-col>
      </v-row>
      <v-row class="my-8">
        <v-col cols="12" class="voice-border">
          <v-sheet height="500px">
            <editor
              v-model="editorText"
              apiKey="06j1sdk82snkig4i7v5u03ne6nrs1dabbh9ftqntbcutrvv6"
              :disabled="false"
              :init="{
                height: 500,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount',
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help',
              }"
            />
          </v-sheet>
        </v-col>
      </v-row>
      <v-row class="mb-6">
        <v-col cols="12" class="voice-border">
          <v-navigation-drawer
            permanent
            height="200px"
            width="100%"
            v-model="individual"
            color="transparent"
          >
            <template v-slot:prepend>
              <v-list-item>
                <v-list-item-content class="text-center">
                  <v-list-item-title>
                    Обсуждение проекта {{ participants }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-divider></v-divider>

            <v-list dense class="ml-n2">
              <v-list-item
                v-for="(item, index) in participants"
                :key="index"
                link
              >
                <v-list-item-icon class="mr-2" v-show="item.host">
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-col>
      </v-row>
      <div class="text-center">
        <v-btn class="px-10 primary-fill" dark outlined rounded>
          <router-link to="/conference" class="reset-link"> Выйти </router-link>
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import { mapState } from "vuex";

export default {
  components: { Editor },
  watch: {
    recording(val) {
      console.log(val);
      if (val) {
        this.startRecording();
      } else {
        this.stopRecording();
      }
    },
  },
  computed: {
    ...mapState({ part: "current_participant" }),
  },
  mounted() {
    const confId = this.$route.params.id;
    this.confId = confId;
    this.participants = this.$store.getters.participantsById(confId);
  },
  data() {
    return {
      confId: null,
      recording: false,
      participants: null,
      individual: null,
      partInfo: null,
      blobs: [],
      editorText: [],
    };
  },
  methods: {
    startRecording() {},
    stopRecording() {},
    download() {},
  },
};
</script>

<style>
</style>