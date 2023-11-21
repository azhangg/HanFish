export const clearObject = (raw: object, config?: { numberTo?: any }) => {
  const ignoreKeys = ["isTrusted", "_vts", "pointerId"];
  for (const key in raw) {
    if (ignoreKeys.includes(key)) return;
    const type = typeof raw[key];
    switch (type) {
      case "string":
        raw[key] = "";
        break;
      case "number":
        raw[key] = config?.numberTo ?? 0;
        break;
      case "object":
        if (Array.isArray(raw[key])) raw[key] = [];
        else if (raw[key] == null) return;
        else clearObject(raw[key], config);
        break;
      default:
        break;
    }
  }
  return raw;
};
