<template>
  <div class="d-flex justify-space-between">
    <!--                <v-list-item-icon>-->
    <!--                  <v-icon>mdi-folder</v-icon>-->
    <!--                </v-list-item-icon>-->
    <!--    <div class="my-auto">-->
    <!--      <v-icon large class="mr-1"> mdi-folder</v-icon>-->
    <!--    </div>-->
    <span style="width: 60%" @click="setActiveNav(item)">
      <v-text-field
        dense
        :outlined="!disabled"
        :disabled="disabled"
        v-model="item.title"
        :background-color="
          item.id === activeId ? 'grey lighten-1' : 'transparent'
        "
        color="#000"
        class="rounded-lg"
        hide-details=" auto"
      >
      </v-text-field>
    </span>
    <div class="my-auto">
      <v-icon class="size-icon" color="#14396A" @click="editDialog(item)">
        {{ disabled ? "mdi-square-edit-outline" : "mdi-check-circle-outline" }}
      </v-icon>
      <v-icon
        color="#14396A"
        class="size-icon mx-1"
        @click="openDeleteDialog(item)"
      >
        mdi-trash-can-outline
      </v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArchiveItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
    activeId: {
      required: false,
    },
  },
  data() {
    return {
      active: false,
      disabled: true,
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
    },
  },
};
</script>

<style>
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
