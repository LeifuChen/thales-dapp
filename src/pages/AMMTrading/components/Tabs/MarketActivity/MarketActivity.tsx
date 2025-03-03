import React, { useMemo } from 'react';

import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import Table from 'components/TableV2';
import ViewEtherscanLink from 'components/ViewEtherscanLink';

import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';

import useBinaryOptionsTradesQuery from 'queries/options/useBinaryOptionsTradesQuery';
import useBinaryOptionsTransactionsQuery from 'queries/options/useBinaryOptionsTransactionsQuery';

import { useTranslation } from 'react-i18next';
import { uniqBy, orderBy } from 'lodash';
import { formatTxTimestamp } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithKey } from 'utils/formatters/number';

import { UI_COLORS } from 'constants/ui';
import { OPTIONS_CURRENCY_MAP } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import { getStableCoinForNetwork } from '../../../../../utils/currency';
import { MarketType, OptionsMarketInfo, RangedMarketData } from 'types/options';
import { MARKET_TYPE } from 'constants/options';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';

const MarketActivity: React.FC<{ marketType: MarketType }> = ({ marketType }) => {
    const { t } = useTranslation();

    // TODO: fix this warning
    // eslint-disable-next-line
    const optionsMarket = marketType == MARKET_TYPE[0] ? useMarketContext() : useRangedMarketContext();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const marketTransactionsQuery = useBinaryOptionsTransactionsQuery(optionsMarket?.address, networkId, {
        enabled: isAppReady && !!optionsMarket?.address,
    });

    const marketTransactions = uniqBy(marketTransactionsQuery.data || [], (transaction) => transaction.hash);

    const tradesQuery = useBinaryOptionsTradesQuery(
        optionsMarket?.address,
        marketType == MARKET_TYPE[0]
            ? (optionsMarket as OptionsMarketInfo)?.longAddress
            : (optionsMarket as RangedMarketData)?.inAddress,
        marketType == MARKET_TYPE[0]
            ? (optionsMarket as OptionsMarketInfo)?.shortAddress
            : (optionsMarket as RangedMarketData)?.outAddress,
        networkId,
        marketType,
        { enabled: isAppReady && !!optionsMarket?.address }
    );

    const transactions = useMemo(
        () =>
            orderBy(
                [...(tradesQuery.data || []), ...marketTransactions],
                ['timestamp', 'blockNumber'],
                ['desc', 'desc']
            ),
        [marketTransactions, tradesQuery?.data]
    );

    const getCellColor = (type: string) => {
        switch (type) {
            case 'buy':
                return UI_COLORS.GREEN;
            case 'long':
                return UI_COLORS.GREEN;
            case 'up':
                return UI_COLORS.GREEN;
            case 'sell':
                return UI_COLORS.RED;
            case 'short':
                return UI_COLORS.RED;
            case 'down':
                return UI_COLORS.RED;
            case 'in':
                return UI_COLORS.IN_COLOR;
            case 'out':
                return UI_COLORS.OUT_COLOR;
            default:
                return 'var(--color-white)';
        }
    };

    const priceSort = useMemo(
        () => (rowA: any, rowB: any, columnId: any, desc: any) => {
            let a = Number.parseFloat(rowA.values[columnId]);
            let b = Number.parseFloat(rowB.values[columnId]);
            if (Number.isNaN(a)) {
                // Blanks and non-numeric to bottom
                a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
            }
            if (Number.isNaN(b)) {
                b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
            }
            return a > b ? 1 : a < b ? -1 : 0;
        },
        []
    );

    return (
        <>
            <Table
                data={transactions}
                defaultPage={10}
                columns={[
                    {
                        Header: <>{t('options.market.transactions-card.table.date-time-col')}</>,
                        accessor: 'timestamp',
                        Cell: (cellProps: any) => <p>{formatTxTimestamp(cellProps.cell.value)}</p>,
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.market.transactions-card.table.type-col')}</>,
                        accessor: 'type',
                        Cell: (cellProps: any) => (
                            <p
                                style={{
                                    color: getCellColor(cellProps.cell.row.original.type),
                                    textTransform: 'uppercase',
                                }}
                            >
                                {t(`options.market.transactions-card.table.types.${cellProps.cell.value}`)}
                            </p>
                        ),
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.market.transactions-card.table.amount-col')}</>,
                        sortType: 'basic',
                        accessor: 'amount',
                        Cell: (cellProps: any) => (
                            <p style={{ color: getCellColor(cellProps.cell.row.original.type), fontWeight: 'bold' }}>
                                {cellProps.cell.row.original.type === 'buy' ||
                                cellProps.cell.row.original.type === 'sell'
                                    ? formatCurrencyWithKey(
                                          (OPTIONS_CURRENCY_MAP as any)[cellProps.cell.row.original.side],
                                          cellProps.cell.value
                                      )
                                    : cellProps.cell.row.original.type === 'mint'
                                    ? formatCurrency(cellProps.cell.value)
                                    : formatCurrencyWithKey(getStableCoinForNetwork(networkId), cellProps.cell.value)}
                            </p>
                        ),
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.market.transactions-card.table.price-col')}</>,
                        sortType: priceSort,
                        accessor: 'price',
                        Cell: (cellProps: any) => (
                            <p>
                                {cellProps.cell.row.original.type === 'buy' ||
                                cellProps.cell.row.original.type === 'sell'
                                    ? formatCurrencyWithKey(
                                          getStableCoinForNetwork(networkId),
                                          cellProps.cell.value ?? 0
                                      )
                                    : EMPTY_VALUE}
                            </p>
                        ),
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.market.transactions-card.table.tx-status-col')}</>,
                        id: 'tx-status',
                        Cell: (cellProps: any) =>
                            cellProps.cell.row.original.status && cellProps.cell.row.original.status === 'pending' ? (
                                <span>{t('common.tx-status.pending')}</span>
                            ) : (
                                <ViewEtherscanLink hash={cellProps.cell.row.original.hash} />
                            ),
                    },
                ]}
            />
        </>
    );
};

export default MarketActivity;
