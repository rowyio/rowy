const values = [true, false, undefined, null, "string"];
const randIndx = Math.floor(Math.random() * 6);
values.push(Math.random() * 100);
console.log(values, values[randIndx], randIndx);
