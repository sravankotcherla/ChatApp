import AsyncStorge from "@react-native-async-storage/async-storage";

export const setAsyncStorageData = async (key: string, value: any) => {
  value = JSON.stringify(value);
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
    const rawVal = await AsyncStorge.getItem(key);
    return rawVal ? JSON.parse(rawVal) : rawVal;
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
