import React, { useState } from "react";
import { useEffect } from "react";

function ProductList() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [data, setData] = useState(undefined);

  useEffect(() => {
    fetch("http://localhost:8086", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch((e) => console.error(e));
  }, []);

  return <pre>{JSON.stringify(data)}</pre>;
}

export default ProductList;
