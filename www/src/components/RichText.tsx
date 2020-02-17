import React from "react";

import "tinymce/tinymce.min.js";
import "tinymce/themes/silver";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/paste";
import "tinymce/plugins/code";
import "tinymce/plugins/help";
import "tinymce/plugins/wordcount";
import { Editor } from "@tinymce/tinymce-react";

export interface IRichTextProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function RichText({ value, onChange }: IRichTextProps) {
  return (
    <Editor
      initialValue={value}
      init={{
        height: 300,
        menubar: false,
        plugins: [
          "lists link image",
          "code fullscreen",
          "paste code help wordcount",
        ],
        branding: false,
        toolbar:
          "undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help",
      }}
      onEditorChange={onChange}
    />
  );
}
