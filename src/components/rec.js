
// export default {
//   name: "AudioRecorder",
//   data() {
//     return {
//       recorder: null,
//       disabled: false,
//       audio: null,
//     };
//   },
//   mounted() {},
//   methods: {
//     async startRec() {
//       this.disabled = true;
//       let stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//       });
//       this.recorder = RecordRTC(stream, {
//         type: "audio",
//         recorderType: StereoAudioRecorder,
//         mimeType: "audio/wav",
//         timeSlice: 500,
//         desiredSampRate: 16000,
//         bufferSize: 8192,
//         numberOfAudioChannels: 1,
//         ondataavailable: function (blob) {
//           chunkCallback(blob);
//         },
//       });
//       this.recorder.startRecording();
//     },
//     async stopRec() {
//       this.disabled = false;
//       await this.recorder.stopRecording();
//       let blob = await this.recorder.getBlob();
//       blob.save("name");
//       this.recorder.save("audio.wav");
//     },
//     stopRecordingCallback() {
//       // ------------------------------------------------------------
//       // get access to StereoAudioRecorder object (name as "internal-recorder")
//       // ------------------------------------------------------------
//       let internalRecorder = this.recorder.getInternalRecorder();

//       // ------------------------------------------------------------
//       // create your own WAV
//       // ------------------------------------------------------------
//       internalRecorder.stop(function (buffer) {
//         // ------------------------------------------------------------
//         // here is your own WAV (generated by your own codes)
//         // ------------------------------------------------------------
//         let blob = new Blob([buffer], {
//           type: "audio/wav",
//         });
//         this.audio.srcObject = null;
//         this.audio.src = URL.createObjectURL(blob);
//       });

//       this.recorder.microphone.stop();
//     },
//   },
// };