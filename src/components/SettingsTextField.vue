<template>
  <v-text-field
    clearable
    v-model="value"
    @change="change"
    @keyup="handleKey"
    @keydown="handleKey"
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
    handleKey(e) {
      // Indicate key pressed
      if (e.type == "keydown") {
        this.keys[e.key] = true;
      } else {
        this.keys[e.key] = false;
      }

      // Run on all keys and determine which are pressed
      for (const [key, value] of Object.entries(this.keys)) {
        if (value) {
          this.keyPressed += key.toUpperCase();
        }
      }
      if (this.keyPressed) {
        this.value = this.keyPressed;
      }

      console.log("Value:", this.value);
      console.log("Keys:", this.keys);
    },
  },
};
</script>

<style>
</style>