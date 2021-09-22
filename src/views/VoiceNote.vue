<template>
  <div id="voice-note">
    <v-container class="py-10 mhide">
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between">
          <v-icon
            :disabled="activeId === null"
            dark
            class="orange pa-3 rounded-xl"
            @click="recording = !recording"
          >
            {{ recording ? "mdi-stop" : "mdi-microphone-outline" }}
          </v-icon>
          <audio ref="audio"></audio>
          <v-spacer></v-spacer>
        </v-col>
      </v-row>

      <v-row class="voice-border">
        <v-col md="4" lg="3">
          <v-navigation-drawer permanent height="500px" color="transparent">
            <template v-slot:prepend>
              <div>
                <div class="text-center" style="position: relative">
                  <div class="text-h6 mb-3 pt-2">Мои записи</div>

                  <v-btn
                    right
                    class="pa-6 do-relative"
                    text
                    icon
                    color="#14396A"
                  >
                    <v-icon large @click="addBlockNote"> mdi-plus</v-icon>
                  </v-btn>
                </div>
              </div>
            </template>

            <v-divider></v-divider>

            <v-list dense light>
              <div class="py-2" v-for="item in archive_items" :key="item.id">
                <ArchiveNav
                  :item="item"
                  :activeId="activeId"
                  @saveEditedVoiceNoteName="saveEditedVoiceNoteName"
                  @openDeleteDialog="openDeleteDialog"
                  @setActiveNav="setActiveNav"
                />
              </div>
            </v-list>
          </v-navigation-drawer>
        </v-col>
        <v-col md="8" lg="9">
          <v-dialog v-model="deleteDialog" persistent max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span class="text-h5">Данные будут удалены. Продолжить?</span>
              </v-card-title>
              <v-card-actions class="px-9 pb-7 justify-center">
                <div>
                  <v-btn
                    width="140px"
                    height="45px"
                    elevation="0"
                    class="rounded-lg mr-3"
                    color="#C8CFD9"
                    @click="deleteDialog = false"
                  >
                    Отмена
                  </v-btn>
                  <v-btn
                    width="140px"
                    height="45px"
                    elevation="0"
                    class="rounded-lg ml-3"
                    color="#BDD0FB"
                    @click="deleteConfirmed"
                  >
                    Да
                  </v-btn>
                </div>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
          <v-icon
            :disabled="activeId !== null"
            dark
            class="orange pa-3 mr-5 rounded-xl"
            @click="recording = !recording"
          >
            {{ recording ? "mdi-stop" : "mdi-microphone-outline" }}
          </v-icon>
          <v-img width="80%" :src="require('../assets/signal.png')"></v-img>
        </v-col>
        <v-col cols="12" class="voice-border my-8">
          <v-sheet height="500px">
            <tiny-editor :editorText="editorText"></tiny-editor>
          </v-sheet>
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
                  <v-list-item-title>Архив записей</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-divider></v-divider>

            <v-list dense>
              <v-list-item v-for="item in archive_items" :key="item.title" link>
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
import ArchiveNav from "@/components/ArchiveNav.vue";

export default {
  components: { ArchiveNav, TinyEditor },
  mounted() {
    this.$store.dispatch("fetchArchives").then((response) => {
      this.archive_items = response;
    });
  },
  computed: {
    ...mapState({ part: "current_participant" }),
    ...mapState(["token"]),
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
      activeId: null,
      speechId: "",
      archive_items: [],
      editorText: "",
      blobs: [],
      transcriptList: [],
      deleteDialog: false,
      deletingItem: {
        title: "",
        id: "",
        text: "",
      },
    };
  },
  methods: {
    setActiveNav(item) {
      this.activeId = item.id;
      this.editorText = item.text;
      this.transcriptList = [
        {
          confidence: 1,
          isFinal: true,
          transcript: item.text,
          done: true,
        },
      ];
    },
    addBlockNote() {
      let defaultTitle = "Запись";
      const count = this.archive_items.filter(
        (x) => x.title.indexOf(defaultTitle) !== -1
      ).length;
      if (count !== 0) {
        defaultTitle += count;
      }
      this.$store.dispatch("createBlockNote", defaultTitle).then((response) => {
        this.archive_items.push({
          id: response.speechpadId,
          title: response.speechPadName,
          text: "",
        });
      });
    },
    saveEditedVoiceNoteName(item) {
      const edited_title = item.title;
      console.log(edited_title);
      //  TODO: Edit from the backend
      this.$store.dispatch("saveModifiedBlockNoteName", item);
    },
    openDeleteDialog(item) {
      this.deletingItem = item;
      this.deleteDialog = true;
    },
    deleteConfirmed() {
      const deletingId = this.deletingItem.id;
      this.$store.dispatch("deleteBlockNote", deletingId).then(() => {
        this.archive_items = this.archive_items.filter(
          (item) => item.id !== deletingId
        );
      });
      this.deleteDialog = false;
    },
    renderResponse(response) {
      response.results.forEach((r) => {
        const len = this.transcriptList.length;
        let modify = false;
        for (let i = 0; i < len; i++) {
          if (!this.transcriptList[i].isFinal) {
            this.transcriptList[i] = r;
            modify = true;
          }
        }
        if (!modify) {
          this.transcriptList.push(r);
        }
      });
      this.displayResult();
    },
    displayResult() {
      this.editorText = "";
      this.transcriptList.forEach((r) => {
        if (r.isFinal) {
          this.editorText += r.transcript;
        } else {
          this.editorText +=
            "<span style='color:green'>" + r.transcript + "</span>";
        }
      });
    },
    successCallback(stream) {
      const That = this;
      let options = {
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
      let recordedBlob = recordRTC.getBlob();
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

      // const data = {
      //   id: this.activeId,
      //   text: this.editorText,
      // };
      // this.$store.dispatch("saveModifiedBlockNote", data);
    },
  },
};
</script>

<style>
.voice-border {
  border: 1px solid #e0e0e0;
  border-radius: 15px;
}

.do-relative {
  position: absolute;
  right: 0;
  top: 0;
}

.v-dialog {
  position: absolute;
  top: 250px;
}
</style>
