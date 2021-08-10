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
import Login from "../components/auth/Login.vue";
import Register from "../components/auth/Register.vue";
import Logout from "../components/auth/Logout.vue";

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
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/decode/video",
    name: "DecodeVideo",
    component: DecodeVideo,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/voice_note",
    name: "VoiceNote",
    component: VoiceNote,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/reference",
    name: "Reference",
    component: Reference,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      requiresVisitor: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      requiresVisitor: true,
    },
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/conference",
    name: "Conference",
    component: Conference,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/conference/create",
    name: "CreateConference",
    component: CreateConference,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/conference/created/:id",
    name: "CreatedConference",
    component: CreatedConference,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/conference/connect",
    name: "ConnectConference",
    component: ConnectConference,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/conference/connected/:id",
    name: "ConnectedConference",
    component: ConnectedConference,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/conference/get-encoding",
    name: "GetConference",
    component: GetConference,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
