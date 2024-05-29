import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchPostJson } from "../utils/api";

interface Attribute {
  full_name: string;
  name: string;
  unit: string | null;
}

interface AttributesContextInterface {
  attributes: Attribute[];
}

const AttributesContext = createContext<AttributesContextInterface>({
  attributes: undefined,
});

interface AttributesResponse {
  attributes: { [key: string]: Attribute };
}

interface AttributesContextProviderProps {
  category: string;
  children: React.ReactNode;
}

export function AttributesContextProvider({ category, children }: AttributesContextProviderProps) {
  const [attributes, setAttributes] = useState<{ [key: string]: Attribute }>(undefined);
  const [importantAttributes] = useState<number[]>([0, 1, 12, 36, 27]);

  useEffect(() => {
    if (attributes === undefined) {
      fetchPostJson<AttributesResponse>("attributes", {}, { category_name: category })
        .then((response) => {
          setAttributes(response.attributes);
        })
        .catch((e) => console.error(e));
    }
  }, []);

  return (
    <AttributesContext.Provider
      value={{
        attributes: attributes
          ? importantAttributes.map((attributeIndex) => attributes[`${attributeIndex}`])
          : undefined,
      }}
    >
      {children}
    </AttributesContext.Provider>
  );
}

export const useAttributes = () => useContext(AttributesContext);
