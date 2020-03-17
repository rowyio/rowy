import React, { useState, useEffect } from "react";
import useAlgolia from "hooks/useAlgolia";
import { createStyles, makeStyles } from "@material-ui/core";

import MultiSelect from "components/MultiSelect";
const useStyles = makeStyles(theme =>
  createStyles({
    root: { minWidth: 200 },
  })
);

const AlgoliaSelect = (props: any) => {
  const {
    algoliaIndex,
    algoliaKey,
    valueReducer,
    labelReducer,
    filters,
  } = props;
  const [searchState, searchDispatch] = useAlgolia(
    algoliaIndex,
    algoliaKey,
    filters
  );

  console.log(filters);
  const [options, setOptions] = useState<any[]>([]);
  useEffect(() => {
    if (Array.isArray(searchState.results?.hits)) {
      const newOptions = searchState.results?.hits.map((hit: any) => {
        delete hit._highlightResult;
        return {
          label: labelReducer(hit),
          value: valueReducer(hit),
        };
      });
      setOptions(newOptions);
    }
  }, [searchState]);

  return (
    <MultiSelect
      options={options}
      {...props}
      searchable={options.length > 10} //shows type to filter after 10 options
    />
  );
};

export default AlgoliaSelect;
