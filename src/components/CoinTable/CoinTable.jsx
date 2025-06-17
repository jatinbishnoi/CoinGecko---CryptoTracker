import { useEffect, useState } from "react";
import { fetchCoinData } from "../../services/fetchCoinData";
import { useQuery } from "@tanstack/react-query";

function CoinTable() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['coins', page],
    queryFn: () => fetchCoinData(page, 'usd'),
    retry: 2,
    retryDelay: 1000,
    cacheTime: 1000 * 60 * 2,
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div>Coin Table</div>
      <button onClick={() => setPage(page + 1)}>Next Page</button>
      <p>Current Page: {page}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

export default CoinTable;
