import { useState, useEffect, Dispatch, SetStateAction } from "react";

type SetValue<T> = Dispatch<SetStateAction<T>>;

export function getStorageValue<T>(key: string, initialValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`Error getting item "${key}" from local storage:`, error);
    return initialValue;
  }
}

export function setStorageValue<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item "${key}" in local storage:`, error);
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>] {
  // Initialize state with the value from local storage, if it exists
  const [value, setValue] = useState<T>(() =>
    getStorageValue(key, initialValue)
  );

  console.log({ initialValue });

  // Listen for changes to the key prop and update the state and local storage
  useEffect(() => {
    const newValue = getStorageValue(key, initialValue);
    setValue(newValue);
  }, [key]);

  // Update local storage whenever the state changes
  useEffect(() => {
    setStorageValue(key, value);
    // should not update if switching the key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [value, setValue];
}
