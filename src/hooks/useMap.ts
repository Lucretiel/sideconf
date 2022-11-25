import { useState, useCallback } from "react";

type MapActions<K, V> = {
  set: (key: K, value: V | undefined) => void;
  update: (key: K, update: (value: V | undefined) => V | undefined) => void;
  clear: () => void;
};

const useMap = <K, V>(): [Map<K, V>, MapActions<K, V>] => {
  const [map, updateMap] = useState<Map<K, V>>(new Map());

  const update = useCallback(
    (key: K, update: (value: V | undefined) => V | undefined) =>
      updateMap((map) => {
        const oldValue = map.get(key);
        const newValue = update(oldValue);

        if (oldValue === newValue) return map;

        const newMap = new Map(map);
        if (newValue === undefined) newMap.delete(key);
        else newMap.set(key, newValue);

        return newMap;
      }),
    []
  );

  const set = useCallback(
    (key: K, value: V | undefined) => update(key, () => value),
    []
  );

  const clear = useCallback(() => {
    updateMap((map) => (map.size === 0 ? map : new Map()));
  }, []);

  return [map, { set, update, clear }];
};

export default useMap;
