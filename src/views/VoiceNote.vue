<template>
  <div>
    <v-container class="py-10 mhide">
      <v-row>
        <v-col cols="12">
          <v-icon
            dark
            class="orange pa-3 rounded-xl"
            @click="recording = !recording"
          >
            {{ recording ? "mdi-stop" : "mdi-microphone-outline" }}
          </v-icon>
          <audio ref="audio"></audio>
        </v-col>
      </v-row>

      <v-row class="voice-border">
        <v-col md="4" lg="2">
          <v-navigation-drawer permanent height="500px" color="transparent">
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
        <v-col md="8" lg="10">
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
      <v-row>
        <v-col cols="12" class="d-flex">
          <v-icon dark class="orange pa-3 mr-5 rounded-xl">
            mdi-microphone-outline
          </v-icon>
          <v-img width="80%" :src="require('../assets/signal.png')"></v-img>
        </v-col>
        <v-col cols="12" class="voice-border my-8">
          <v-sheet height="500px">
            <tiny-editor :text="editorText"></tiny-editor>
          </v-sheet>
        </v-col>
        <v-col cols="12" class="voice-border">
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
import { mapState } from "vuex";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

export default {
  components: { TinyEditor },
  mounted() {},
  computed: {
    ...mapState({ part: "current_participant" }),
    ...mapState(["archives", "token"]),
  },
  watch: {
    recording(val) {
      if (val) {
        this.startRecording();
      } else {
        this.stopRecording();
      }
    },
  },
  data() {
    return {
      recording: false,
      speechId: "",
      items: [
        { title: "#803762003" },
        { title: "#797518030" },
        { title: "#752856189" },
      ],
      editorText: "",
      blobs: [],
    };
  },
  methods: {
    renderResponse(response) {
      let finalText = "";
      response.results.forEach((r) => {
        if (r.isFinal) {
          finalText += " " + r.transcript;
          this.editorText = finalText;
        } else {
          this.editorText = finalText + " <" + r.transcript + ">";
        }
      });
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
              That.renderResponse(JSON.parse(this.responseText));
            }
          };
          // https://cors-anywhere.herokuapp.com/
          request.open(
            "POST",
            `https://dpforge.com/1/speechpad/chunk?speechpad_id=${That.speechId}`,
            true
          );
          request.setRequestHeader("Authorization", "Bearer " + That.token);
          request.send(blob);
        },
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
      this.$store.dispatch("createSpeechPad").then((response) => {
        console.log("SpeechId: ", response);
        this.speechId = response;
      });
      let mediaConstraints = {
        audio: true,
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
    download() {
      this.recordRTC.save("audio.wav");
    },
    addToArchive() {
      this.$store.dispatch("addToArchive", this.editorText);
    },
  },
};
</script>

<style>
.voice-border {
  border: 1px solid #e0e0e0;
  border-radius: 15px;
}
</style>