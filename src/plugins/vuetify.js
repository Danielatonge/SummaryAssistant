import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import IconCheck from "@/components/Icons/IconCheck.vue";
import IconEdit from "@/components/Icons/IconEdit.vue";
import IconPlus from "@/components/Icons/IconPlus.vue";
import IconTrash from "@/components/Icons/IconTrash.vue";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    values: {
      check: {
        component: IconCheck,
      },
      edit: {
        component: IconEdit,
      },
      plus: {
        component: IconPlus,
      },
      trash: {
        component: IconTrash,
      },
    },
  },
});
