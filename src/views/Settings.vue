<template>
  <div>
    <v-container class="pb-10 text-color">
      <v-row>
        <v-col cols="12">
          <p class="text-h3 font-weight-bold text-center">
            Настройка горячих клавиш
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="6">
          <div class="text-h5 setting-column">
            <p class="text-center text-h4 mb-10">Горячие клавиши плеера</p>
            <v-row>
              <v-col cols="6" class="my-auto">
                <div>Плей/Пауза</div>
              </v-col>
              <v-col cols="6">
                <settings-text-field
                  :text="settings.play_pause"
                  :change="play_pauseChanged"
                >
                </settings-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="my-auto">
                <div>Предыдуший период</div>
              </v-col>
              <v-col cols="6">
                <settings-text-field
                  :text="settings.previous_period"
                  :change="previous_periodChanged"
                ></settings-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="my-auto">
                <div>Следующий период</div>
              </v-col>
              <v-col cols="6">
                <settings-text-field
                  :text="settings.next_period"
                  :change="next_periodChanged"
                ></settings-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="my-auto">
                <div>Снизить скорость</div>
              </v-col>
              <v-col cols="6">
                <settings-text-field
                  :text="settings.decrease_speed"
                  :change="decrease_speedChanged"
                ></settings-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="my-auto">
                <div>Увеличить скорость</div>
              </v-col>
              <v-col cols="6">
                <settings-text-field
                  :text="settings.increase_speed"
                  :change="increase_speedChanged"
                ></settings-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="my-auto">
                <div>Начать сначала</div>
              </v-col>
              <v-col cols="6">
                <settings-text-field
                  :text="settings.restart"
                  :change="restartChanged"
                  outlined
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></settings-text-field>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col cols="12" lg="6">
          <div class="text-h5 setting-column">
            <p class="text-center text-h4 mb-10">
              Горячие клавиши текстового редактора
            </p>
            <v-row>
              <v-col cols="6" class="my-auto">
                <div>Добавить метку</div>
              </v-col>
              <v-col cols="6">
                <settings-text-field
                  :text="settings.add_label"
                  :change="add_labelChanged"
                ></settings-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="my-auto">
                <div>Скопировать</div>
              </v-col>
              <v-col cols="6">
                <settings-text-field
                  :text="settings.copy"
                  :change="copyChanged"
                >
                </settings-text-field>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SettingsTextField from "@/components/SettingsTextField.vue";

export default {
  components: { SettingsTextField },
  name: "Settings",
  created() {
    this.$store.dispatch("getSettingKeys");
  },
  computed: {
    ...mapGetters(["settings"]),
  },
  methods: {
    play_pauseChanged(newKey) {
      this.$store.dispatch("modifySettings", {
        key: newKey,
        description: "play_pause",
      });
    },
    previous_periodChanged(newKey) {
      this.$store.dispatch("modifySettings", {
        key: newKey,
        description: "previous_period",
      });
    },
    next_periodChanged(newKey) {
      this.$store.dispatch("modifySettings", {
        key: newKey,
        description: "next_period",
      });
    },
    decrease_speedChanged(newKey) {
      this.$store.dispatch("modifySettings", {
        key: newKey,
        description: "decrease_speed",
      });
    },
    increase_speedChanged(newKey) {
      this.$store.dispatch("modifySettings", {
        key: newKey,
        description: "increase_speed",
      });
    },
    restartChanged(newKey) {
      this.$store.dispatch("modifySettings", {
        key: newKey,
        description: "restart",
      });
    },
    add_labelChanged(newKey) {
      this.$store.dispatch("modifySettings", {
        key: newKey,
        description: "add_label",
      });
    },
    copyChanged(newKey) {
      this.$store.dispatch("modifySettings", {
        key: newKey,
        description: "copy",
      });
    },
  },
};
</script>

<style>
.setting-column {
  border: 1px solid grey;
  padding: 30px;
  border-radius: 15px;
}
</style>