export const loggedIn = (state) => {
  return state.token !== null;
};
export const conferenceInfo = (state) => {
  return state.conferenceInfo;
};
export const hostName = (state) => {
  return state.conferenceInfo ? state.conferenceInfo.hostName : null;
};
export const settings = (state) => {
  return state.settings;
};
export const participants = (state) => {
  return state.participants;
};
