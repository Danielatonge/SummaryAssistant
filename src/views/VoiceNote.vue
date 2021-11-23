<template>
  <div id="voice-note">
    <v-container class="py-10 mhide px-4">
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between px-0">
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
          <div class="d-block d-sm-flex">
            <v-btn
              class="px-4 primary-fill font-weight-bold"
              :disabled="recording || !activeId"
              dark
              large
              outlined
              rounded
              @click="getTranscription"
            >
              Получить расшифровку
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
            :class="{ disableNavDrawer: recording }"
          >
            <template v-slot:prepend>
              <div>
                <div class="text-center" style="position: relative">
                  <div class="text-h6 mb-2 pt-2">Мои записи</div>

                  <v-btn
                    right
                    class="pa-6 do-relative"
                    text
                    icon
                    color="#14396A"
                  >
                    <v-icon large @click="addNote"> mdi-plus</v-icon>
                  </v-btn>
                </div>
              </div>
            </template>

            <v-divider class="voice-divider"></v-divider>

            <v-list dense light>
              <div v-for="item in items" :key="item.noteId">
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
        <v-col md="8" lg="9" class="pa-0">
          <v-dialog v-model="deleteDialog" persistent max-width="450px">
            <v-card color="#F5F5F5">
              <v-card-title class="justify-center text-center">
                <span class="text-h6 font-weight-bold">
                  Данные будут удалены.<br />
                  Продолжить?</span
                >
              </v-card-title>
              <v-card-actions class="px-9 pb-7 justify-center">
                <div>
                  <v-btn
                    width="140px"
                    height="45px"
                    elevation="0"
                    class="rounded-lg mr-3 text-h6"
                    color="#C8CFD9"
                    @click="deleteDialog = false"
                  >
                    Отмена
                  </v-btn>
                  <v-btn
                    width="140px"
                    height="45px"
                    elevation="0"
                    class="rounded-lg ml-3 text-h6"
                    color="#BDD0FB"
                    @click="deleteNote"
                  >
                    Да
                  </v-btn>
                </div>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <tiny-editor
            class="adapt-editor"
            :editorText="editorText"
            @input="
              (value) => {
                editorText = value;
              }
            "
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
            <tiny-editor
              :editorText="editorText"
              @input="
                (value) => {
                  editorText = value;
                }
              "
            ></tiny-editor>
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
              <v-list-item v-for="item in items" :key="item.noteId" link>
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
    {{ editorText }}
  </div>
</template>

<script>
import TinyEditor from "@/components/TinyEditor.vue";
import { mapState } from "vuex";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import ArchiveNav from "@/components/ArchiveNav.vue";

