import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchPostJson } from "../utils/api";
import { Attribute, PRICE } from "../types/attribute";

interface AttributesContextInterface {
  attributes: Attribute[];
  attributeNames: string[];
  price: Attribute;
  restAttributes: Attribute[];
  addAttribute: (attribute: string) => void;
  removeAttribute: (attribute: string) => void;
}

const AttributesContext = createContext<AttributesContextInterface>({
  attributes: undefined,
  attributeNames: undefined,
  price: undefined,
  restAttributes: undefined,
  addAttribute: undefined,
  removeAttribute: undefined,
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
  const [importantAttributes, setImportantAttributes] = useState<string[]>([
    "Number of processor cores",
    "Size of operational RAM [GB]",
    "Model graphics cards",
    "Storage capacity [GB]",
  ]);

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
        attributes: attributes ? importantAttributes.map((attributeName) => attributes[attributeName]) : undefined,
        attributeNames: importantAttributes,
        price: attributes?.[PRICE],
        restAttributes: Object.values(attributes ?? {})
          .filter((attr) => !importantAttributes.includes(attr.full_name) && attr.full_name !== PRICE)
          .sort(),
        addAttribute: (attribute) => {
          setImportantAttributes((prevState) => [...prevState, attribute]);
        },
        removeAttribute: (attribute) => {
          setImportantAttributes((prevState) => prevState.filter((attr) => attr !== attribute));
        },
      }}
    >
      {children}
    </AttributesContext.Provider>
  );
}

export const useAttributes = () => useContext(AttributesContext);
