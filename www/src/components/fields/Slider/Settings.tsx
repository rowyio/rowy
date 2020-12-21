import React from 'react';
import {
  Typography,TextField,FormControlLabel,Switch
} from "@material-ui/core";

import _sortBy from "lodash/sortBy";


const Settings =({
    handleChange,
    config
})=>{
    return (
        <>
          <Typography variant="overline" gutterBottom>Minimum Value</Typography>
          <TextField
            variant="filled"
            fullWidth
            margin="none"
            onChange={(e)=>handleChange('min')(parseFloat(e.target.value))}
            value={config['min']}
            id={`settings-field-min`}
            label="Minimum Value"
            type="number"
          />

          <TextField
            variant="filled"
            fullWidth
            margin="none"
            onChange={(e)=>handleChange('max')(parseFloat(e.target.value))}
            value={config['max']}
            id={`settings-field-max`}
            label="Maximum Value"
            type="number"
          />

          <TextField
            variant="filled"
            fullWidth
            margin="none"
            onChange={(e)=>handleChange('step')(parseFloat(e.target.value))}
            value={config['step']}
            id={`settings-field-step`}
            label="Step Value"
            type="number"
          />

        <FormControlLabel
            control={
              <Switch
                checked={config.marks}
                onChange={() =>
                  handleChange("marks")(
                    !Boolean(config.marks)
                  )
                }
                name="marks"
              />
            }
            label="Show slider steps"
          />
         
        </>
      );
}

export default Settings