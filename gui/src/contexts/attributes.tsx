import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchJson, updateAttributesState } from "../utils/api";
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
 * @param {AttributesContextProviderProps} props
 * @param {string} props.category the name of the category
 * @param {React.ReactNode} props.children the children (react node) to be wrapped into this provider
 * @constructor
 */
export function AttributesContextProvider({ category, children }: AttributesContextProviderProps) {
  const [attributes, setAttributes] = useState<{ [key: string]: Attribute }>(undefined);
  const [importantAttributes, setImportantAttributes] = useState<string[]>([
    PRICE, // Set price as an important attribute by default
  ]);

  /**
   * Adds an attribute to important attributes.
   *
   * @param {string} attribute the name of the attribute to be added to important attributes
   */
  const addAttribute = (attribute: string) => {
    setImportantAttributes((prevState) => {
      const nextState = [...prevState, attribute];
      updateAttributesState(nextState);
      return nextState;
    });
  };

  /**
   * Removes an attribute from important attributes.
   *
   * @param {string} attribute the name of the attribute to be removed from important attributes
   */
  const removeAttribute = (attribute: string) => {
    setImportantAttributes((prevState) => {
      const nextState = prevState.filter((attr) => attr !== attribute);
      updateAttributesState(nextState);
      return nextState;
    });
  };

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

  // Render nothing if attributes are not defined
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
        addAttribute,
        removeAttribute,
      }}
    >
      {children}
    </AttributesContext.Provider>
  );
}

export const useAttributes = () => useContext(AttributesContext);
