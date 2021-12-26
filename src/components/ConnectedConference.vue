<template>
  <div>
    <v-container class="py-10 mhide px-4">
      <v-row>
        <v-col cols="12" class="d-flex flex-wrap px-0">
          <v-icon
            dark
            class="orange pa-3 rounded-xl"
            @click="recording = !recording"
          >
            {{ recording ? "mdi-stop" : "mdi-microphone-outline" }}
          </v-icon>
          <v-spacer></v-spacer>
          <div class="d-block d-sm-flex">
            <v-btn
              class="px-10 primary-fill font-weight-bold"
              :disabled="recording"
              @click="exitConference"
              dark
              outlined
              rounded
            >
              Выйти
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row class="voice-border">
        <v-col md="4" lg="3" class="pa-0">
          <v-navigation-drawer
            permanent
            height="500px"
            width="100%"
            color="rgba(17,125,236,0.05)"
            class="drawer-border-right"
          >
            <template v-slot:prepend>
              <v-list-item>
                <v-list-item-content class="text-center">
                  <v-list-item-title>
                    <div class="font-weight-bold mb-1">
                      Обсуждение: {{ part.confName }}
                    </div>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-divider class="voice-divider"></v-divider>

            <v-list dense class="ml-n2">
              <v-list-item
                v-for="(item, index) in participants"
                :key="index"
                link
              >
                <!--                <v-list-item-icon class="mr-2" v-show="item.host">-->
                <!--                  <v-icon>mdi-account</v-icon>-->
                <!--                </v-list-item-icon>-->

                <v-list-item-content>
                  <div class="font-weight-bold px-5">
                    {{ item.name }}
                    <v-icon x-large color="green" v-show="item.isActive"
                      >mdi-circle-small</v-icon
                    >
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-col>
        <v-col md="8" lg="9" class="pa-0">
          <tiny-editor :editorText="editorText"></tiny-editor>
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
        Конференция: {{ part.confName }}
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
          <v-img width="80%" :src="require('../assets/signal.png')"></v-img>
        </v-col>
      </v-row>
      <v-row class="my-8">
        <v-col cols="12" class="voice-border pa-0">
          <v-sheet height="500px" class="adapt-editor">
            <tiny-editor
              class="adapt-editor x-small"
              :editorText="editorText"
            ></tiny-editor>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row class="mb-6">
        <v-col cols="12" class="voice-border pa-0">
          <v-navigation-drawer
            permanent
            height="200px"
            width="100%"
            v-model="individual"
            color="rgba(17,125,236,0.05)"
          >
            <template v-slot:prepend>
              <v-list-item>
                <v-list-item-content class="text-center">
                  <v-list-item-title>
                    <div class="font-weight-bold mb-1">
                      Обсуждение: {{ part.confName }}
                    </div>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-divider class="voice-divider"></v-divider>

            <v-list dense class="ml-n2">
              <v-list-item
                v-for="(item, index) in participants"
                :key="index"
                link
              >
                <v-list-item-content>
                  <div class="font-weight-bold px-5">
                    {{ item.name }}
                    <v-icon x-large color="green" v-show="item.isActive"
                      >mdi-circle-small</v-icon
                    >
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-col>
      </v-row>
      <div class="text-center">
        <v-btn
          class="text-h5 bold-button normalize px-10 primary-fill"
          style="width: 100%; height: 57px"
          dark
          outlined
          rounded
          @click="exitConference"
          :disabled="recording"
        >
          Выйти
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
import TinyEditor from "@/components/TinyEditor.vue";
import { mapState } from "vuex";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

export default {
  components: { TinyEditor },
  watch: {
    recording(val) {
      if (val) {
        this.startRecording();
      } else {
        this.stopRecording();
      }
    }
  },
  mounted() {
    this.intervalId = setInterval(() => {
      if (!this.recording) {
        this.sendEmptyChunks();
      }
    }, 2000);

    this.sentenceId = setInterval(() => {
      this.receiveSentences();
    }, 2000);
  },
  beforeDestroy() {
    clearInterval(this.sentenceId);
    clearInterval(this.intervalId);
    this.stopRecording();
    this.endUnsafely();
  },
  computed: {
    ...mapState({ part: "current_participant" }),
    ...mapState(["token"])
  },
  created() {},
  data() {
    return {
      sentenceId: null,
      intervalId: null,
      participants: [],
      individual: null,
      recording: false,
      partInfo: null,
      editorText: "",
      blobs: []
    };
  },
  methods: {
    receiveSentences() {
      this.$store
        .dispatch("receiveSentences", this.part.confId)
        .then((response) => {
          console.log("SENTENCES: ", response);
          this.renderResponse(response);
        });
    },
    endUnsafely() {
      this.$store.dispatch("exitConference", this.part.participantId);
    },
    exitConference() {
      this.$store
        .dispatch("exitConference", this.part.participantId)
        .then(() => {
          this.$router.push({ path: "/conference" });
        });
    },
    renderResponse(response) {
      this.editorText = "";
      if (response.sentences) {
        response.sentences.forEach((t) => {
          this.editorText +=
            "<p style='color:green'><b>" +
            t.participantName +
            ":</b> " +
            t.text +
            "</p>";
        });
      }
    },
    successCallback(stream) {
      const That = this;
      var options = {
        type: "audio",
        mimeType: "audio/wav",
        recorderType: StereoAudioRecorder,
        timeSlice: 500,
        desiredSampRate: 16000,
        bufferSize: 8192,
        numberOfAudioChannels: 1,
        ondataavailable: function (blob) {
          That.blobs.push(blob);

          let request = new XMLHttpRequest();
          request.onreadystatechange = function () {
            if (
              this.readyState === XMLHttpRequest.DONE &&
              this.status === 200
            ) {
              console.log(this.responseText);
              That.participants = JSON.parse(this.responseText).users;
            }
          };
          request.open(
            "POST",
            `https://summarytest.herokuapp.com/api/conference/chunk?conferenceId=${That.part.confId}&participantId=${That.part.participantId}`,
            true
          );
          request.setRequestHeader("Authorization", "Bearer " + That.token);
          request.send(blob);
        }
      };
      this.stream = stream;
      this.recordRTC = RecordRTC(stream, options);
      this.recordRTC.startRecording();
      let audio = this.$refs.audio;
      audio.src = URL.createObjectURL(stream);
    },
    processAudio(audioWebMURL) {
      let audio = this.$refs.audio;
      let recordRTC = this.recordRTC;
      audio.src = audioWebMURL;
      var recordedBlob = recordRTC.getBlob();
      console.log("processAudio: ", recordedBlob);
    },
    startRecording() {
      let mediaConstraints = {
        audio: true
      };
      navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then(this.successCallback.bind(this));
    },
    stopRecording() {
      let recordRTC = this.recordRTC;
      recordRTC.stopRecording(this.processAudio.bind(this));
      let stream = this.stream;
      stream.getAudioTracks().forEach((track) => track.stop());
    },
    sendEmptyChunks() {
      const That = this;
      const blob = [];
      let request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          console.log("Empty:", this.responseText);
          That.participants = JSON.parse(this.responseText).users;
        }
      };
      request.open(
        "GET",
        `https://summarytest.herokuapp.com/api/conference/activechat?conferenceId=${That.part.confId}&participantId=${That.part.participantId}`,
        true
      );
      request.setRequestHeader("Authorization", "Bearer " + this.token);
      request.send(blob);
    }
  }
};
</script>

<style></style>
