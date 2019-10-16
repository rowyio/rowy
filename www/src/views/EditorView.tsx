import React, { Component } from "react";
import { GEditor } from "grapesjs-react";
import "grapesjs/dist/css/grapes.min.css";
class GEditorExample extends Component {
  render() {
    return <GEditor id="editor" webpage={true} />;
  }
}

export default GEditorExample;
