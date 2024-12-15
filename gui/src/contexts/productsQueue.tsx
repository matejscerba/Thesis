import React, { createContext, useContext } from "react";

/**
 * Represents the products queue context interface.
 */
interface ProductsQueueContextInterface {
  /**
   * Candidates queue. These product IDs will be added to Candidates once the queue is applied.
   */
  queuedCandidates: number[];

  /**
   * Discarded products queue. These product IDs will be added to Discarded products once the queue is applied.
   */
  queuedDiscarded: number[];

  /**
   * Adds a given product to the Candidates queue.
   *
   * @param {number} productId the ID of a product to be added to candidate queue
   */
  onQueueCandidate: (productId: number) => void;

  /**
   * Adds a given product to the Discarded products queue.
   *
   * @param {number} productId the ID of a product to be added to discarded queue
   */
  onQueueDiscarded: (productId: number) => void;

  /**
   * Applies the queue.
   */
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

/**
 * This component wraps its children into context providing all information regarding the queue of products.
 *
 * @param {ProductsQueueContextProviderProps} props
 * @param {number[]} props.queuedCandidates candidates queue
 * @param {number[]} props.queuedDiscarded discarded queue
 * @param {(productId: number) => void} props.onQueueCandidate action to be performed when adding product to the Candidates queue
 * @param {(productId: number) => void} props.onQueueDiscarded action to be performed when adding product to the Discarded products queue
 * @param {() => void} props.apply action to be performed when applying the queue
 * @param {React.ReactNode} props.children the children (react node) to be wrapped into this provider
 * @constructor
 */
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
