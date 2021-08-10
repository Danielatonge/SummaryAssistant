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
          <audio ref="audio"></audio>
          <v-spacer></v-spacer>
          <div class="d-block d-sm-flex">
            <v-btn class="px-4 mr-3 primary-fill" dark outlined rounded>
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
import { mapState } from "vuex";
// import axios from "axios";
const RecordRTC = require("recordrtc");

export default {
  components: { Editor },
  mounted() {
    const confId = this.$route.params.id;
    console.log(this.part.id);
    this.confId = confId;
    this.participants = this.$store.getters.participantsById(confId);
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
      participants: null,
      individual: null,
      confId: "",
      recording: false,
      partInfo: null,
      editorText: "",
      blobs: [],
    };
  },
  methods: {
    endConference() {
      this.download();
      this.$store
        .dispatch("endConference", {
          conferenceId: this.confId,
        })
        .then(() => {
          this.$router.push({ path: "/conference" });
        });
    },
    successCallback(stream) {
      const That = this;
      var options = {
        mimeType: "audio/wav;codecs=vp9",
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 128000,
        timeSlice: 500,
        bitsPerSecond: 128000,
        ondataavailable: function (blob) {
          That.blobs.push(blob);
          // let fBlob = new Blob(That.blobs);
          // console.log(blob, That.recordRTC.state);

          let request = new XMLHttpRequest();
          request.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                That.editorText += JSON.parse(this.responseText);
            }
        }
          request.open(
            "POST",
            `https://dpforge.com/1/conference/chunk?conference_id=${That.confId}&participant_id=${That.part.id}`,
            true
          );
          request.setRequestHeader(
            "Authorization",
            "Bearer " + localStorage.getItem("access-token")
          );
          request.send(blob);

          // const config = {
          //   headers: {
          //     "content-type": blob.type,
          //   },
          // };

          // const objectURL = URL.createObjectURL(fBlob);
          // console.log(objectURL);
          // axios.defaults.headers.common["Authorization"] =
          //   "Bearer " + That.token;
          // axios
          //   .post(
          //     `/1/conference/chunk?conference_id=${That.confId}&participant_id=${That.part.id}`,
          //     objectURL,
          //     config
          //   )
          //   .then((res) => {
          //     console.log(res);
          //     That.editorText +=
          //       `<strong>${That.part.name}:</strong>` +
          //       JSON.stringify(res.data);
          //   });
        },
      };
      this.stream = stream;
      this.recordRTC = RecordRTC(stream, options);
      this.recordRTC.startRecording();
      let audio = this.$refs.audio;
      audio.src = window.URL.createObjectURL(stream);
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
    startRecording() {
      let mediaConstraints = {
        audio: true,
      };
      navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then(this.successCallback.bind(this), this.errorCallback.bind(this));
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
  },
};
</script>

<style>
</style>