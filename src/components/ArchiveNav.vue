<template>
  <div
    class="d-flex py-2 pl-3 justify-space-between"
    :class="item.speechpadId === activeId ? 'skyblue' : 'transparent'"
  >
    <!--    <div class="my-auto">-->
    <!--      <v-icon class="size-icon mr-3" color="#14396A"> mdi-folder</v-icon>-->
    <!--    </div>-->
    <span style="width: 60%" @click="setActiveNav(item)">
      <v-text-field
        dense
        :outlined="!disabled"
        :disabled="disabled"
        v-model="item.speechpadName"
        :background-color="disabled ? 'transparent' : '#E8EDF1'"
        color="#BEC9D6"
        class="rounded-lg"
        hide-details=" auto"
      >
      </v-text-field>
    </span>
    <div class="my-auto mx-2">
      <v-icon class="size-icon mr-3" color="#14396A" @click="editDialog(item)">
        {{ disabled ? `$vuetify.icons.edit` : `$vuetify.icons.check` }}
      </v-icon>
      <v-icon
        color="#14396A"
        class="size-icon mx-1"
        @click="openDeleteDialog(item)"
      >
        $vuetify.icons.trash
      </v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArchiveItem",
  components: {},
  props: {
    item: {
      type: Object,
      required: true
    },
    activeId: {
      required: false
    }
  },
  data() {
    return {
      active: false,
      disabled: true
    };
  },
  methods: {
    setActiveNav(item) {
      if (this.disabled === true) {
        this.$emit("setActiveNav", item);
      }
    },
    openDeleteDialog(item) {
      this.$emit("openDeleteDialog", item);
    },
    saveEditedVoiceNote(item) {
      this.$emit("saveEditedVoiceNote", item);
    },
    editDialog(item) {
      if (this.disabled === true) {
        this.disabled = false;
      } else {
        this.$emit("saveEditedVoiceNoteName", item);
        this.disabled = true;
      }
    }
  }
};
</script>

<style>
.skyblue {
  background-color: rgba(17, 125, 236, 0.1);
}

#voice-note
  .v-text-field--outlined.v-input--dense.v-text-field--outlined
  > .v-input__control
  > .v-input__slot {
  min-height: 20px !important;
}

#voice-note .v-text-field > .v-input__control > .v-input__slot:before {
  content: none;
}

.size-icon {
  font-size: 32px !important;
}

#voice-note .theme--light.v-input--is-disabled input {
  color: #000;
}
</style>
