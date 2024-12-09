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
import StoppingCriteriaWrapper from "../groups/StoppingCriteriaWrapper";
import StoppingCriteriaTitleWrapper from "../groups/StoppingCriteriaTitleWrapper";
import { useParams } from "react-router-dom";

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
 * @param {string} name then name of the category
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
   * Moves product of given id to the discarded set.
   *
   * @param {number} id id of the product to discard
   */
  const onDiscard = (id: number) => {
    if (candidates.includes(id)) {
      setCandidates((prevState) => prevState.filter((candidate) => candidate !== id));
    }
    setDiscarded((prevState) => [...prevState, id]);
  };

  /**
   * Moves product of given id to the candidates set.
   *
   * @param {number} id id of the product to move to candidates
   */
  const onMarkCandidate = (id: number) => {
    if (discarded.includes(id)) {
      setDiscarded((prevState) => prevState.filter((discarded) => discarded !== id));
    }
    setCandidates((prevState) => [...prevState, id]);
  };

  if (!data || loading) {
    if (candidates.length > 0) {
      return (
        <>
          <CategorySkeleton title={<CandidatesTitle />} numItems={candidates.length} />
          <CategorySkeleton title={<StoppingCriteriaTitleWrapper />} />
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
              <StoppingCriteriaWrapper />
              <Alternatives />
            </>
          ) : (
            <>
              <ProductsGroup products={data.products} groupType={ProductGroupType.UNSEEN} />
              {(data.remaining ?? 0) > 0 && (
                <div style={{ textAlign: "center" }}>
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
    </div>
  );
}

export default ProductList;
