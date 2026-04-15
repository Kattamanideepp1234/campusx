export const generateId = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
