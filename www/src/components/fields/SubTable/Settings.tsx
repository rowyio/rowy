import React , { useState, lazy, Suspense } from 'react';
import {
    Typography,
    IconButton,
    TextField,
    Switch,
    FormControlLabel,
    Divider,
  } from "@material-ui/core"
import MultiSelect from "@antlerengineering/multiselect";
import FieldSkeleton from "components/SideDrawer/Form/FieldSkeleton";
import { FieldType } from "constants/fields";
import FieldsDropdown from "components/Table/ColumnMenu/FieldsDropdown";
const CodeEditor = lazy(
    () => import("components/Table/editors/CodeEditor" /* webpackChunkName: "CodeEditor" */)
  );

const Settings = ({
  fieldType,
  config,
  handleChange,
  tables,
  columns,
  roles,
})=>{

  return (
    <>

      <MultiSelect
            label={"Listener fields (this script runs when these fields change)"}
            options={columns//.filter(column => column.key)
            }
            value={config.listenerFields ?? []}
            onChange={handleChange("listenerFields")}
          />
      <Typography variant="overline">derivative script</Typography>
      <Suspense fallback={<FieldSkeleton height={200} />}>
        <CodeEditor
          script={config.script}
          handleChange={handleChange("script")}
        />
      </Suspense>

      <Typography variant="overline">Field type of the output</Typography>
      <FieldsDropdown
        value={config.renderFieldType}
        options={Object.values(FieldType).filter(
          (f) =>
            ![
              FieldType.derivative,
              FieldType.aggregate,
              FieldType.subTable,
              FieldType.action,
            ].includes(f)
        )}
        onChange={(newType: any) => {
          handleChange("renderFieldType")(newType.target.value);
        }}
      />
      {config.renderFieldType && (
        <>
          <Typography variant="overline"> Rendered field config</Typography>
          {/* <ConfigFields
            fieldType={config.renderFieldType}
            config={config}
            handleChange={handleChange}
            tables={tables}
            columns={columns}
            roles={roles}
          /> */}
        </>
      )}
    </>
  );
}
export default Settings