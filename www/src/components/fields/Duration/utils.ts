export const getDurationString = (start: Date, end: Date) => {
  let distance = Math.abs(end.getTime() - start.getTime());
  const hours = Math.floor(distance / 3600000);
  distance -= hours * 3600000;
  const minutes = Math.floor(distance / 60000);
  distance -= minutes * 60000;
  const seconds = Math.floor(distance / 1000);

  return `${hours ? `${hours}h` : ""} ${("0" + minutes).slice(-2)}m ${(
    "0" + seconds
  ).slice(-2)}s`;
};
