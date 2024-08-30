import AsyncStorge from "@react-native-async-storage/async-storage";

export const setAsyncStorageData = async (
  key: string,
  value: string | { [key: string]: string }
) => {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }
  try {
    await AsyncStorge.setItem(key, value);
  } catch (err) {
    console.log(err);
  }
};

export const getAsyncStorageData = async (
  key: string
): Promise<string | null> => {
  try {
    return await AsyncStorge.getItem(key);
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const clearAsyncStorage = async (): Promise<void> => {
  try {
    await AsyncStorge.clear();
  } catch (err) {
    console.log("Error while clearing AsyncStorate ", err);
  }
};