let pdfMake = require("pdfmake/build/pdfmake.js");
let pdfFonts = require("pdfmake/build/vfs_fonts.js");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  components: { ArchiveNav, TinyEditor },
  mounted() {
    this.getAllNotes();
  },
  computed: {
    ...mapState({ part: "current_participant" }),
    ...mapState(["token", "userId"])
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
  data() {
    return {
      recording: false,
      activeId: null,
      speechId: "",
      items: [],
      editorText: "",
      blobs: [],
      transcriptList: [],
      deleteDialog: false,
      deletingItem: {},
      note: null,
      noteTitle: ""
    };
  },
  methods: {
    setActiveNav(item) {
      this.activeId = item.noteId;
      this.note = item;

      this.transcriptList = [
        {
          confidence: 1,
          isFinal: true,
          transcript: item.text,
          done: true
        }
      ];
      console.log("ARCHIVE", item.text);
      this.displayResult();
    },
    addBlockNote() {
      let defaultTitle = "Новаязапись";
      let maxNum = 0;
      const x = this.items;
      const len = x.length;
      for (let i = 0; i < len; i++) {
        const name = x[i].speechpadName.replace(/\s+/g, "");
        if (name.indexOf(defaultTitle) !== -1) {
          const count = parseInt(name.slice(-1));
          if (count > maxNum) {
            maxNum = count;
          }
        }
      }
      let title = `Новая запись ${maxNum + 1}`;
      console.log(title);
      const note = {
        text: "",
        title: defaultTitle
      };
      this.$store.dispatch("createBlockNote", note).then(() => {
        this.items.push(note);
      });
    },
    saveEditedVoiceNoteName(item) {
      console.log(item);
      this.$store.dispatch("saveModifiedBlockNoteName", item);
    },
    openDeleteDialog(item) {
      console.log(item);
      this.deletingItem = item;
      this.deleteDialog = true;
    },
    deleteConfirmed() {
      const deletingId = this.deletingItem.speechpadId;
      this.$store.dispatch("deleteBlockNote", deletingId).then(() => {
        this.items = this.items.filter(
          (item) => item.speechpadId !== deletingId
        );
      });
      this.editorText = "";
      this.deleteDialog = false;
    },
    getTranscription() {
      const title = this.note.title;
      const text = this.note.text.replace("<br>", "\n");
      let content = [`Speech Pad: ${title}`];

      // const len = data.transcribeResult.length;
      // for (let i = 0; i < len; i++) {
      //   content.push(data.transcribeResult[i].transcript);
      // }

      content.push(text);

      console.log(content);
      const docDefinition = {
        content: content
      };
      pdfMake.createPdf(docDefinition).download(`Транскрипция_${title}.pdf`);
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

          request.open(
            "POST",
            `https://summarytest.herokuapp.com/api/voice/chunk?id=${That.speechId}`,
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
      let recordedBlob = recordRTC.getBlob();
      console.log("processAudio: ", recordedBlob);
    },
    startRecording() {
      this.$store.dispatch("createSpeechPad").then((response) => {
        console.log("SpeechId: ", response);
        this.speechId = response;

        this.editorText = this.note.text;
        let mediaConstraints = {
          audio: true
        };
        navigator.mediaDevices
          .getUserMedia(mediaConstraints)
          .then(this.successCallback.bind(this));
      });
    },
    stopRecording() {
      let recordRTC = this.recordRTC;
      recordRTC.stopRecording(this.processAudio.bind(this));
      let stream = this.stream;
      stream.getAudioTracks().forEach((track) => track.stop());
      this.$store
        .dispatch("deleteVoiceNote", this.speechId)
        .then((response) => {
          console.log("DELETED VOICE NOTE: ", response);
        });
      this.note.text = this.editorText;
      this.$store.dispatch("saveNote", this.note).then((response) => {
        console.log("UPDATED NOTE: ", response);
      });
    },
    addNote() {
      let defaultTitle = "Новаязапись";
      let maxNum = 0;
      const x = this.items;
      const len = x.length;
      for (let i = 0; i < len; i++) {
        const name = x[i].title.replace(/\s+/g, "");
        if (name.indexOf(defaultTitle) !== -1) {
          const count = parseInt(name.slice(-1));
          if (count > maxNum) {
            maxNum = count;
          }
        }
      }
      let title = `Новая запись ${maxNum + 1}`;

      this.$store.dispatch("createNote", title).then((response) => {
        console.log("NEW NOTE: ", response);
        this.items.push(response.note);
      });
    },
    deleteNote() {
      console.log(this.note);
      this.$store.dispatch("deleteNote", this.deletingItem.noteId).then(() => {
        this.getAllNotes();
        this.editorText = "";
        this.deleteDialog = false;
      });
    },
    saveNote() {
      this.note.text = this.editorText;
      this.$store.dispatch("saveNote", this.note).then((response) => {
        console.log("SAVED NOTE: ", response);
        this.$store.dispatch("clearSpeechPad", this.speechId).then(() => {
          this.$store.dispatch("createSpeechPad").then((response) => {
            console.log("SpeechId: ", response);
            this.speechId = response;
          });
        });
      });
    },
    swapNote(item) {
      this.transcriptText = "";
      console.log("SWAPPING SPEECH ID ", this.speechId);
      if (this.speechId !== "" && this.speechId !== null) {
        this.$store
          .dispatch("deleteVoiceNote", this.speechId)
          .then((response) => {
            console.log("DELETED VOICE NOTE: ", response);
          });
      }
      this.$store.dispatch("createSpeechPad").then((response) => {
        console.log("SpeechId: ", response);
        this.speechId = response;
      });
      this.note = item;
      this.editorText = item.text;
    },
    getAllNotes() {
      this.$store.dispatch("getAllNotes").then((response) => {
        console.log("Loaded notes: ", response);
        this.items = response;
      });
    }
  }
};
</script>

<style>
.voice-border {
  border: 5px solid rgba(20, 57, 106, 1);
  border-radius: 15px;
}

.voice-divider {
  background-color: rgba(20, 57, 106, 1);
  border-width: 2px;
  border-color: rgba(20, 57, 106, 1);
}

.adapt-editor {
  border-radius: 15px !important;
  height: 100%;
}

.tox.tox-tinymce {
  border-radius: 0 15px 15px 0 !important;
}

.do-relative {
  position: absolute;
  right: 0;
  top: 0;
}

.drawer-border-right {
  border-right: 5px solid rgba(20, 57, 106, 1) !important;
}

.v-dialog {
  position: absolute;
  top: 250px;
}

.disableNavDrawer {
  pointer-events: none;
}
</style>
