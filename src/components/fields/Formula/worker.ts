onmessage = ({ data }) => {
  try {
    const { formulaFn, fields } = data;
    // eslint-disable-next-line no-new-func
    const result = new Function(...Object.keys(fields), formulaFn).call(
      {},
      ...Object.values(fields)
    );
    postMessage({ result });
  } catch (error: any) {
    console.error(error);
    postMessage({ error: new Error(error) });
  } finally {
    // eslint-disable-next-line no-restricted-globals
    self.close();
  }
};

export {};
