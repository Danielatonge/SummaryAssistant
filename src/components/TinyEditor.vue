<template>
  <div>
    <editor
      ref="edit"
      v-model="text"
      apiKey="06j1sdk82snkig4i7v5u03ne6nrs1dabbh9ftqntbcutrvv6"
      output-format="text"
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
    // this.editorObj = this.$refs.edit.editor;
    this.text = this.editorText;
  },
  watch: {
    editorText(val) {
      this.text = val;
      const height = this.$refs.edit.editor.getBody().scrollHeight;
      this.$refs.edit.editor.getWin().scrollTo(500, height);
    },
  },
  data() {
    return {
      text: "",
      editorObj: null,
    };
  },
  methods: {},
};
</script>

<style></style>
