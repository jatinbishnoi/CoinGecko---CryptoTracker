import { useQuery } from '@tanstack/react-query';
import { fetchCoinDetails } from "../services/fetchCoinDetails";
import currencyStore from '../state/store';

function useFetchCoin(coinId) {
    const { currency } = currencyStore();

    const { isError, isLoading, data: coin } = useQuery({
        queryKey: ["coin", coinId],
        queryFn: () => fetchCoinDetails(coinId),
        cacheTime: 1000 * 60 * 2,
        staleTime: 1000 * 60 * 2,
    });

    return {
        currency,
        isError,
        isLoading,
        coin
    };
}

export default useFetchCoin;
