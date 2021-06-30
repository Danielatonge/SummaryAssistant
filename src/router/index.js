import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Decoder from "../views/Decoder.vue";
import Conference from "../views/Conference.vue";
import CreateConference from "../components/CreateConference.vue";
import ConnectConference from "../components/ConnectConference.vue";
import GetConference from "../components/GetConference.vue";
import VoiceNote from "../views/VoiceNote.vue";
import Reference from "../views/Reference.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/decoder",
    name: "Decoder",
    component: Decoder,
  },
  {
    path: "/conference",
    name: "Conference",
    component: Conference,
    children: [
      {
        path: 'create',
        name: "CreateConference",
        component: CreateConference,
      },
      {
        path: 'connect',
        name: "ConnectConference",
        component: ConnectConference,
      },
      {
        path: 'get-encoding',
        name: "GetConference",
        component: GetConference,
      },
    ]
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
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
