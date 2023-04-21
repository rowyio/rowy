onmessage = async ({ data }) => {
  try {
    const { formulaFn, row, ref } = JSON.parse(data);
    const AsyncFunction = async function () {}.constructor as any;
    const [_, fnBody] = formulaFn.match(/=>\s*({?[\s\S]*}?)$/);
    if (!fnBody) return;
    const fn = new AsyncFunction(
      "row",
      "ref",
      `const fn = async () => \n${fnBody}\n return fn();`
    );
    const result = await fn(row, ref);
    postMessage({ result });
  } catch (error: any) {
    console.error("Error: ", error);
    postMessage({
      error,
    });
  } finally {
    // eslint-disable-next-line no-restricted-globals
    self.close();
  }
};

export {};
