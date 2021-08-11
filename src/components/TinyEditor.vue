<template>
  <div>
    <editor
      v-model="editorText"
      apiKey="06j1sdk82snkig4i7v5u03ne6nrs1dabbh9ftqntbcutrvv6"
      :disabled="true"
      :init="{
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help',
      }"
    />
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "TinyEditor",
  props: {
    editorText: {
      type: String,
    },
  },
  components: {
    editor: Editor,
  },
  mounted() {
    this.text = this.editorText;
  },
  data() {
    return {
      text: "",
    };
  },
};
</script>

<style>
</style>