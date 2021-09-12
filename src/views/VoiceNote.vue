<template>
  <div>
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
          <v-btn class="pa-6" text icon color="orange">
            <v-icon large @click="addDialog = true"
              >mdi-note-plus-outline
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row class="voice-border">
        <v-col md="4" lg="3">
          <v-navigation-drawer permanent height="500px" color="transparent">
            <template v-slot:prepend>
              <v-list-item>
                <v-list-item-content class="text-center">
                  <v-list-item-title>Архив записей</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-divider></v-divider>

            <v-list dense light>
              <div class="py-2" v-for="item in archive_items" :key="item.id">
                <ArchiveNav
                  :item="item"
                  :activeId="activeId"
                  @saveEditedVoiceNote="saveEditedVoiceNote"
                  @openEditDialog="openEditDialog"
                  @openDeleteDialog="openDeleteDialog"
                  @setActiveNav="setActiveNav"
                />
              </div>
            </v-list>
          </v-navigation-drawer>
        </v-col>
        <v-col md="8" lg="9">
          <v-dialog v-model="addDialog" persistent max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span class="text-h5">Add Voice Note</span>
              </v-card-title>
              <v-card-text class="pb-0">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        class="rounded-lg"
                        label="Name"
                        v-model="new_voice_note"
                        outlined
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions class="px-9 pb-7">
                <v-btn
                  elevation="0"
                  dark
                  color="blue darken-1"
                  class="px-5"
                  rounded
                  @click="addVoiceNote"
                >
                  Yes
                </v-btn>

                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  rounded
                  text
                  @click="addDialog = false"
                >
                  No
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="editDialog" persistent max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span class="text-h5">Edit Voice Note</span>
              </v-card-title>
              <v-card-text class="pb-0">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        class="rounded-lg"
                        label="Name"
                        v-model="edit_voice_title"
                        outlined
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions class="px-9 pb-7">
                <v-btn
                  elevation="0"
                  dark
                  color="blue darken-1"
                  class="px-5"
                  rounded
                  @click="saveEditedVoiceNote"
                >
                  Yes
                </v-btn>

                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  rounded
                  text
                  @click="editDialog = false"
                >
                  No
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="deleteDialog" persistent max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span class="text-h5">Delete</span>
              </v-card-title>
              <v-card-text class="pb-0">
                <v-container>
                  Are you sure you want to delete
                  {{ deletingItem.title }}
                </v-container>
              </v-card-text>
              <v-card-actions class="px-9 pb-7">
                <v-btn
                  elevation="0"
                  dark
                  color="blue darken-1"
                  class="px-5"
                  rounded
                  @click="deleteConfirmed"
                >
                  Yes
                </v-btn>

                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  rounded
                  text
                  @click="deleteDialog = false"
                >
                  No
                </v-btn>
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
  mounted() {},
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
      new_voice_note: "",
      edit_voice_title: "",
      edit_voice_note: {
        title: "",
        id: "",
        text: "",
      },
      active_note: {
        title: "",
        id: "",
        text: "",
      },
      archive_items: [
        {
          title: "#803762003",
          id: "1",
          text: "1 ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
        {
          title: "#797518030",
          id: "2",
          text: "2 ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
        {
          title: "#752856189",
          id: "3",
          text: "3 ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
      ],
      editorText: "",
      blobs: [],
      generateId: 4,
      transcriptList: [],
      deleteDialog: false,
      addDialog: false,
      editDialog: false,
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
    },
    addVoiceNote() {
      //  TODO: Send request to the backend to receive Id

      this.archive_items.push({
        id: this.generateId,
        title: this.new_voice_note,
        text: "",
      });
      this.generateId += 1;
      this.addDialog = false;
      this.new_voice_note = "";
    },
    openEditDialog(item) {
      this.edit_voice_note = item;
      this.edit_voice_title = item.title;
      this.editDialog = true;
    },
    saveEditedVoiceNote() {
      const edited_title = this.edit_voice_title;
      this.edit_voice_note.title = edited_title;
      // const editedId = this.edit_voice_note.id;
      // const updatedTitle = this.edit_voice_note.title;

      //  TODO: Edit from the backend
      this.editDialog = false;
    },
    openDeleteDialog(item) {
      this.deletingItem = item;
      this.deleteDialog = true;
    },
    deleteConfirmed() {
      const deletingId = this.deletingItem.id;
      this.archive_items = this.archive_items.filter(
        (item) => item.id !== deletingId
      );
      //  TODO: Delete from the backend
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
      this.transcriptList.forEach((r) => {
        this.editorText += r.transcript;
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
