<template>
  <div></div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("destroyToken").then(() => {
      this.$router.push({ name: "Home" });
    });
  },
};
</script>

<style>
</style>