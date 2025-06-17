import { useState } from "react";
import { fetchCoinData } from "../../services/fetchCoinData";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import currencyStore from "../../state/store";
import PageLoader from "../PageLoader/PageLoader";

function CoinTable() {
  const { currency } = currencyStore(); // Zustand state
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["coins", page, currency],
    queryFn: () => fetchCoinData(page, currency),
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  function handleCoinRedirect(id) {
    navigate(`/details/${id}`);
  }

  if (isError) {
    return (
      <div className="text-red-500 font-semibold text-center mt-5">
        Error: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="my-5 flex flex-col items-center justify-center gap-5 w-[80vw] mx-auto">
      {/* Table Header */}
      <div className="w-full bg-yellow-400 text-black flex py-4 px-2 font-semibold items-center justify-center rounded">
        <div className="basis-[35%]">Coin</div>
        <div className="basis-[25%]">Price</div>
        <div className="basis-[20%]">24h Change</div>
        <div className="basis-[20%]">Market Cap</div>
      </div>

      {/* Table Rows */}
      <div className="flex flex-col w-full">
        {data &&
          data.map((coin) => (
            <div
              onClick={() => handleCoinRedirect(coin.id)}
              key={coin.id}
              className="w-full bg-slate-800 text-white flex py-4 px-2 font-semibold items-center justify-between cursor-pointer hover:bg-slate-700 rounded border-b border-gray-600 transition"
            >
              {/* Coin Info */}
              <div className="flex items-center gap-3 basis-[35%]">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-[3rem] h-[3rem] rounded-full"
                  loading="lazy"
                />
                <div className="flex flex-col">
                  <div className="text-xl font-bold">{coin.name}</div>
                  <div className="text-sm uppercase text-gray-300">{coin.symbol}</div>
                </div>
              </div>

              {/* Coin Price */}
              <div className="basis-[25%] text-sm sm:text-base">
                {coin.current_price.toLocaleString()}
              </div>

              {/* 24h Change */}
              <div
                className={`basis-[20%] text-sm sm:text-base ${
                  coin.price_change_24h >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {coin.price_change_24h.toFixed(2)}
              </div>

              {/* Market Cap */}
              <div className="basis-[20%] text-sm sm:text-base">
                {coin.market_cap.toLocaleString()}
              </div>
            </div>
          ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex gap-4 justify-center items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-indigo-600 px-6 py-2 rounded text-white disabled:bg-gray-400 text-lg"
        >
          Prev
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="bg-indigo-600 px-6 py-2 rounded text-white text-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CoinTable;
