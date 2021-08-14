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
            <v-btn
              class="px-4 primary-fill"
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
                        Обсуждение проекта : {{ confId }}
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
              <tiny-editor :editorText="editorText"></tiny-editor>
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
          <v-img width="80%" :src="require('../assets/signal.png')"></v-img>
        </v-col>
      </v-row>
      <v-row class="my-8">
        <v-col cols="12" class="voice-border">
          <v-sheet height="500px">
            <tiny-editor :editorText="editorText"></tiny-editor>
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
                  <v-list-item-title> Участники </v-list-item-title>
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
        <v-btn
          class="text-h5 bold-button normalize px-10 primary-fill"
          style="width: 100%; height: 57px"
          dark
          outlined
          rounded
        >
          <router-link to="/conference" class="reset-link"> Выйти </router-link>
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
  mounted() {
    const confId = this.$route.params.id;
    this.confId = confId;
    this.participants = this.$store.getters.participantsById(confId);
  },
  data() {
    return {
      participants: null,
      individual: null,
      confId: null,
      recording: false,
      partInfo: null,
      editorText: "",
      blobs: [],
    };
  },
  methods: {
    exitConference() {
      // this.download();
      this.$store.dispatch("exitConference", this.part.id).then(() => {
        this.$router.push({ path: "/conference" });
      });
    },
    renderResponse(response) {
      let finalTranscriptList = [];
      let interimTranscriptMap = {};
      response.transcripts.forEach((t) => {
        if (t.isFinal) {
          finalTranscriptList.push(t);
          delete interimTranscriptMap[t.participantId];
        } else {
          interimTranscriptMap[t.participantId] = t;
        }
      });
      if (finalTranscriptList.length > 10) {
        finalTranscriptList.splice(0, finalTranscriptList.length - 10);
      }

      finalTranscriptList.forEach((t) => {
        this.editorText +=
          "<p style='color:green'><b>" +
          t.participantName +
          ":</b> " +
          t.value +
          "</p>";
      });

      for (var participantId in interimTranscriptMap) {
        var t = interimTranscriptMap[participantId];
        this.editorText +=
          "<p style='color:red'><b>" +
          t.participantName +
          ":</b> " +
          t.value +
          "</p>";
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
              That.renderResponse(JSON.parse(this.responseText));
            }
          };
          request.open(
            "POST",
            `https://dpforge.com/1/conference/chunk?conference_id=${That.confId}&participant_id=${That.part.id}`,
            true
          );
          request.setRequestHeader("Authorization", "Bearer " + That.token);
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
    // download() {
    //   this.recordRTC ? this.recordRTC.save("audio.wav") : null;
    // },
  },
};
</script>

<style>
</style>