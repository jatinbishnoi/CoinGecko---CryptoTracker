import { useParams } from "react-router-dom";
import parse from 'html-react-parser';
import PageLoader from "../components/PageLoader/PageLoader";
import CoinInfoContainer from "../components/CoinInfo/CoinInfoContainer";
import useFetchCoin from "../hooks/useFetchCoin";

function CoinDetailsPage() {
  const { coinId } = useParams();

  const { isLoading, isError, coin, currency, error } = useFetchCoin(coinId);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center mt-6 text-lg">
        Error: {error?.message || "Something went wrong."}
      </div>
    );
  }

  if (!coin || !coin.market_data) {
    return (
      <div className="text-yellow-400 text-center mt-6 text-lg">
        Coin data is unavailable.
      </div>
    );
  }

  let parsedDescription = "No description available.";
  try {
    if (coin?.description?.en) {
      parsedDescription = parse(coin.description.en);
    }
  } catch (err) {
    parsedDescription = "Failed to load description.";
  }

  const price =
    coin?.market_data?.current_price &&
    coin.market_data.current_price[currency];

  const formattedPrice = price
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: typeof currency === "string" ? currency.toUpperCase() : "USD",
        maximumFractionDigits: 2,
      }).format(price)
    : "N/A";

  return (
    <div className="flex flex-col md:flex-row text-white">
      {/* Left Panel */}
      <div className="md:w-1/3 w-full flex flex-col items-center mt-6 md:mt-0 border-r-2 border-gray-500 p-4">
        <img
          alt={coin?.name || "Coin Image"}
          src={coin?.image?.large || "/fallback-image.png"}
          className="h-52 mb-5"
          loading="lazy"
        />

        <h1 className="text-4xl font-bold mb-5">{coin?.name}</h1>

        <p className="w-full px-6 py-4 text-justify">
          {parsedDescription}
        </p>

        <div className="w-full flex flex-col md:flex-row md:justify-around mt-4">
          <div className="flex items-center mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Rank:</h2>
            <span className="ml-3 text-xl">
              {coin?.market_cap_rank || "N/A"}
            </span>
          </div>

          <div className="flex items-center mb-4 md:mb-0">
            <h2 className="text-xl text-yellow-400 font-bold">Current Price:</h2>
            <span className="ml-3 text-xl">{formattedPrice}</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="md:w-2/3 w-full p-4">
        <CoinInfoContainer coinId={coinId} />
      </div>
    </div>
  );
}

export default CoinDetailsPage;
