import React, { useEffect, useState } from "react";
import { fetchPostJson } from "../../utils/api";
import { Product, ProductGroupType } from "../../types/product";
import { useAttributes } from "../../contexts/attributes";
import { UnseenStatistics } from "../../types/statistics";
import { ModalContextProvider } from "../../contexts/modal";
import ProductsGroup from "../groups/ProductsGroup";
import { CategoryContextProvider } from "../../contexts/category";
import Candidates, { CandidatesTitle } from "../groups/Candidates";
import Alternatives, { AlternativesTitle } from "../groups/Alternatives";
import Discarded, { DiscardedTitle } from "../groups/Discarded";
import Typography from "@mui/material/Typography";
import CategoryModal from "../CategoryModal";
import CategorySkeleton from "../CategorySkeleton";
import UITypeContent from "../groups/UITypeContent";
import UITypeTitle from "../groups/UITypeTitle";
import { useParams } from "react-router-dom";
import { ProductsQueueContextProvider } from "../../contexts/productsQueue";

/**
 * The default size of page
 */
const PAGE_SIZE = 20;

interface ProductListResponse {
  organized: boolean;
  products?: Product[];
  candidates?: Product[];
  alternatives?: Product[];
  unseen?: UnseenStatistics;
  remaining?: number;
}

interface ProductListProps {
  name: string;
}

/**
 * This component renders the contents of a category - its products.
 *
 * @param {ProductListProps} props
 * @param {string} props.name then name of the category
 * @constructor
 */
function ProductList({ name }: ProductListProps) {
  const { attributeNames } = useAttributes();
  const { step } = useParams();

  const [limit, setLimit] = useState<number>(PAGE_SIZE);
  const [data, setData] = useState<ProductListResponse>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [candidates, setCandidates] = useState<number[]>([]);
  const [discarded, setDiscarded] = useState<number[]>([]);
  const [queuedCandidates, setQueuedCandidates] = useState<number[]>([]);
  const [queuedDiscarded, setQueuedDiscarded] = useState<number[]>([]);

  useEffect(() => {
    setLoading(true);
    // Load the category contents as soon as candidates, discarded, limit or important attributes change - the
    // organization of the product will likely change
    const params = {
      category_name: name,
    };
    if (step !== undefined) {
      params["step"] = step;
    }
    fetchPostJson<ProductListResponse>(
      "category",
      { candidates, discarded, important_attributes: attributeNames, limit },
      params,
    )
      .then((category) => {
        setLoading(false);
        setData(category);
      })
      .catch((e) => {
        setLoading(false);
        console.error(e);
      });
  }, [candidates, discarded, limit, attributeNames]);

  /**
   * Moves products of given ids to the discarded set.
   *
   * @param {number[]} ids ids of the products to discard
   */
  const onDiscard = (ids: number[]) => {
    setCandidates((prevState) => prevState.filter((candidate) => !ids.includes(candidate)));
    setDiscarded((prevState) => [...prevState, ...ids]);
  };

  /**
   * Moves products of given ids to the candidates set.
   *
   * @param {number[]} ids ids of the products to move to candidates
   */
  const onMarkCandidate = (ids: number[]) => {
    setDiscarded((prevState) => prevState.filter((discarded) => !ids.includes(discarded)));
    setCandidates((prevState) => [...prevState, ...ids]);
  };

  // Render skeletons if data is not loaded yet
  if (!data || loading) {
    if (candidates.length > 0) {
      return (
        <>
          <CategorySkeleton title={<CandidatesTitle />} numItems={candidates.length} />
          <CategorySkeleton title={<UITypeTitle />} />
          <CategorySkeleton title={<AlternativesTitle />} numItems={10} />
          <CategorySkeleton title={<DiscardedTitle />} numItems={discarded.length} />
        </>
      );
    } else {
      return <CategorySkeleton numItems={PAGE_SIZE} />;
    }
  }

  return (
    <div>
      <ProductsQueueContextProvider
        queuedCandidates={queuedCandidates}
        queuedDiscarded={queuedDiscarded}
        onQueueCandidate={(productId) => {
          setQueuedDiscarded((prevState) => prevState.filter((discarded) => discarded !== productId));
          setQueuedCandidates((prevState) => [...prevState.filter((candidate) => candidate !== productId), productId]);
        }}
        onQueueDiscarded={(productId) => {
          setQueuedCandidates((prevState) => prevState.filter((candidate) => candidate !== productId));
          setQueuedDiscarded((prevState) => [...prevState.filter((discarded) => discarded !== productId), productId]);
        }}
        apply={() => {
          onMarkCandidate(queuedCandidates);
          onDiscard(queuedDiscarded);
        }}
      >
        <CategoryContextProvider
          name={name}
          candidates={data.candidates}
          candidateIds={candidates}
          discarded={discarded}
          alternatives={data.alternatives}
          unseen={data.unseen}
          onDiscard={onDiscard}
          onMarkCandidate={onMarkCandidate}
        >
          <ModalContextProvider>
            {data.organized ? (
              <>
                <Candidates />
                <UITypeContent />
                <Alternatives />
              </>
            ) : (
              <>
                <ProductsGroup products={data.products} groupType={ProductGroupType.UNSEEN} />
                {(data.remaining ?? 0) > 0 && (
                  <div className="text-center">
                    <Typography variant="body1">
                      Showing {limit} of {limit + data.remaining} products
                    </Typography>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setLimit((prevState) => prevState + PAGE_SIZE);
                      }}
                    >
                      Show {Math.min(PAGE_SIZE, data.remaining)} more products...
                    </button>
                  </div>
                )}
              </>
            )}
            <div className="mb-3">
              <Discarded />
            </div>
            <CategoryModal />
          </ModalContextProvider>
        </CategoryContextProvider>
      </ProductsQueueContextProvider>
    </div>
  );
}

export default ProductList;
