import { useState } from "react";
import { fetchCoinData } from "../../services/fetchCoinData";
import { useQuery } from "@tanstack/react-query";

function CoinTable() {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['coins', page],
    queryFn: () => fetchCoinData(page, 'usd'),
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  if (isError) {
    return <div className="text-red-500 font-semibold">Error: {error.message}</div>;
  }

  return (
    <div className="my-5 flex flex-col items-center justify-center gap-5 w-[90vw] mx-auto">
      <div className="w-full bg-yellow-400 text-black flex py-4 px-2 font-semibold items-center justify-center rounded-md shadow">
        <div className="basis-[35%]">Coin</div>
        <div className="basis-[25%]">Price</div>
        <div className="basis-[20%]">24h Change</div>
        <div className="basis-[20%]">Market Cap</div>
      </div>

      {isLoading && <div className="text-white text-xl">Loading...</div>}

      <div className="flex flex-col w-full">
        {data &&
          data.map((coin) => (
            <div
              key={coin.id}
              className="w-full bg-slate-800 text-white flex py-4 px-2 font-medium items-center justify-between border-b border-gray-700 hover:bg-slate-700 transition"
            >
              <div className="flex items-center gap-3 basis-[35%]">
                <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full" />
                <div>
                  <div className="text-lg font-bold">{coin.name}</div>
                  <div className="text-sm uppercase text-gray-300">{coin.symbol}</div>
                </div>
              </div>
              <div className="basis-[25%]">${coin.current_price.toLocaleString()}</div>
              <div className={`basis-[20%] ${coin.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {coin.price_change_24h.toFixed(2)}
              </div>
              <div className="basis-[20%]">${coin.market_cap.toLocaleString()}</div>
            </div>
          ))}
      </div>

      <div className="flex gap-4 justify-center items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-indigo-600 px-6 py-2 rounded text-white disabled:bg-gray-400 transition"
        >
          Prev
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="bg-indigo-600 px-6 py-2 rounded text-white transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CoinTable;
