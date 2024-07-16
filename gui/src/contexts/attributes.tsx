import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchPostJson } from "../utils/api";
import { Attribute, PRICE } from "../types/attribute";

interface AttributesContextInterface {
  groups: string[];
  attributes: Attribute[];
  attributeNames: string[];
  price: Attribute;
  restAttributes: Attribute[];
  addAttribute: (attribute: string) => void;
  removeAttribute: (attribute: string) => void;
}

const AttributesContext = createContext<AttributesContextInterface>({
  groups: undefined,
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

/**
 * This component wraps its children into context providing all information regarding the attributes.
 *
 * @param category the name of the category
 * @param children the children (react node) to be wrapped into this provider
 * @constructor
 */
export function AttributesContextProvider({ category, children }: AttributesContextProviderProps) {
  const [attributes, setAttributes] = useState<{ [key: string]: Attribute }>(undefined);
  const [importantAttributes, setImportantAttributes] = useState<string[]>([]);

  useEffect(() => {
    if (attributes === undefined) {
      fetchPostJson<AttributesResponse>("attributes", {}, { category_name: category })
        .then((response) => {
          setAttributes(response.attributes);
        })
        .catch((e) => console.error(e));
    }
  }, []);

  if (attributes === undefined) {
    return null;
  }

  const allGroups = attributes
    ? Object.values(attributes)
        .map((attributes) => attributes.group)
        .filter((group) => group !== null)
        .sort()
    : undefined;

  return (
    <AttributesContext.Provider
      value={{
        groups: allGroups ? allGroups.filter((group, index) => allGroups.indexOf(group) === index) : undefined,
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
