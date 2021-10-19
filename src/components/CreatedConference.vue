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
            <!--            <v-btn-->
            <!--              class="px-4 mr-3 primary-fill"-->
            <!--              :disabled="recording"-->
            <!--              dark-->
            <!--              outlined-->
            <!--              rounded-->
            <!--              @click="getTranscription"-->
            <!--            >-->
            <!--              Получить расшифровку-->
            <!--            </v-btn>-->
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
                      {{ confName.toUpperCase() }}
                    </div>
                    <div>№ {{ confId }}</div>
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
                <!-- <v-list-item-icon class="mr-2" v-show="item.host">
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon> -->

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
        Конференция № {{ confId }}
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
                    <div>№ {{ confId }}</div>
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
                <!-- <v-list-item-icon class="mr-2" v-show="item.host">
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon> -->

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
import { jsPDF } from "jspdf";
// import axios from "axios";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

export default {
  components: { TinyEditor },
  created() {
    const confId = this.$route.params.id;
    console.log(this.part.id);
    this.confId = confId;
    this.confName = this.$store.getters.confName(confId);
  },
  mounted() {
    this.intervalId = setInterval(() => {
      if (!this.recording) {
        this.sendEmptyChunks();
      }
    }, 2000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
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
  computed: {
    ...mapState({ part: "current_participant" }),
    ...mapState(["token"]),
  },
  data() {
    return {
      intervalId: null,
      participants: [],
      confId: "",
      confName: "",
      recording: false,
      editorText: "",
      blobs: [],
      transcriptList: [],
    };
  },
  methods: {
    endConference() {
      // this.download();
      this.$store.dispatch("endConference", this.confId).then(() => {
        this.$router.push({ path: "/conference" });
      });
    },
    renderResponse(response) {
      this.participants = response.participants;
      response.transcripts.forEach((t) => {
        const len = this.transcriptList.length;
        let modify = false;
        for (let i = 0; i < len; i++) {
          if (!this.transcriptList[i].isFinal) {
            this.transcriptList[i] = t;
            modify = true;
          }
        }
        if (!modify) {
          this.transcriptList.push(t);
        }
      });

      this.displayResult();
    },
    displayResult() {
      this.editorText = "";
      this.transcriptList.forEach((t) => {
        if (t.isFinal) {
          this.editorText +=
            "<p style='color:green'><b>" +
            t.participantName +
            ":</b> " +
            t.value +
            "</p>";
        } else {
          this.editorText +=
            "<p style='color:red'><b>" +
            t.participantName +
            ":</b> " +
            t.value +
            "</p>";
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
          request.open(
            "POST",
            `https://speech-to-text-demo-zint7cdqua-uc.a.run.app/1/conference/chunk?conference_id=${That.confId}&include_participants=True`,
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
          That.renderResponse(JSON.parse(this.responseText));
        }
      };
      request.open(
        "POST",
        `https://speech-to-text-demo-zint7cdqua-uc.a.run.app/1/conference/chunk?conference_id=${this.confId}&include_participants=True`,
        true
      );
      request.setRequestHeader("Authorization", "Bearer " + this.token);
      request.send(blob);
    },
    startRecording() {
      this.recording = true;
      let mediaConstraints = {
        audio: true,
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
    // download() {
    //   this.recordRTC ? this.recordRTC.save("audio.wav"): null;
    // },
    getTranscription() {
      this.$store.dispatch("getTranscription", this.confId).then((data) => {
        let doc = jsPDF();
        doc.text(10, 10, data);
        doc.save(`Transcription_.pdf`);

        console.log(JSON.stringify(data, null, 2));

        // const format = {
        //   conferenceName: "2243",
        //   entries: [
        //     {
        //       participantName: "Thes",
        //       text: "я",
        //     },
        //   ],
        //   success: true,
        //   text: "2243\nThes: я\n",
        // };
      });
    },
  },
};
</script>

<style scoped>
.v-btn__content {
  width: 100% !important;
  white-space: normal !important;
}
</style>
