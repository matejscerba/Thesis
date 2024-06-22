import React, { useEffect, useState } from "react";
import { fetchPostJson } from "../../utils/api";
import { Product } from "../../types/product";
import Candidates from "../groups/Candidates";
import Alternatives from "../groups/Alternatives";
import Discarded from "../groups/Discarded";
import { useAttributes } from "../../contexts/attributes";
import Unseen from "../groups/Unseen";
import { CategoryContextProvider } from "../../contexts/category";
import { UnseenStatistics } from "../../types/statistics";
import { Modal } from "react-bootstrap";
import { useModal } from "../../contexts/modal";

interface ProductListResponse {
  organized: boolean;
  products?: Product[];
  candidates?: Product[];
  alternatives?: Product[];
  unseen?: UnseenStatistics;
}

interface ProductListProps {
  name: string;
}

function ProductList({ name }: ProductListProps) {
  const { attributeNames } = useAttributes();
  const { show, modalBody, hideModal } = useModal();

  const [data, setData] = useState<ProductListResponse>(undefined);
  const [candidates, setCandidates] = useState<number[]>([387, 538, 1121, 1137]);
  const [discarded, setDiscarded] = useState<number[]>([2149, 2150]);

  useEffect(() => {
    fetchPostJson<ProductListResponse>(
      "category",
      { candidates, discarded, important_attributes: attributeNames },
      { category_name: name },
    )
      .then((category) => {
        setData(category);
      })
      .catch((e) => console.error(e));
  }, [candidates, discarded]);

  const onDiscard = (id: number) => {
    if (candidates.includes(id)) {
      setCandidates((prevState) => prevState.filter((candidate) => candidate !== id));
    }
    setDiscarded((prevState) => [...prevState, id]);
  };
  const onMarkCandidate = (id: number) => {
    if (discarded.includes(id)) {
      setDiscarded((prevState) => prevState.filter((discarded) => discarded !== id));
    }
    setCandidates((prevState) => [...prevState, id]);
  };

  if (!data) {
    return <pre>Loading...</pre>;
  }

  if (!data.organized) {
    return <pre>unorganized {JSON.stringify(data)}</pre>;
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
        <div className="mb-3">
          <Candidates />
        </div>
        <div className="mb-3">
          <Unseen />
        </div>
        <div className="mb-3">
          <Alternatives />
        </div>
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