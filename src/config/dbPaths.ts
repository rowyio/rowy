export const CONFIG = "_rowy_" as const;

export const SETTINGS = `${CONFIG}/settings` as const;
export const PUBLIC_SETTINGS = `${CONFIG}/publicSettings` as const;

export const TABLE_SCHEMAS = `${SETTINGS}/schema` as const;
export const TABLE_GROUP_SCHEMAS = `${SETTINGS}/groupSchema` as const;

export const USER_MANAGEMENT = `${CONFIG}/userManagement` as const;
export const USERS = `${USER_MANAGEMENT}/users` as const;
