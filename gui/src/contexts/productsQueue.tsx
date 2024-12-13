import React, { createContext, useContext } from "react";

interface ProductsQueueContextInterface {
  queuedCandidates: number[];
  queuedDiscarded: number[];
  onQueueCandidate: (productId: number) => void;
  onQueueDiscarded: (productId: number) => void;
  apply: () => void;
}

const ProductsQueueContext = createContext<ProductsQueueContextInterface>({
  queuedCandidates: undefined,
  queuedDiscarded: undefined,
  onQueueCandidate: undefined,
  onQueueDiscarded: undefined,
  apply: undefined,
});

interface ProductsQueueContextProviderProps extends ProductsQueueContextInterface {
  children: React.ReactNode;
}

export function ProductsQueueContextProvider({
  queuedCandidates,
  queuedDiscarded,
  onQueueCandidate,
  onQueueDiscarded,
  apply,
  children,
}: ProductsQueueContextProviderProps) {
  return (
    <ProductsQueueContext.Provider
      value={{
        queuedCandidates,
        queuedDiscarded,
        onQueueCandidate,
        onQueueDiscarded,
        apply,
      }}
    >
      {children}
    </ProductsQueueContext.Provider>
  );
}

export const useProductsQueue = () => useContext(ProductsQueueContext);
