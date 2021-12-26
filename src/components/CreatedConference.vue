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
          <audio ref="audio"></audio>
          <v-spacer></v-spacer>
          <div class="d-block d-sm-flex">
            <v-btn
              @click="endConference"
              class="px-4 primary-fill font-weight-bold"
              dark
              :disabled="recording"
              outlined
              rounded
            >
              Завершить конференцию
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
                      {{ conferenceInfo.confName.toUpperCase() }}
                    </div>
                    <div>Код приглашения: {{ conferenceInfo.inviteCode }}</div>
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
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-col>
        <v-col md="8" lg="9" class="pa-0">
          <tiny-editor
            class="adapt-editor"
            :editorText="editorText"
          ></tiny-editor>
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
        Конференция № {{ conferenceInfo.confId }}
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
          <audio ref="audio"></audio>
          <v-img width="80%" :src="require('../assets/signal.png')"></v-img>
        </v-col>
        <v-col cols="12">
          <tiny-editor :editorText="editorText"></tiny-editor>
        </v-col>
        <v-col cols="12" class="voice-border">
          <v-navigation-drawer
            permanent
            width="100%"
            height="200px"
            color="transparent"
          >
            <template v-slot:prepend>
              <v-list-item>
                <v-list-item-content class="text-center">
                  <v-list-item-title>
                    <div class="font-weight-bold mb-1">
                      {{ confName.toUpperCase() }}
                    </div>
                    <div>№ {{ conferenceInfo.confId }}</div>
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
                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-col>
      </v-row>
      <v-row class="mt-10 d-flex justify-center">
        <v-btn
          width="250px"
          height="50px"
          class="bold-button text-wrap mb-3 mr-2 primary-fill"
          dark
          outlined
          rounded
          @click="getTranscription"
        >
          Получить расшифровку
        </v-btn>
        <v-btn
          width="250px"
          height="50px"
          @click="endConference"
          class="bold-button orange text-wrap"
          dark
          outlined
          rounded
        >
          Завершить конференцию
        </v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TinyEditor from "@/components/TinyEditor.vue";
import { mapState } from "vuex";
import download from "downloadjs";
// import axios from "axios";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

export default {
  components: { TinyEditor },
  created() {
    console.log(this.part.participantId);
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
  watch: {
    recording(val) {
      if (val) {
        this.startRecording();
      } else {
        this.stopRecording();
      }
    }
  },
  computed: {
    ...mapState({ part: "current_participant" }),
    ...mapState(["token", "conferenceInfo"])
  },
  data() {
    return {
      sentenceId: null,
      intervalId: null,
      participants: [],
      confName: "",
      recording: false,
      editorText: "",
      blobs: []
    };
  },
  methods: {
    receiveSentences() {
      this.$store
        .dispatch("receiveSentences", this.conferenceInfo.confId)
        .then((response) => {
          console.log("SENTENCES: ", response);
          this.renderResponse(response);
        });
    },
    endUnsafely() {
      this.$store.dispatch("endConference", this.conferenceInfo.confId);
    },
    endConference() {
      this.$store
        .dispatch("endConference", this.conferenceInfo.confId)
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
              console.log("CHUNK:", this.responseText);
              That.participants = JSON.parse(this.responseText).users;
            }
          };
          request.open(
            "POST",
            `https://summarytest.herokuapp.com/api/conference/chunk?conferenceId=${That.conferenceInfo.confId}&participantId=${That.part.participantId}`,
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
    errorCallback() {
      //handle error here
    },
    processAudio(audioWebMURL) {
      let audio = this.$refs.audio;
      let recordRTC = this.recordRTC;
      audio.src = audioWebMURL;
      var recordedBlob = recordRTC.getBlob();
      console.log("processAudio: ", recordedBlob);
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
        `https://summarytest.herokuapp.com/api/conference/activechat?conferenceId=${That.conferenceInfo.confId}&participantId=${That.part.participantId}`,
        true
      );
      request.setRequestHeader("Authorization", "Bearer " + this.token);
      request.send(blob);
    },
    startRecording() {
      this.recording = true;
      let mediaConstraints = {
        audio: true
      };
      navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then(this.successCallback.bind(this), this.errorCallback.bind(this));
    },
    stopRecording() {
      this.recording = false;
      let recordRTC = this.recordRTC;
      recordRTC.stopRecording(this.processAudio.bind(this));
      let stream = this.stream;
      stream.getAudioTracks().forEach((track) => track.stop());
    },
    getTranscription() {
      this.$store
        .dispatch("getTranscription", this.conferenceInfo.confId)
        .then((response) => {
          const content = response.headers["content-type"];
          download(response.data, "Transcription Voice Note", content);
        });
    }
  }
};
</script>

<style scoped>
.v-btn__content {
  width: 100% !important;
  white-space: normal !important;
}
</style>
