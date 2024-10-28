import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchJson } from "../utils/api";
import { Attribute, PRICE } from "../types/attribute";

/**
 * Represents the attributes context interface.
 */
interface AttributesContextInterface {
  /**
   * Names of the attribute groups.
   */
  groups: string[];

  /**
   * All attributes of the given category.
   */
  attributes: Attribute[];

  /**
   * Names of the important attributes.
   */
  attributeNames: string[];

  /**
   * Price attribute.
   */
  price: Attribute;

  /**
   * Attributes that are not important and not Price.
   */
  restAttributes: Attribute[];

  /**
   * Adds attribute to important.
   *
   * @param {string} attribute the name of the attribute to be added to important attributes
   */
  addAttribute: (attribute: string) => void;

  /**
   * Removes attribute from important.
   *
   * @param {string} attribute the name of the attribute to be removed from important attributes
   */
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
 * @param {string} category the name of the category
 * @param {React.ReactNode} children the children (react node) to be wrapped into this provider
 * @constructor
 */
export function AttributesContextProvider({ category, children }: AttributesContextProviderProps) {
  const [attributes, setAttributes] = useState<{ [key: string]: Attribute }>(undefined);
  const [importantAttributes, setImportantAttributes] = useState<string[]>([
    "SSD capacity [GB]",
    'Display size ["]',
    "Size of operational RAM [GB]",
    "Number of processor cores",
    "Weight [kg]",
  ]);

  useEffect(() => {
    // Fetch attributes if no attributes have been fetched before
    if (attributes === undefined) {
      fetchJson<AttributesResponse>("attributes", { category_name: category })
        .then((response) => {
          setAttributes(response.attributes);
        })
        .catch((e) => console.error(e));
    }
  }, []);

  if (attributes === undefined) {
    return null;
  }

  // Get names of groups of all attributes
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
