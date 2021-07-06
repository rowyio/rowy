import { Grid as MuiGrid } from "@material-ui/core";
import Card from "./Card";
import useAlgolia from "use-algolia";
import AlgoliaFilters from "./AlgoliaFilters";
import _get from "lodash/get";
const advisorsFilters = [
  { label: "Type", facet: "type" },
  { label: "Experience (Industry)", facet: "expertise" },
  { label: "Location", facet: "location" },
];

interface IGridProps {
  collection: string;
  filters: any[];
}
export const replacer = (data: any) => (m: string, key: string) => {
  const objKey = key.split(":")[0];
  const defaultValue = key.split(":")[1] || "";
  return _get(data, objKey, defaultValue);
};

const CARD_CONFIG = {
  title: `{{firstName}} {{lastName}}`,
  image: "{{profilePhoto[0].downloadURL}}",
  body: "{{bio}}",
};
export default function Grid({ collection, filters }: IGridProps) {
  const [algoliaState, requestDispatch, , setAlgoliaConfig] = useAlgolia(
    process.env.REACT_APP_ALGOLIA_APP_ID!,
    process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY!,
    collection,
    { hitsPerPage: 100 }
  );

  const isLoading = algoliaState.loading || !algoliaState.index;
  const noResults = algoliaState.hits.length === 0;
  const requiredFilters = ``;
  const isEmpty =
    noResults &&
    algoliaState.request?.query === undefined &&
    algoliaState.request?.filters === requiredFilters;
  return (
    <>
      {algoliaState.index && !isEmpty && (
        <AlgoliaFilters
          index={algoliaState.index}
          request={algoliaState.request}
          requestDispatch={requestDispatch}
          requiredFilters={requiredFilters}
          label={collection}
          filters={[]}
          search
        />
      )}
      <MuiGrid container spacing={4}>
        {" "}
        {algoliaState.hits.map((hit) => {
          return (
            <MuiGrid key={hit.objectID} item lg={4} md={6} xs={12}>
              {" "}
              <Card
                bodyContent={CARD_CONFIG.body.replace(
                  /\{\{(.*?)\}\}/g,
                  replacer(hit)
                )}
                title={CARD_CONFIG.title.replace(
                  /\{\{(.*?)\}\}/g,
                  replacer(hit)
                )}
                imageSource={CARD_CONFIG.image.replace(
                  /\{\{(.*?)\}\}/g,
                  replacer(hit)
                )}
              />{" "}
            </MuiGrid>
          );
        })}
      </MuiGrid>
    </>
  );
}
