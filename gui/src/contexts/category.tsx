import React, { createContext, useContext } from "react";
import { Product } from "../types/product";
import { UnseenStatistics } from "../types/statistics";

/**
 * Represents the category context inteface.
 */
interface CategoryContextInterface {
  /**
   * The name of the category.
   */
  name: string;

  /**
   * The candidate products.
   */
  candidates: Product[];

  /**
   * The candidate product ids.
   */
  candidateIds: number[];

  /**
   * The discarded product ids.
   */
  discarded: number[];

  /**
   * The alternative product ids.
   */
  alternatives: Product[];

  /**
   * The statistics of the unseen products.
   */
  unseen: UnseenStatistics;

  /**
   * Discards a product.
   *
   * @param {number} id id of the product to be discarded
   */
  onDiscard: (id: number) => void;

  /**
   * Marks a product as candidate.
   *
   * @param {number} id id of the product to be marked as candidate
   */
  onMarkCandidate: (id: number) => void;
}

const CategoryContext = createContext<CategoryContextInterface>({
  name: undefined,
  candidates: undefined,
  candidateIds: undefined,
  discarded: undefined,
  alternatives: undefined,
  unseen: undefined,
  onDiscard: undefined,
  onMarkCandidate: undefined,
});

interface CategoryContextProviderProps extends CategoryContextInterface {
  children: React.ReactNode;
}

/**
 * This component wraps its children into context providing all information regarding the category and its organization.
 *
 * @param {string} name the name of the category
 * @param {Product[]} candidates the candidate products
 * @param {number[]} discarded the ids of the discarded products
 * @param {Product[]} alternatives the alternative products
 * @param {UnseenStatistics} unseen the statistics describing the not yet seen products
 * @param {React.ReactNode} children the children (react node) to be wrapped into this provider
 * @param {function(number): void} onDiscard the method of discarding product
 * @param {function(number): void} onMarkCandidate the method of moving product to candidates
 * @constructor
 */
export function CategoryContextProvider({
  name,
  candidates,
  discarded,
  alternatives,
  unseen,
  children,
  onDiscard,
  onMarkCandidate,
}: CategoryContextProviderProps) {
  return (
    <CategoryContext.Provider
      value={{
        name,
        candidates,
        candidateIds: candidates?.map((candidate) => candidate.id),
        discarded,
        alternatives,
        unseen,
        onDiscard,
        onMarkCandidate,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategory = () => useContext(CategoryContext);
