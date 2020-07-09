import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
const useStyles = makeStyles(Theme =>
  createStyles({
    root: {},
  })
);

const heightCalc = (code: string, minHeight: number, maxHeight: number) => {
  const codeHeight = code.split("\n").length * 20;
  console.log({ codeHeight });
  if (codeHeight <= maxHeight && codeHeight >= minHeight) return codeHeight;
  else if (codeHeight > maxHeight) return maxHeight;
  else if (codeHeight < minHeight) return minHeight;
};
export default function CodeEditor(props: any) {
  const { handleChange, script } = props;
  console.log({ script });
  const classes = useStyles();

  return (
    <Grid container direction="column" className={classes.root}>
      <AceEditor
        key={`column-code-editor`}
        placeholder="insert code"
        mode="javascript"
        theme="monokai"
        name={"code-editor"}
        //onLoad={this.onLoad}
        onChange={handleChange}
        fontSize={14}
        showPrintMargin={true}
        height={`${heightCalc(script ?? "", 100, 600)}px`}
        //showGutter={true}
        highlightActiveLine={true}
        value={script}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </Grid>
  );
}
