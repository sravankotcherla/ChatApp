import { useEffect, useState } from "react";

export const useDebounce = (value: string | number, timeInterval: number) => {
  const [debouncedVal, setDebouncedVal] = useState<string | number>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedVal(value);
    }, timeInterval);

    return () => {
      clearTimeout(timer);
    };
  }, [value, timeInterval]);

  return debouncedVal;
};
