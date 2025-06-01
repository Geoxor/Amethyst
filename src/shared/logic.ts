export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const removeEmptyObjects = (obj: Record<string, any>): Record<string, any> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const cleaned = removeEmptyObjects(value);
      if (Object.keys(cleaned).length > 0) {
        acc[key] = cleaned;
      }
    }
    else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
};
