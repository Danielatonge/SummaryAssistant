<template>
  <div class="d-flex justify-space-around">
    <!--                <v-list-item-icon>-->
    <!--                  <v-icon>mdi-folder</v-icon>-->
    <!--                </v-list-item-icon>-->
    <div>
      <v-btn
        depressed
        @click="setActiveNav(item)"
        :color="item.id === activeId ? '#14396a' : ''"
        :dark="item.id === activeId"
      >
        {{ item.title }}
      </v-btn>
    </div>
    <div class="my-auto">
      <v-icon @click="openEditDialog(item)"> mdi-square-edit-outline</v-icon>
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
    };
  },
  methods: {
    setActiveNav(item) {
      this.$emit("setActiveNav", item);
    },
    openEditDialog(item) {
      this.$emit("openEditDialog", item);
    },
    saveEditedVoiceNote() {
      this.$emit("saveEditedVoiceNote");
    },
    openDeleteDialog(item) {
      this.$emit("openDeleteDialog", item);
    },
  },
};
</script>

<style scoped></style>
