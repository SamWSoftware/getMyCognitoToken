import { useState } from "react";

export const useLocalState = <T = any>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void] => {
  const fromLocal = window?.localStorage.getItem(key);
  const localValue = isJsonString(fromLocal)
    ? JSON.parse(fromLocal)
    : fromLocal;
  const [value, setValue] = useState<T>(localValue || defaultValue);

  const setLocalValue = (newValue: T) => {
    const valueToSet =
      typeof newValue == "string" ? newValue : JSON.stringify(newValue);
    window?.localStorage.setItem(key, valueToSet);
    setValue(newValue);
  };

  return [value, setLocalValue];
};

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
