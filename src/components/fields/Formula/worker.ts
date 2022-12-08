import { ContentSaveCogOutline } from "mdi-material-ui";

onmessage = async ({ data }) => {
  try {
    const { formulaFn, row } = data;
    console.dir(row);
    const AsyncFunction = (async (x: any) => x).constructor as any;
    // eslint-disable-next-line no-new-func
    // const result = await new AsyncFunction("row", formulaFn)(row);
    const fn = new AsyncFunction("row", formulaFn);
    const result = await fn(row);
    console.log(result);
    postMessage({ result });
  } catch (error: any) {
    console.error("error: ", error);
    postMessage({ error: new Error(error) });
  } finally {
    // eslint-disable-next-line no-restricted-globals
    self.close();
  }
};

export {};
