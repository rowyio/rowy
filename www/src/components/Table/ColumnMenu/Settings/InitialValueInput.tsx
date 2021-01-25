import React from "react";
import Subheading from "../Subheading";
import { Typography } from "@material-ui/core";
import { getFieldProp } from "components/fields";
//import { useForm } from "react-hook-form";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CodeEditor from "components/CodeEditor";
const InitialValueInput = ({ config, handleChange, fieldType }) => {
  const customFieldInput = getFieldProp("SideDrawerField", fieldType);

  const [tab, setTab] = React.useState(1);

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
    handleChange("initialValue.type")(newValue === 0 ? "static" : "dynamic");
  };

  return (
    <>
      <Subheading>Default value</Subheading>
      <Typography color="textSecondary" paragraph>
        The default value will be the initial value of the cells, whenever a new
        row is added.
      </Typography>

      <Paper square>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChangeTab}
          aria-label="initialization type tab"
        >
          <Tab label="Static" disabled />
          <Tab label="Dynamic" />
        </Tabs>
        <Typography color="textSecondary" paragraph>
          Dynamic default value is evaluated after the onCreate trigger in the
          FT cloud function of this table
        </Typography>
        <CodeEditor
          height={120}
          value={config["initialValue.script"]}
          onChange={handleChange("initialValue.script")}
          editorOptions={{
            minimap: {
              enabled: false,
            },
          }}
        />
      </Paper>
      {/* <>render field component here</> */}
      {/* {customFieldInput && 
          <form>
              {React.createElement(customFieldInput, {
            column: {},
            control,
            docRef:{},
            disabled: false,
          })}
          </form>} */}
    </>
  );
};

export default InitialValueInput;
