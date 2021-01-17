import React from "react";
import SettingsHeading from "./SettingsHeading";
import {
    Typography,
  } from "@material-ui/core";
import { getFieldProp } from "components/fields";
//import { useForm } from "react-hook-form";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CodeEditor from 'components/CodeEditor';
const InitialValueInput =({config,handleChange,fieldType})=>{

    const customFieldInput = getFieldProp("SideDrawerField", fieldType);

    const [tab, setTab] = React.useState(1);

    const handleChangeTable = (event: React.ChangeEvent<{}>, newValue: number) => {
      setTab(newValue);
    
    };
  
    


    return <>
       <SettingsHeading>Default value</SettingsHeading>
          <Typography color="textSecondary" paragraph>
            The default value will be the initial value of the cells, whenever a
            new row is added.
          </Typography> 

          <Paper square>
      <Tabs
        value={tab}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChangeTable}
        aria-label="disabled tabs example"
      >
        <Tab label="Static" disabled />
        <Tab label="Dynamic" />
      </Tabs>
      <CodeEditor
                      height={120}
                      value={config["initialValue.script"]}
                      onChange={handleChange("initialValue.script")}
                      editorOptions={{ 
                        minimap: {
                        enabled: false,
                      }
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
}

export default InitialValueInput