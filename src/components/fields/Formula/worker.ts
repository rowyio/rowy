onmessage = async ({ data }) => {
  try {
    const { formulaFn, row } = data;
    const AsyncFunction = async function () {}.constructor as any;
    const fn = new AsyncFunction("row", formulaFn);
    const result = await fn(row);
    postMessage({ result });
  } catch (error: any) {
    console.error("error: ", error);
    postMessage({
      error: new Error("Something went wrong. Check console logs."),
    });
  } finally {
    // eslint-disable-next-line no-restricted-globals
    self.close();
  }
};

export {};
