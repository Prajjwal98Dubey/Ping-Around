import { use, useEffect } from "react";
import { CacheColorContext } from "../context/all.context.js";
import { randomColorGenerator } from "../helpers/user.helper";

export function useUserImageColor({ userId }) {
  const { cacheUserColor, setCacheUserColor } = use(CacheColorContext);

  useEffect(() => {
    if (!cacheUserColor[userId]) {
      setCacheUserColor({
        ...cacheUserColor,
        [userId]: randomColorGenerator(),
      });
    }
  }, [userId]);
  return;
}
