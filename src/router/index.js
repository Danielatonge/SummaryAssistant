import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Decode from "../views/Decode.vue";
import Conference from "../views/Conference.vue";
import CreateConference from "../components/CreateConference.vue";
import CreatedConference from "../components/CreatedConference.vue";
import ConnectConference from "../components/ConnectConference.vue";
import ConnectedConference from "../components/ConnectedConference.vue";
import GetConference from "../components/GetConference.vue";
import VoiceNote from "../views/VoiceNote.vue";
import Reference from "../views/Reference.vue";
import Settings from "../views/Settings.vue";
import DecodeVideo from "../components/DecodeVideo.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/decode",
    name: "Decode",
    component: Decode,
  },
  {
    path: "/decode/video",
    name: "DecodeVideo",
    component: DecodeVideo,
  },
  {
    path: "/voice_note",
    name: "VoiceNote",
    component: VoiceNote,
  },
  {
    path: "/reference",
    name: "Reference",
    component: Reference,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/conference",
    name: "Conference",
    component: Conference,
  },
  {
    path: "/conference/create",
    name: "CreateConference",
    component: CreateConference,
  },
  {
    path: "/conference/created",
    name: "CreatedConference",
    component: CreatedConference,
  },
  {
    path: "/conference/connect",
    name: "ConnectConference",
    component: ConnectConference,
  },
  {
    path: "/conference/connected",
    name: "ConnectedConference",
    component: ConnectedConference,
  },
  {
    path: "/conference/get-encoding",
    name: "GetConference",
    component: GetConference,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
