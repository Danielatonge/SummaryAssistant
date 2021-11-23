<template>
  <div>
    <editor
      v-on="$listeners"
      ref="edit"
      :value="editorText"
      @input="
        (value) => {
          handleEditorChange(value);
        }
      "
      model-events="blur focusout"
      @blur="console.log('Here')"
      apiKey="06j1sdk82snkig4i7v5u03ne6nrs1dabbh9ftqntbcutrvv6"
      output-format="text"
      :init="{
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help'
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
      type: String
    }
  },

  components: {
    editor: Editor
  },
  methods: {
    handleEditorChange(val) {
      console.log("Now");
      this.$emit("input", val);
      console.log(val);
      const height = this.$refs.edit.editor.getBody().scrollHeight;
      this.$refs.edit.editor.getWin().scrollTo(500, height);
    }
  }
};
</script>

<style></style>
