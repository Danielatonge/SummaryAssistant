export const retrieveToken = (state, token) => {
  state.token = token;
};
export const destroyToken = (state) => {
  state.token = null;
};
export const setConferenceInfo = (state, data) => {
  state.conferenceInfo = data;
};
export const setSettings = (state, data) => {
  state.settings = data;
};
export const destroyConferenceInfo = (state) => {
  state.conferenceInfo = null;
};
export const saveUploadInfo = (state, uploadInfo) => {
  state.decode_upload = uploadInfo;
};
export const addParticipant = (state, payload) => {
  console.log("Add Participant");
  console.log(state.participants);
  console.log(payload);
  state.participants = payload;
};
