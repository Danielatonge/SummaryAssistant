<template>
  <v-text-field
    clearable
    v-model="value"
    @change="change"
    @keyup="handleKeyUp"
    @keydown="handleKeyDown"
    outlined
    background-color="grey lighten-2"
    hide-details="auto"
  ></v-text-field>
</template>

<script>
export default {
  props: ["text", "change"],
  mounted() {
    this.value = this.text;
  },
  data() {
    return {
      value: "",
      keys: {},
      keyPressed: "",
    };
  },
  methods: {
    handleKeyDown(e) {
      this.value = "";
      if (e.type == "keydown") {
        this.keys[e.key] = true;
      }
    let i = 0;
      for (const [key, value] of Object.entries(this.keys)) {
        if (value) {
          this.value += (i ? " + " : "") + key.toUpperCase();
          i++;
        }
      }
      e.preventDefault();
      // console.log("Down Value:", this.value);
      // console.log("Down Keys:", this.keys);
    },

    handleKeyUp(e) {
      if (e.type == "keyup") {
        this.keys[e.key] = false;
      }
    },
  },
};
</script>

<style>
</style>