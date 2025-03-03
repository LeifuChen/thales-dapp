import { isSynth } from 'utils/currency';
import get from 'lodash/get';

const getSynthBalancePath = (currencyKey, field) => ['synths', 'balances', currencyKey, field];

// crypto appears as lowercased in balances
const getCryptoCurrencyBalancePath = (currencyKey, field) => [currencyKey.toLowerCase(), field];

export const getCurrencyKeyBalance = (balances, currencyKey) =>
    isSynth(currencyKey)
        ? get(balances, getSynthBalancePath(currencyKey, 'balance'))
        : get(balances, getCryptoCurrencyBalancePath(currencyKey, 'balance'));

export const getCurrencyKeyUSDBalance = (balances, currencyKey) =>
    isSynth(currencyKey)
        ? get(balances, getSynthBalancePath(currencyKey, 'usdBalance'))
        : get(balances, getCryptoCurrencyBalancePath(currencyKey, 'usdBalance'));

export const getCurrencyKeyUSDBalanceBN = (balances, currencyKey) =>
    isSynth(currencyKey)
        ? get(balances, getSynthBalancePath(currencyKey, 'balanceBN'))
        : get(balances, getCryptoCurrencyBalancePath(currencyKey, 'balanceBN'));

export const getCurrencyKeyStableBalance = (balanceData, currencyKey) => {
    if (!balanceData) {
        return null;
    }
    return balanceData[currencyKey]?.balance ? balanceData[currencyKey]?.balance : 0;
};
