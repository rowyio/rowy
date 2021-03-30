export const dependencies = {};
  const task = async (args) => {
    const { promises } = args;
   const result =  await Promise.allSettled(Array.isArray(promises)?promises:[promises])
    return result
  };
  export default task;