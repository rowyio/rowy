/**
 * Analytics is disabled on Rowy open source.
 */
import type { logEvent as logEventFunction } from "firebase/analytics";
export const analytics = {} as any;
export const logEvent = (() => {}) as typeof logEventFunction;
