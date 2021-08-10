<template>
  <div class="audioRec text-xs-center">
    <div class="audio-controllers"></div>
    <v-btn @click="startRecording()"><v-icon>mdi-play</v-icon></v-btn>
    <v-btn @click="stopRecording()"><v-icon>mdi-pause</v-icon></v-btn>
    <v-btn @click="download()"><v-icon>mdi-download</v-icon></v-btn>
  </div>
</template>

<script>
import RecordRTC from "recordrtc";

export default {
  name: "AudioRecorder",
  props: [""],
  data: function () {
    return {
      audioModel: "",
      stream: null,
      recordRTC: null,
      blobs: [],
    };
  },
  methods: {
    startRecording() {
      const options = {
        mimeType: "audio/wav;codecs=vp9",
        audioBitsPerSecond: 128000,
        timeSlice: 2000,
        bitsPerSecond: 128000,
      };
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        this.recordRTC = new RecordRTC(stream, options);
        this.recordRTC.ondataavailable = (e) => {
          this.blobs.push(e.data);
          if (this.recordRTC.state == "inactive") {
            let blob = new Blob(this.blobs, { type: "audio/wav" });
            let audio = this.$refs.audio;
            audio.src = URL.createObjectURL(blob);
            console.log(URL.createObjectURL(blob));
            console.log("BLOBBB");
          }
        };
        this.recordRTC.startRecording();
      });
    },
    stopRecording() {
      this.recordRTC.stopRecording((blob) => {
        // audio.src = window.URL.createObjectURL(blob);
        console.log("DoneB", blob);
      });
    },
    download() {
      this.recordRTC.save("audio.wav");
    },
  },
};
</script>

<style scoped>
</style>
