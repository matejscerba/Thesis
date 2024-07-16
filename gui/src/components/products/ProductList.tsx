import React, { useEffect, useState } from "react";
import { fetchPostJson } from "../../utils/api";
import { Product, ProductGroupType } from "../../types/product";
import { useAttributes } from "../../contexts/attributes";
import { UnseenStatistics } from "../../types/statistics";
import { useModal } from "../../contexts/modal";
import ProductsGroup from "../groups/ProductsGroup";
import { CategoryContextProvider } from "../../contexts/category";
import Candidates from "../groups/Candidates";
import Unseen from "../groups/Unseen";
import Alternatives from "../groups/Alternatives";
import Discarded from "../groups/Discarded";
import { Modal } from "react-bootstrap";
import Typography from "@mui/material/Typography";

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
  const { show, modalBody, hideModal } = useModal();

  const [limit, setLimit] = useState<number>(PAGE_SIZE);
  const [data, setData] = useState<ProductListResponse>(undefined);
  const [candidates, setCandidates] = useState<number[]>([]);
  const [discarded, setDiscarded] = useState<number[]>([]);

  useEffect(() => {
    // Load the category contents as soon as candidates, discarded, limit or important attributes change - the
    // organization of the product will likely change
    fetchPostJson<ProductListResponse>(
      "category",
      { candidates, discarded, important_attributes: attributeNames, limit },
      { category_name: name },
    )
      .then((category) => {
        setData(category);
      })
      .catch((e) => console.error(e));
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

  if (!data) {
    return <pre>Loading...</pre>;
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
        {data.organized ? (
          <>
            <div className="mb-3">
              <Candidates />
            </div>
            <div className="mb-3">
              <Unseen />
            </div>
            <div className="mb-3">
              <Alternatives />
            </div>
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
        <Modal show={show} onHide={hideModal} className="category-modal">
          <Modal.Header closeButton />
          <Modal.Body>{modalBody}</Modal.Body>
        </Modal>
      </CategoryContextProvider>
    </div>
  );
}

export default ProductList;
