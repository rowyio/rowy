import {
  getYear,
  getMonth,
  getDate,
  setSeconds,
  setMilliseconds,
  add,
} from "date-fns";

/**
 * Creates a time range for the date-range-equal filter.
 * Strips time to create start and end Date object.
 * @example
 * Input: 2020-01-01T19:03:22.000Z
 * Output: [2020-01-01T00:00:00.000Z, 2020-01-01T23:59:59.000Z]
 *
 * @param dateTime - Source date time
 * @returns `[startDate, endDate]` array
 */
export const getDateRange = (dateTime: Date) => {
  const startDate = new Date(
    getYear(dateTime),
    getMonth(dateTime),
    getDate(dateTime)
  );
  const endDate = add(startDate, { days: 1, seconds: -1 });
  return [startDate, endDate] as [Date, Date];
};

/**
 * Creates a time range for the time-minute-equal filter.
 * Strips seconds and milliseconds to create start and end Date object.
 * @example
 * Input: 2020-01-01T19:03:22.000Z
 * Output: [2020-01-01T19:03:00.000Z, 2020-01-01T19:03:59.000Z]
 *
 * @param dateTime - Source date time
 * @returns `[startDate, endDate]` array
 */
export const getTimeRange = (dateTime: Date) => {
  const startDate = setSeconds(setMilliseconds(dateTime, 0), 0);
  const endDate = add(startDate, { minutes: 1, seconds: -1 });
  return [startDate, endDate] as [Date, Date];
};
