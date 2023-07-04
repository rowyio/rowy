export const URL =
  window.location.protocol +
  "//" +
  window.location.host +
  window.location.pathname;
export function separateOperands(str: string): {
  operators: any[];
  operands: string[];
} {
  const operators = findOperators(str);
  const operands = str.split(
    new RegExp(operators.map((op) => `\\${op}`).join("|"), "g")
  );
  return { operators, operands };
}
export function changePageUrl(newURL: string | undefined = URL) {
  if (newURL !== URL) {
    newURL = URL + newURL;
  }
  window.history.pushState({ path: newURL }, "", newURL);
}

function findOperators(str: string) {
  const operators = [">=", "<=", ">", "<", "==", "!=", "=", "-is-"];
  const regex = new RegExp(operators.map((op) => `\\${op}`).join("|"), "g");
  return str.match(regex) || [];
}
