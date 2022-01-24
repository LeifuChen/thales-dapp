import { useQuery, UseBaseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
export interface DoTransitionManual {
    doTransactionManually: boolean;
}

const useTokenManualTransactionQuery = (walletAddress: string, options?: UseBaseQueryOptions<DoTransitionManual>) => {
    return useQuery<DoTransitionManual>(
        QUERY_KEYS.Token.ManualTransition(walletAddress),
        async () => {
            // const baseUrl = 'https://api.thales.market/token/do-transition-manually/' + walletAddress.toLowerCase();
            const baseUrl = 'http://localhost:3003/token/do-transition-manually/' + walletAddress.toLowerCase();
            const response = await fetch(baseUrl);
            const result = await response.text();
            console.log('useTokenManualTransactionQuery', result);
            return JSON.parse(result);
        },
        options
    );
};

export default useTokenManualTransactionQuery;
