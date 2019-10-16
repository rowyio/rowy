/**
 * reposition an element in an array
 * @param arr array
 * @param old_index index of element to be moved
 * @param new_index new position of the moved element
 */
export const arrayMover = (
  arr: any[],
  old_index: number,
  new_index: number
) => {
  while (old_index < 0) {
    old_index += arr.length;
  }
  while (new_index < 0) {
    new_index += arr.length;
  }
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing purposes
};
