import { trim, trimEnd } from "lodash-es";

/**
 * Multiply a number by 100 and return a string without floating point error
 * by shifting the decimal point 2 places to the right as a string
 * e.g. floating point error: 0.07 * 100 === 7.000000000000001
 *
 * A few examples:
 *
 * let number = 0.07;
 * console.log(number, multiply100WithPrecision(number));
 * --> 7
 *
 * number = 0;
 * console.log(number, multiply100WithPrecision(number));
 * --> 0
 *
 * number = 0.1;
 * console.log(number, multiply100WithPrecision(number));
 * --> 10
 *
 * number = 0.001;
 * console.log(number, multiply100WithPrecision(number));
 * --> 0.1
 *
 * number = 0.00001;
 * console.log(number, multiply100WithPrecision(number));
 * --> 0.001
 *
 * number = 100;
 * console.log(number, multiply100WithPrecision(number));
 * --> 10000
 *
 * number = 1999.99;
 * console.log(number, multiply100WithPrecision(number));
 * --> 199999
 *
 * number = 1999.999;
 * console.log(number, multiply100WithPrecision(number));
 * --> 199999.9
 *
 * number = 0.25;
 * console.log(number, multiply100WithPrecision(number));
 * --> 25
 *
 * number = 0.15;
 * console.log(number, multiply100WithPrecision(number));
 * --> 15
 *
 * number = 1.23456789;
 * console.log(number, multiply100WithPrecision(number));
 * --> 123.456789
 *
 * number = 0.0000000001;
 * console.log(number, multiply100WithPrecision(number));
 * --> 1e-8
 */
export const multiply100WithPrecision = (value: number) => {
  if (value === 0) {
    return 0;
  }

  let valueString = value.toString();

  // e.g 1e-10 becomes 1e-8
  if (valueString.includes("e")) {
    return value * 100;
  }

  // if the number is integer, add .00
  if (!valueString.includes(".")) {
    valueString = valueString.concat(".00");
  }

  let [before, after] = valueString.split(".");

  // if after decimal has only 1 digit, pad a 0
  if (after.length === 1) {
    after = after.concat("0");
  }

  let newNumber = `${before}${after.slice(0, 2)}.${after.slice(2)}`;
  newNumber = trimEnd(trim(newNumber, "0"), ".");
  if (newNumber.startsWith(".")) {
    newNumber = "0" + newNumber;
  }
  return Number(newNumber);
};

/**
 * Divide a number by 100 and return a string without floating point error
 * by shifting the decimal point 2 places to the left as a string
 */
export const divide100WithPrecision = (value: number) => {
  if (value === 0) {
    return 0;
  }

  let valueString = value.toString();

  // e.g 1e-10 becomes 1e-8
  if (valueString.includes("e")) {
    return value / 100;
  }

  // add decimal if integer
  if (!valueString.includes(".")) {
    valueString = valueString + ".";
  }

  let [before, after] = valueString.split(".");

  // if before decimal has less than digit, pad 0
  if (before.length < 2) {
    before = "00" + before;
  }

  let newNumber = `${before.slice(0, before.length - 2)}.${before.slice(
    before.length - 2
  )}${after}`;
  newNumber = trimEnd(trimEnd(newNumber, "0"), ".");
  if (newNumber.startsWith(".")) {
    newNumber = "0" + newNumber;
  }
  return Number(newNumber);
};
