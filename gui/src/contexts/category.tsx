import React, { createContext, useContext } from "react";
import { Product } from "../types/product";
import { UnseenStatistics } from "../types/statistics";

interface CategoryContextInterface {
  name: string;
  candidates: Product[];
  candidateIds: number[];
  discarded: number[];
  alternatives: Product[];
  unseen: UnseenStatistics;
  onDiscard: (id: number) => void;
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
