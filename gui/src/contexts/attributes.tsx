import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchPostJson } from "../utils/api";
import { Attribute } from "../types/attribute";

interface AttributesContextInterface {
  attributes: Attribute[];
  attributeIds: number[];
}

const AttributesContext = createContext<AttributesContextInterface>({
  attributes: undefined,
  attributeIds: undefined,
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
  const [importantAttributes] = useState<number[]>([11, 17, 24, 29]);

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
        attributeIds: importantAttributes,
      }}
    >
      {children}
    </AttributesContext.Provider>
  );
}

export const useAttributes = () => useContext(AttributesContext);
