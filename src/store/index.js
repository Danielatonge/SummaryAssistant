import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VuexPersistence from "vuex-persist";

Vue.use(Vuex);
axios.defaults.baseUrl = "https://dpforge.com";
const API = "https://dpforge.com";
let settings = {
  play_pause: "ALT + G",
  previous_period: "P",
  next_period: "ALT + M",
  decrease_speed: "G",
  increase_speed: "SHIFT + G",
  restart: "F12",
  add_label: "A",
  copy: "H",
};

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default new Vuex.Store({
  state: {
    token: null,
    conferenceInfo: null,
    settings: settings || null,
    record: null,
    gumStream: null,
    decode_upload: null,
    participants: [
      {
        confId: "1001",
        id: "b5b562cf-5d53-4cdb-81f9-76d8a7435e19",
        name: "Александра Андреевна",
      },
      {
        confId: "1002",
        id: "b5b562cf-5d53-4cdb-81f9-76d8a7fd5esd",
        name: "Антон Михайлов",
      },
    ],
  },
  getters: {
    loggedIn(state) {
      return state.token !== null;
    },
    conferenceInfo(state) {
      return state.conferenceInfo;
    },
    hostName(state) {
      return state.conferenceInfo ? state.conferenceInfo.hostName : null;
    },
    settings(state) {
      return state.settings;
    },
    participants(state) {
      return state.participants;
    },
  },
  mutations: {
    retrieveToken(state, token) {
      state.token = token;
    },
    destroyToken(state) {
      state.token = null;
    },
    setConferenceInfo(state, data) {
      state.conferenceInfo = data;
    },
    setSettings(state, data) {
      state.settings = data;
    },
    destroyConferenceInfo(state) {
      state.conferenceInfo = null;
    },
    saveUploadInfo(state, uploadInfo) {
      state.decode_upload = uploadInfo;
    },
    addParticipant(state, payload) {
      console.log("Add Participant");
      console.log(state.participants);
      console.log(payload);
      state.participants = payload;
    },
  },
  actions: {
    modifySettings(context, param) {
      const key = param.key;
      const option = param.description;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      axios
        .post(`${API}/1/user/settings/set?key=${option}`, {
          description: option,
          key: key,
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
        copy: "",
      };
      let userRequests = [];
      for (var key in _settings) {
        userRequests.push(
          new Promise((resolve, reject) => {
            axios
              .get(`${API}/1/user/settings/get?key=${key}`)
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
    getTranscription(context, param) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${API}/1/conference/download?conference_id=${param.confId}&format=json`
          )
          .then((response) => {
            if (response.data.success) {
              const data = response.data;
              console.log(data);
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
    createConference(context, param) {
      const confN = param.conferenceName;
      const orgN = param.organizerName;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${API}/1/conference/create?conference_name=${confN}&host_name=${orgN}`
          )
          .then((response) => {
            if (response.data.success) {
              const data = response.data;
              context.commit("setConferenceInfo", data);
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
    joinConference(context, param) {
      const confId = param.confId;
      const partN = param.partName;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${API}/1/conference/join_speaker?conference_id=${confId}&speaker_name=${partN}`
          )
          .then((response) => {
            if (response.data.success) {
              const data = response.data;

              context.commit("setConferenceInfo", data);
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
    addParticipant(context, param) {
      console.log(param);
      context.commit("addParticipant", {
        id: param.participantId,
        name: param.participantName,
        confId: param.conferenceId,
      });
    },
    endConference(context, conferenceId) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      return new Promise((resolve, reject) => {
        axios
          .post(`${API}/1/conference/finish?conference_id=${conferenceId}`)
          .then((response) => {
            if (response.data.success) {
              context.commit("destroyConferenceInfo");
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
    destroyToken(context) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;

      if (context.getters.loggedIn) {
        localStorage.removeItem("accessToken");
        context.commit("destroyToken");
        // return new Promise((resolve, reject) => {
        //   axios
        //     .post(`${API}/1/user/logout`)
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
          .post(`${API}/2/transcribe/generate_upload_url?service=${payload}`)
          .then((response) => {
            if (response.data.success) {
              const transcribeId = response.data.transcribeId;
              const storageUrl = response.data.url;
              context.commit("saveUploadInfo", { transcribeId, storageUrl });
              console.log({ transcribeId, storageUrl });
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
    uploadMediaToStorage(context, payload) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;
      console.log("PUT REQUEST");
      axios.put(`${payload.url}`).catch((err) => {
        console.log(err);
      });
    },
    retrieveToken(context, credentials) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${API}/1/user/login`, {
            login: credentials.username,
            password: credentials.password,
          })
          .then((response) => {
            if (response.data.success) {
              const token = response.data.accessToken;
              context.commit("retrieveToken", token);
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
    registerUser(context, credentials) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${API}/1/user/create`, {
            login: credentials.username,
            password: credentials.password,
          })
          .then((response) => {
            if (response.data.success) {
              console.log(response.data.success);
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
  },
  modules: {},
  plugins: [vuexLocal.plugin],
});
