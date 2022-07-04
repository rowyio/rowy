import { sortBy } from "lodash-es";

import MultiSelect from "@rowy/multiselect";
import { Grid } from "@mui/material";
import { Leaf as LeafIcon } from "@src/assets/icons";

import { CLOUD_RUN_REGIONS } from "@src/constants/regions";

const REGIONS = sortBy(CLOUD_RUN_REGIONS, ["group", "value"]);

export interface ICloudRunRegionSelectProps {
  value: string;
  onChange: (value: string) => void;
  [key: string]: any;
}

export default function CloudRunRegionSelect({
  value,
  onChange,
  ...props
}: ICloudRunRegionSelectProps) {
  return (
    <MultiSelect
      multiple={false}
      label="Region"
      labelPlural="regions"
      {...props}
      value={value}
      onChange={onChange}
      options={REGIONS}
      clearable={false}
      itemRenderer={(option: any) => (
        <Grid container spacing={0} sx={{ my: 0.5 }}>
          <Grid item xs>
            {option.value}
          </Grid>
          <Grid item>{option.city}</Grid>

          <Grid item xs={12} style={{ padding: 0 }} />

          <Grid item xs sx={{ typography: "caption", color: "text.secondary" }}>
            Tier {option.pricingTier} pricing
          </Grid>
          {option.lowCO2 && (
            <Grid item sx={{ typography: "caption", color: "text.secondary" }}>
              Low CO₂&nbsp;
              <LeafIcon
                color="success"
                fontSize="inherit"
                style={{ verticalAlign: "middle" }}
              />
            </Grid>
          )}
        </Grid>
      )}
      {...({
        AutocompleteProps: { groupBy: (option: any) => option.group },
      } as any)}
    />
  );
}
