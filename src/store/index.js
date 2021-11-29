import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VuexPersistence from "vuex-persist";
//  https://speech-to-text-demo-4k67a4hqaa-uc.a.run.app/
//  https://dpforge.com
// https://summarytest.herokuapp.com/swagger-ui.html
Vue.use(Vuex);
axios.defaults.baseURL = "https://summarytest.herokuapp.com";
let settings = {
  play_pause: "ALT + G",
  previous_period: "P",
  next_period: "ALT + M",
  decrease_speed: "G",
  increase_speed: "SHIFT + G",
  restart: "F12",
  add_label: "A",
  copy: "H"
};

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

export default new Vuex.Store({
  state: {
    username: "",
    userId: "",
    token: null,
    conferenceInfo: [],
    settings: settings || null,
    record: null,
    gumStream: null,
    decode_upload: null,
    participants: [],
    current_participant: null,
    archives: [],
    decoded_sample: null,
    file: null
  },
  getters: {
    loggedIn(state) {
      return state.token !== null;
    },
    participantsById: (state) => (id) => {
      return state.participants.filter((x) => x.confId === id);
    },
    hostName(state) {
      return state.conferenceInfo ? state.conferenceInfo.hostName : null;
    },
    confName: (state) => (confId) => {
      if (state.conferenceInfo.length) {
        const conf = state.conferenceInfo.filter((x) => x.confId === confId);
        return conf[0].confName;
      }
      return null;
    },
    settings(state) {
      return state.settings;
    },
    participants(state) {
      return state.participants;
    },
    token(state) {
      return state.token;
    },
    archives(state) {
      return state.archives;
    },
    transcribeId(state) {
      return state.decode_upload.transcribeId;
    },
    decodedSample(state) {
      return state.decoded_sample;
    }
  },
  mutations: {
    retrieveToken(state, { token, username, id }) {
      state.token = token;
      state.username = username;
      state.userId = id;
    },
    saveFile(state, file) {
      state.file = file;
    },
    destroyToken(state) {
      state.token = null;
      state.username = "";
      state.userId = "";
      state.conferenceInfo = [];
      state.record = null;
      state.gumStream = null;
      state.decode_upload = null;
      state.participants = [];
      state.current_participant = null;
      state.archives = [];
      state.decoded_sample = null;
    },
    setConferenceInfo(state, data) {
      console.log(data);
      state.conferenceInfo.push(data);
    },
    setSettings(state, data) {
      state.settings = data;
    },
    destroyConferenceInfo(state, confId) {
      const confInfo = state.conferenceInfo.filter((x) => x.confId !== confId);
      const parts = state.participants.filter((x) => x.confId !== confId);

      state.conferenceInfo = confInfo;
      state.participants = parts;
    },
    destroyParticipantInfo(state, partId) {
      state.participants = state.participants.filter((x) => x.id !== partId);
    },
    saveUploadInfo(state, uploadInfo) {
      state.decode_upload = uploadInfo;
    },
    addParticipant(state, payload) {
      console.log("Add Participant");
      state.participants.push(payload);
    },
    setCurrentParticipant(state, part) {
      state.current_participant = part;
    },
    saveDecodeTranscript(state, payload) {
      state.decoded_sample = payload;
    },
    addArchive(state, payload) {
      state.archives.push(payload);
    },
    saveParticipants(state, parts) {
      state.participants = parts;
    },
    SET_ARCHIVE_ITEMS(state, payload) {
      state.archives = payload;
    }
  },
  actions: {
    modifySettings(context, param) {
      const key = param.key;
      const option = param.description;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      axios
        .post(`/1/user/settings/set?key=${option}`, {
          description: option,
          key: key
        })
        .then((response) => {
          if (!response.data.success) {
            throw new Error(response.data.errorMessage);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSettingKeys(context) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;

      let _settings = {
        play_pause: "",
        previous_period: "",
        next_period: "",
        decrease_speed: "",
        increase_speed: "",
        restart: "",
        add_label: "",
        copy: ""
      };
      let userRequests = [];
      for (var key in _settings) {
        userRequests.push(
          new Promise((resolve, reject) => {
            axios
              .get(`/1/user/settings/get?key=${key}`)
              .then((response) => {
                _settings[key] = response.data ? response.data.key : "";
                resolve(_settings[key]);
              })
              .catch((err) => {
                console.log(err);
                reject(err);
              });
          })
        );
      }
      Promise.all(userRequests).then((response) => {
        settings["play_pause"] = response[0] || settings["play_pause"];
        settings["previous_period"] =
          response[1] || settings["previous_period"];
        settings["next_period"] = response[2] || settings["next_period"];
        settings["decrease_speed"] = response[3] || settings["decrease_speed"];
        settings["increase_speed"] = response[4] || settings["increase_speed"];
        settings["restart"] = response[5] || settings["restart"];
        settings["add_label"] = response[6] || settings["add_label"];
        settings["copy"] = response[7] || settings["copy"];
        context.commit("setSettings", settings);
      });
    },
    getTranscription(context, confId) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .get(`/1/conference/download?conference_id=${confId}&format=json`)
          .then((response) => {
            if (response.data.success) {
              const data = response.data;
              console.log(data);
              resolve(data);
            } else {
              throw new Error(response.data.errorMessage);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    getTranscriptionSpeechPad(context, speechpadId) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .get(`/1/speechpad/get?speechpad_id=${speechpadId}`)
          .then((response) => {
            if (response.data.success) {
              const data = response.data;
              console.log(data);
              resolve(data);
            } else {
              throw new Error(response.data.errorMessage);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    createConference(context, param) {
      const confN = param.conferenceName;
      const orgN = param.organizerName;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .post(
            `/1/conference/create?conference_name=${confN}&host_name=${orgN}`
          )
          .then((response) => {
            if (response.data.success) {
              const data = response.data;
              const host = {
                confId: data.conferenceId,
                id: data.hostId,
                name: data.hostName,
                host: true
              };
              const conf = {
                confId: data.conferenceId,
                confName: data.conferenceName
              };
              context.commit("addParticipant", host);
              context.commit("setCurrentParticipant", host);
              context.commit("setConferenceInfo", conf);
              resolve(data.conferenceId);
            } else {
              throw new Error(response.data.errorMessage);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    joinConference(context, param) {
      const confId = param.confId;
      const partN = param.partName;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .post(
            `/1/conference/join_speaker?conference_id=${confId}&speaker_name=${partN}`
          )
          .then((response) => {
            if (response.data.success) {
              const data = response.data;
              console.log(data);
              const part = {
                confId: data.conferenceId,
                id: data.participantId,
                name: data.participantName,
                host: false
              };
              context.commit("setCurrentParticipant", part);
              context.commit("addParticipant", part);
              resolve(data.conferenceId);
            } else {
              throw new Error(response.data.errorMessage);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    addParticipant(context, param) {
      console.log(param);
      context.commit("addParticipant", {
        id: param.participantId,
        name: param.participantName,
        confId: param.conferenceId,
        host: false
      });
    },
    endConference(context, conferenceId) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .post(`/1/conference/finish?conference_id=${conferenceId}`)
          .then((response) => {
            if (response.data.success) {
              context.commit("destroyConferenceInfo", conferenceId);
              resolve(response);
            } else {
              throw new Error(response.data.errorMessage);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    exitConference(context, partId) {
      context.commit("destroyParticipantInfo", partId);
    },
    destroyToken(context) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;

      if (context.getters.loggedIn) {
        context.commit("destroyToken");
        // return new Promise((resolve, reject) => {
        //   axios
        //     .post(`/1/user/logout`)
        //     .then((response) => {
        //       localStorage.removeItem("accessToken");
        //       context.commit("destroyToken");
        //       resolve(response);
        //     })
        //     .catch((err) => {
        //       localStorage.removeItem("accessToken");
        //       context.commit("destroyToken");
        //       reject(err);
        //     });
        // });
      }
    },
    getStorageLink(context, payload) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .post(`/2/transcribe/generate_upload_url?service=${payload}`)
          .then((response) => {
            if (response.data.success) {
              const transcribeId = response.data.transcribeId;
              const storageUrl = response.data.url;
              context.commit("saveUploadInfo", { transcribeId, storageUrl });
              console.log("getStorageLink Successfull: ", {
                transcribeId,
                storageUrl
              });
              resolve({ transcribeId, storageUrl });
            } else {
              throw new Error(response.data.errorMessage);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    saveUploadedFile(context, payload) {
      console.log(payload);
      context.commit("saveFile", payload);
    },
    uploadMediaToStorage(context, { file, url }) {
      console.log("PUT REQUEST(uploadMediaToStorage): " + url + " -:-" + file);
      console.log("uploadMediaToStorage Started");

      return new Promise((resolve) => {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
          if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log(this.responseText);
            resolve(this.responseText);
            console.log("uploadMediaToStorage Ended");
          }
        };

        let freader = new FileReader();
        freader.onload = function () {
          request.open(
            "PUT",
            `https://cors-proxy-dan.herokuapp.com/${url}`,
            true
          );
          request.send(freader.result);
          console.log("Loading .... ");
        };
        freader.readAsArrayBuffer(file);
      });
    },
    retrieveToken(context, credentials) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/login`, credentials)
          .then((response) => {
            if (response.data.success) {
              const token = response.data.token;
              const username = response.data.username;
              const id = response.data.id;
              context.commit("retrieveToken", { token, username, id });
              resolve(response);
            } else {
              throw new Error(response.data.message);
            }
          })
          .catch((err) => {
            console.log("Login Error: ", err);
            reject(err);
          });
      });
    },
    registerUser(_context, credentials) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/register`, credentials)
          .then((response) => {
            if (response.data.success) {
              console.log(response);
              resolve(response);
            } else {
              throw new Error(response.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    beginTranscription(context, transId) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      console.log("beginTranscription");
      return new Promise((resolve, reject) => {
        axios
          .post(`/2/transcribe/start?transcribe_id=${transId}`)
          .then((response) => {
            if (response.data.success) {
              console.log(response.data.success);
              resolve(response.data.transcribeId);
            } else {
              reject(response.data.errorMessage);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    verifyTranscriptionStatus(context, transId) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      console.log("verifyTranscriptionStatus");
      return new Promise((resolve, reject) => {
        setInterval(() => {
          axios
            .get(`/2/transcribe/check_state?transcribe_id=${transId}`)
            .then((response) => {
              if (response.data.success) {
                console.log(response.data.state);
                if (response.data.state === "READY") {
                  resolve(response.data.state);
                }
              } else {
                throw new Error(response.data.errorMessage);
              }
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        }, 5000);
      });
    },
    getDecodedTranscription(context, transId) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;

      console.log("getDecodedTranscription");
      return new Promise((resolve, reject) => {
        axios
          .get(`/2/transcribe/get?transcribe_id=${transId}`)
          .then((response) => {
            if (response.data.success) {
              context.commit("saveDecodeTranscript", response.data);
              resolve(response.data);
            } else {
              throw new Error(response.data.errorMessage);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    editTranscription(context, payload) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .post(
            `/2/transcribe/edit?transcribe_id=${payload.transId}`,
            payload.text
          )
          .then((response) => {
            if (response.data.success) {
              resolve(response.data);
            } else {
              throw new Error(response.data.errorMessage);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },

    deleteBlockNote(context, id) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .delete(`/api/notes?id=${id}`)
          .then((response) => {
            if (response.data.success) {
              resolve();
            } else {
              throw new Error(response.data.errorMessage);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    updateNote(context, note) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .put(`/api/notes`, note)
          .then((response) => {
            if (response.data.success) {
              resolve();
            } else {
              throw new Error(response.data.errorMessage);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    saveModifiedBlockNote(context, payload) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .post(`/1/speechpad/modify?speechpad_id=${payload.id}`, payload)
          .then((response) => {
            if (response.data.success) {
              resolve();
            } else {
              throw new Error(response.data.errorMessage);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    fetchArchives(context) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      console.log("GET ALL:");
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/notes/all`)
          .then((response) => {
            console.log(response.data.speechpads);
            if (response.data.success) {
              context.commit("SET_ARCHIVE_ITEMS", response.data.speechpads);
              resolve(response.data.speechpads);
            } else {
              throw new Error(response.data.errorMessage);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    fetchArchive(context, speechpadId) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .get(`/1/speechpad/get?speechpad_id=${speechpadId}`)
          .then((response) => {
            if (response.data.success) {
              console.log(response.data);
              context.commit(
                "SET_ARCHIVE_ITEMS",
                response.data.transcribeResult
              );
              resolve(response.data.transcribeResult);
            } else {
              throw new Error(response.data.errorMessage);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    addToArchive(context, text) {
      context.commit("addArchive", text);
    },
    createNote(context, noteTitle) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        const json = {
          title: noteTitle,
          user: { userId: context.state.userId }
        };
        console.log(json);
        axios
          .post(`/api/notes`, json, {
            headers: {
              // Overwrite Axios's automatically set Content-Type
              "Content-Type": "application/json"
            }
          })
          .then((response) => {
            console.log(response);
            if (response.data.success) {
              resolve(response.data);
            } else {
              throw new Error("Bad request");
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    saveNote(context, note) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        const json = note;
        console.log(json);
        axios
          .put(`/api/notes`, json, {
            headers: {
              // Overwrite Axios's automatically set Content-Type
              "Content-Type": "application/json"
            }
          })
          .then((response) => {
            console.log(response);
            if (response.data.success) {
              resolve(response.data);
            } else {
              throw new Error("Bad request");
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    deleteVoiceNote(context, voiceNoteId) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .delete(`api/voice?id=${voiceNoteId}`)
          .then((response) => {
            console.log(response);
            if (response.data.success) {
              resolve(response.data);
            } else {
              throw new Error("Bad request");
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    deleteNote(context, noteId) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .delete(`api/notes?id=${noteId}`)
          .then((response) => {
            if (response.data.success) {
              resolve(response.data.notes);
            } else {
              throw new Error("Bad request");
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    getAllNotes(context) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/notes/user?id=${context.state.userId}`)
          .then((response) => {
            console.log(response);
            if (response.data.success) {
              resolve(response.data.notes);
            } else {
              throw new Error("Bad request");
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    createSpeechPad(context) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .post(`/api/voice/newnote?model=default`)
          .then((response) => {
            console.log(
              "🚀 ~ file: index.js ~ line 784 ~ .then ~ response",
              response.data
            );
            if (response.data.success) {
              resolve(response.data.speechpadId);
            } else {
              throw new Error(response.data.errorMessage);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    clearSpeechPad(context, noteId) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .delete(`/api/voice?id=${noteId}`)
          .then((response) => {
            if (response.data.success) {
              resolve(response.data.speechpadId);
            } else {
              throw new Error(response.data.errorMessage);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    }
  },
  modules: {},
  plugins: [vuexLocal.plugin]
});
