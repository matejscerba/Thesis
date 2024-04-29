import React, { useState } from "react";
import { useEffect } from "react";
import { fetchPost } from "../utils/api";

interface ICategoryProps {
  name: string;
}

function Category({ name }: ICategoryProps) {
  const [response, setResponse] = useState<{ [key: string]: any }>(undefined);
  const [candidates] = useState<number[]>(undefined);
  const [discarded] = useState<number[]>(undefined);

  useEffect(() => {
    fetchPost("category", { candidates, discarded }, { name })
      .then((fetchResponse) => fetchResponse.json())
      .then((json) => {
        setResponse(json as { [key: string]: any });
      })
      .catch((e) => console.error(e));
  }, [candidates, discarded]);

  return <pre>{JSON.stringify(response)}</pre>;
}

export default Category;
