<template>
  <div>
    <v-container class="py-10">
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
            <v-btn
              class="px-4 mr-3 primary-fill"
              dark
              outlined
              rounded
              @click="exportToPDF"
            >
              Получить расшифровку
            </v-btn>
            <v-btn
              @click="endConference"
              class="px-4 primary-fill"
              dark
              outlined
              rounded
            >
              Завершить конференцию
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
                      <v-list-item-title> № {{ confId }} </v-list-item-title>
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
                :disabled="true"
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
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import RecordRTC from "recordrtc";
import axios from "axios";
import { mapState } from "vuex";
import html2pdf from "html2pdf.js";

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
    ...mapState(["token"]),
  },
  data() {
    return {
      participants: null,
      individual: null,
      confId: null,

      recording: false,

      partInfo: null,
      audioModel: "",
      stream: null,
      recordRTC: null,
      blobs: [],
      editorText: "",
    };
  },
  methods: {
    endConference() {
      this.$store
        .dispatch("endConference", {
          conferenceId: this.confId,
        })
        .then(() => {
          this.$router.push({ path: "/conference" });
        });
    },
    startRecording() {
      this.recording = true;
      const This = this;
      const options = {
        type: "audio",
        // recorderType: StereoAudioRecorder,
        mimeType: "audio/wav",
        timeSlice: 2000,
        desiredSampRate: 16000,
        bufferSize: 8192,
        numberOfAudioChannels: 1,
        ondataavailable: (event) => {
          This.blobs.push(event.data);
          if (This.recordRTC.state == "inactive") {
            console.log(event);
            const blob = new Blob(This.blobs, { type: "audio/wav" });
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + this.token;
            axios
              .post(
                `/1/conference/chunk?conference_id=${this.confId}&participant_id=${this.part.id}`,
                blob
              )
              .then((res) => {
                console.log(res);
                This.editorText = `<p><strong>${this.part.name}:</strong></p>
<p>&nbsp;</p>`;
                This.editorText = This.editorText + res.data.transcripts;
              });
          }
        },
      };
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const recordRTC = new RecordRTC(stream, options);
        this.recordRTC = recordRTC;

        recordRTC.startRecording();
        recordRTC.microphone = stream;
      });
      // setTimeout(() => {
      //   const audioBlob = new Blob(this.blobs, { type: "audio/wav" });
      //   console.log("Recording In process: ", audioBlob);
      // this.$store.dispatch("sendChunkAudio", audioBlob).then(() => {
      //   this.blobs = []
      // });
      // }, 1000);
    },
    stopRecording() {
      this.recordRTC.stopRecording(() => {
        const audioBlob = new Blob(this.blobs, { type: "audio/wav" });
        console.log("Recording Stopped: ", audioBlob);

        axios
          .post(
            `/1/conference/chunk?conference_id=${this.confId}&participant_id=${this.part.id}`,
            audioBlob
          )
          .then((res) => {
            console.log(res);
            this.blobs = [];
          });
      });
      this.recordRTC.microphone.stop();
    },
    download() {
      this.recordRTC.save("audio.wav");
    },
    exportToPDF() {
      html2pdf(this.editorText, {
        margin: 1,
        filename: "conference.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { dpi: 192, letterRendering: true },
        jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
      });
    },
  },
  mounted() {
    const confId = this.$route.params.id;
    this.confId = confId;
    this.participants = this.$store.getters.participantsById(confId);
  },
};
</script>

<style>
</style>