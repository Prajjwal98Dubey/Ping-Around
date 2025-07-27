import { useState } from "react";
import { CacheColorContext } from "./all.context.js";

function CacheColorContextProvider({ children }) {
  const [cacheUserColor, setCacheUserColor] = useState({});
  return (
    <CacheColorContext.Provider value={{ cacheUserColor, setCacheUserColor }}>
      {children}
    </CacheColorContext.Provider>
  );
}

export default CacheColorContextProvider;
