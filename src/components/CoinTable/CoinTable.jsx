import { useState, useContext } from "react";
import { fetchCoinData } from "../../services/fetchCoinData";
import { useQuery } from "@tanstack/react-query";
import { CurrencyContext } from "../../context/CurrencyContext";
function CoinTable() {

    const { currency } = useContext(CurrencyContext);
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['coins', page,currency],
    queryFn: () => fetchCoinData(page, currency),
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  if (isError) {
    return <div className="text-red-500 font-semibold text-center mt-5">Error: {error.message}</div>;
  }

  return (
    <div className="my-8 px-4 w-full max-w-[1000px] mx-auto">
      {/* Table Header (hidden on small screens) */}
      <div className="hidden sm:flex w-full bg-yellow-400 text-black py-4 px-3 font-bold rounded-md shadow text-center">
        <div className="w-[35%]">Coin</div>
        <div className="w-[25%]">Price</div>
        <div className="w-[20%]">24h Change</div>
        <div className="w-[20%]">Market Cap</div>
      </div>

      {/* Loading */}
      {isLoading && <div className="text-white text-xl text-center mt-5">Loading...</div>}

      {/* Coin List */}
      <div className="flex flex-col w-full gap-3 mt-3">
        {data &&
          data.map((coin) => (
            <div
              key={coin.id}
              className="w-full bg-slate-800 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 px-3 rounded-md border border-gray-700 hover:bg-slate-700 transition-all duration-300"
            >
              {/* Coin Info */}
              <div className="flex items-center gap-3 mb-3 sm:mb-0 w-full sm:w-[35%]">
                <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{coin.name}</span>
                  <span className="text-xs text-gray-300 uppercase">{coin.symbol}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex justify-between sm:justify-center sm:w-[25%] text-sm sm:text-base mb-1 sm:mb-0">
                <span className="font-semibold sm:hidden">Price:</span>
                <span className="ml-2 sm:ml-0">{coin.current_price.toLocaleString()}</span>
              </div>

              {/* 24h Change */}
              <div
                className={`flex justify-between sm:justify-center sm:w-[20%] text-sm sm:text-base mb-1 sm:mb-0 ${
                  coin.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                <span className="font-semibold sm:hidden">24h:</span>
                <span className="ml-2 sm:ml-0">{coin.price_change_24h.toFixed(2)}</span>
              </div>

              {/* Market Cap */}
              <div className="flex justify-between sm:justify-center sm:w-[20%] text-sm sm:text-base">
                <span className="font-semibold sm:hidden">Market Cap:</span>
                <span className="ml-2 sm:ml-0">{coin.market_cap.toLocaleString()}</span>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-4 flex-wrap">
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
