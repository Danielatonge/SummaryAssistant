<template>
  <div class="d-flex justify-space-around">
    <!--                <v-list-item-icon>-->
    <!--                  <v-icon>mdi-folder</v-icon>-->
    <!--                </v-list-item-icon>-->
    <div @click="setActiveNav(item)">
      <v-text-field
        dense
        outlined
        :disabled="disabled"
        v-model="item.title"
        :background-color="
          item.id === activeId ? 'transparent' : 'orange lighten-4'
        "
        hide-details="auto"
      >
      </v-text-field>
    </div>
    <div class="my-auto">
      <v-icon @click="editDialog(item)">
        {{ disabled ? "mdi-square-edit-outline" : "mdi-check-circle-outline" }}
      </v-icon>
      <v-icon class="ml-1" @click="openDeleteDialog(item)">
        mdi-delete-forever-outline
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
        this.$emit("saveEditedVoiceNote", item);
        this.disabled = true;
      }
    },
  },
};
</script>

<style scoped></style>
