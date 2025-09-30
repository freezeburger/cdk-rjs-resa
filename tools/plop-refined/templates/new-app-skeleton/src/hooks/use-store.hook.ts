/* import { store } from "@/store";
import { useEffect, useState } from "react";

export const useStore = () => {
  const [ data , setData] = useState(store.get());

  useEffect(() => {
    const unsubscribe = store.subscribe(setData);
    return unsubscribe;
  }, []);

  return { data, act: store.act.bind(store) };
} */