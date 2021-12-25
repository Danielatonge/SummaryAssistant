import axios from "axios";

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
const API = "https://summarytest.herokuapp.com";

export const modifySettings = (context, param) => {
  const key = param.key;
  const option = param.description;
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + context.state.token;
  axios
    .post(`${API}/api/user/settings/set?key=${option}`, {
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
};
export const getSettingKeys = (context) => {
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
          .get(`${API}/api/user/settings/get?key=${key}`)
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
    settings["previous_period"] = response[1] || settings["previous_period"];
    settings["next_period"] = response[2] || settings["next_period"];
    settings["decrease_speed"] = response[3] || settings["decrease_speed"];
    settings["increase_speed"] = response[4] || settings["increase_speed"];
    settings["restart"] = response[5] || settings["restart"];
    settings["add_label"] = response[6] || settings["add_label"];
    settings["copy"] = response[7] || settings["copy"];
    context.commit("setSettings", settings);
  });
};

export const getTranscription = (context, param) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + context.state.token;
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${API}/api/conference/download?conference_id=${param.confId}&format=json`
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
};
export const createConference = (context, param) => {
  const confN = param.conferenceName;
  const orgN = param.organizerName;
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + context.state.token;
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${API}/api/conference/create?conference_name=${confN}&host_name=${orgN}`
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
};
export const joinConference = (context, param) => {
  const confId = param.confId;
  const partN = param.partName;
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + context.state.token;
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${API}/api/conference/join_speaker?conference_id=${confId}&speaker_name=${partN}`
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
};
export const addParticipant = (context, param) => {
  console.log(param);
  context.commit("addParticipant", {
    id: param.participantId,
    name: param.participantName,
    confId: param.conferenceId,
  });
};
export const endConference = (context, conferenceId) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + context.state.token;
  return new Promise((resolve, reject) => {
    axios
      .post(`${API}/api/conference/finish?conference_id=${conferenceId}`)
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
};
export const destroyToken = (context) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + context.state.token;

  if (context.getters.loggedIn) {
    localStorage.removeItem("accessToken");
    context.commit("destroyToken");
    // return new Promise((resolve, reject) => {
    //   axios
    //     .post(`${API}/api/user/logout`)
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
};
export const getStorageLink = (context, payload) => {
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
};
export const uploadMediaToStorage = (context, payload) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + context.state.token;
  console.log("PUT REQUEST");
  axios.put(`${payload.url}`).catch((err) => {
    console.log(err);
  });
};

export const retrieveToken = (context, credentials) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API}/api/user/login`, {
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
};
export const registerUser = (context, credentials) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API}/api/user/create`, {
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
};
