import React, { createContext, useContext } from "react";
import { Product } from "../types/product";
import { UnseenStatistics } from "../types/statistics";

/**
 * Represents the category context interface.
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
   * Discards products.
   *
   * @param {number[]} ids ids of the products to be discarded
   */
  onDiscard: (ids: number[]) => void;

  /**
   * Marks products as candidates.
   *
   * @param {number[]} ids ids of the products to be marked as candidates
   */
  onMarkCandidate: (ids: number[]) => void;
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
 * @param {CategoryContextProviderProps} props
 * @param {string} props.name the name of the category
 * @param {Product[]} props.candidates the candidate products
 * @param {number[]} props.discarded the ids of the discarded products
 * @param {Product[]} props.alternatives the alternative products
 * @param {UnseenStatistics} props.unseen the statistics describing not yet seen products
 * @param {React.ReactNode} props.children the children (react node) to be wrapped into this provider
 * @param {(ids: number[]) => void} props.onDiscard the method of discarding products
 * @param {(ids: number[]) => void} props.onMarkCandidate the method of moving products to candidates
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
