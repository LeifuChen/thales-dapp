import { useMatomo } from '@datapunt/matomo-tracker-react';
import Button from 'components/ButtonV2/Button';
import { USD_SIGN } from 'constants/currency';
import { POLYGON_GWEI_INCREASE_PERCENTAGE } from 'constants/network';
import { POSITIONS_TO_SIDE_MAP, Positions, SLIPPAGE_PERCENTAGE, getMaxGasLimitForNetwork } from 'constants/options';
import { getErrorToastOptions, getSuccessToastOptions } from 'constants/ui';
import { BigNumber, ethers } from 'ethers';

import useUserOpenPositions, { UserLivePositions } from 'queries/user/useUserOpenPositions';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { CSSProperties } from 'styled-components';
import { getEstimatedGasFees, getQuoteFromAMM, getQuoteFromRangedAMM, prepareTransactionForAMM } from 'utils/amm';
import { formatShortDateFromTimestamp } from 'utils/formatters/date';
import { stableCoinFormatter, stableCoinParser } from 'utils/formatters/ethers';
import { formatCurrencyWithSign, formatNumberShort, roundNumberToDecimals } from 'utils/formatters/number';
import { getIsArbitrum, getIsBSC, getIsOVM, getIsPolygon } from 'utils/network';
import { refetchAmmData, refetchBalances, refetchRangedAmmData, refetchUserOpenPositions } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';

const OpenPositions: React.FC = () => {
    const { t } = useTranslation();
    const { trackEvent } = useMatomo();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [submittingAddress, setSubmittingAddress] = useState('');

    const positionsQuery = useUserOpenPositions(networkId, walletAddress ?? '', { enabled: true });
    const livePositions = useMemo(() => {
        if (positionsQuery.isSuccess) return positionsQuery.data;
        return [];
    }, [networkId, positionsQuery]);

    const isOVM = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);
    const isBSC = getIsBSC(networkId);
    const isArbitrum = getIsArbitrum(networkId);

    const handleSubmit = async (position: UserLivePositions) => {
        const isRangedAmm = [Positions.IN, Positions.OUT].includes(position.side);

        const fetchGasLimit = async (
            marketAddress: string,
            side: any,
            parsedAmount: any,
            parsedTotal: any,
            parsedSlippage: any
        ) => {
            try {
                const { ammContract, rangedMarketAMMContract } = snxJSConnector as any;
                const contract = isRangedAmm ? rangedMarketAMMContract : ammContract;

                if (isOVM) {
                    const maxGasLimitForNetwork = getMaxGasLimitForNetwork(networkId);
                    setGasLimit(maxGasLimitForNetwork);

                    return maxGasLimitForNetwork;
                } else if (isBSC || isPolygon || isArbitrum) {
                    const gasLimit = await getEstimatedGasFees(
                        false,
                        false,
                        contract,
                        marketAddress,
                        side,
                        parsedAmount,
                        parsedTotal,
                        parsedSlippage,
                        undefined,
                        ''
                    );

                    const safeGasLimit = Math.round(Number(+gasLimit + 0.1 * +gasLimit));
                    setGasLimit(safeGasLimit);

                    return safeGasLimit;
                } else {
                    const maxGasLimitForNetwork = getMaxGasLimitForNetwork(networkId);
                    setGasLimit(maxGasLimitForNetwork);

                    return maxGasLimitForNetwork;
                }
            } catch (e) {
                console.log(e);
                setGasLimit(null);
                return null;
            }
        };

        const fetchAmmPriceData = async (totalToPay: number) => {
            let totalValueChanged = false;
            let latestGasLimit = null;

            if (position.market && totalToPay > 0) {
                try {
                    const { ammContract, rangedMarketAMMContract } = snxJSConnector as any;
                    const contract = isRangedAmm ? rangedMarketAMMContract : ammContract;

                    const parsedAmount = ethers.utils.parseEther(position.amount.toString());
                    const promises = isRangedAmm
                        ? [
                              getQuoteFromRangedAMM(
                                  false,
                                  false,
                                  contract,
                                  parsedAmount,
                                  position.market,
                                  POSITIONS_TO_SIDE_MAP[position.side]
                              ),
                              0, // No price impact for ranged markets
                          ]
                        : getQuoteFromAMM(
                              false,
                              false,
                              contract,
                              parsedAmount,
                              position.market,
                              POSITIONS_TO_SIDE_MAP[position.side]
                          );

                    const [ammQuotes]: Array<BigNumber> = await Promise.all(promises);

                    const ammPrice = stableCoinFormatter(ammQuotes, networkId, undefined) / position.amount;
                    const parsedSlippage = ethers.utils.parseEther((SLIPPAGE_PERCENTAGE[2] / 100).toString());

                    latestGasLimit = await fetchGasLimit(
                        position.market,
                        POSITIONS_TO_SIDE_MAP[position.side],
                        parsedAmount,
                        ammQuotes,
                        parsedSlippage
                    );

                    // changes in cash out value less than 0.01 sUSD are not relevant
                    totalValueChanged =
                        roundNumberToDecimals(position.value, 3) !==
                        roundNumberToDecimals(ammPrice * position.amount, 3);
                } catch (e) {
                    console.log(e);
                    setGasLimit(null);
                    totalValueChanged = true;
                }
            } else {
                setGasLimit(null);
            }

            return { totalValueChanged, latestGasLimit };
        };

        setSubmittingAddress(position.market);
        const id = toast.loading(t('amm.progress'));

        const { totalValueChanged, latestGasLimit } = await fetchAmmPriceData(position.paid);
        if (totalValueChanged) {
            toast.update(id, getErrorToastOptions(t('common.errors.try-again')));
            setSubmittingAddress('');
            refetchUserOpenPositions(walletAddress, networkId);
            return;
        }
        try {
            const { ammContract, rangedMarketAMMContract, signer } = snxJSConnector as any;
            const ammContractWithSigner = (isRangedAmm ? rangedMarketAMMContract : ammContract).connect(signer);

            const parsedAmount = ethers.utils.parseEther(position.amount.toString());
            const parsedTotal = stableCoinParser(position.value.toString(), networkId);
            const parsedSlippage = ethers.utils.parseEther((SLIPPAGE_PERCENTAGE[2] / 100).toString());
            const gasPrice = await snxJSConnector.provider?.getGasPrice();

            const gasInGwei = ethers.utils.formatUnits(gasPrice || 400000000000, 'gwei');

            const providerOptions = isPolygon
                ? {
                      gasLimit: latestGasLimit !== null ? latestGasLimit : gasLimit,
                      gasPrice: ethers.utils.parseUnits(
                          Math.floor(+gasInGwei + +gasInGwei * POLYGON_GWEI_INCREASE_PERCENTAGE).toString(),
                          'gwei'
                      ),
                  }
                : {
                      gasLimit: latestGasLimit !== null ? latestGasLimit : gasLimit,
                  };

            const tx: ethers.ContractTransaction = await prepareTransactionForAMM(
                false,
                false,
                ammContractWithSigner,
                position.market,
                POSITIONS_TO_SIDE_MAP[position.side],
                parsedAmount,
                parsedTotal,
                parsedSlippage,
                undefined,
                '',
                providerOptions
            );

            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                toast.update(
                    id,
                    getSuccessToastOptions(
                        t(`options.market.trade-options.place-order.swap-confirm-button.sell.confirmation-message`)
                    )
                );

                refetchBalances(walletAddress, networkId);
                isRangedAmm
                    ? refetchRangedAmmData(walletAddress, position.market, networkId)
                    : refetchAmmData(walletAddress, position.market);
                refetchUserOpenPositions(walletAddress, networkId);

                setSubmittingAddress('');
                setGasLimit(null);

                trackEvent({
                    category: isRangedAmm ? 'RangeAMM' : 'AMM',
                    action: 'sell-to-amm',
                });
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
            setSubmittingAddress('');
        }
    };

    return (
        <Wrapper>
            <Title>{t('options.trade.user-positions.your-positions')}</Title>
            <PositionsWrapper>
                {livePositions.map((position, index) => {
                    return (
                        <Position key={index}>
                            <Icon className={`currency-icon currency-icon--${position.currencyKey.toLowerCase()}`} />
                            <AlignedFlex>
                                <FlexContainer>
                                    <Label>{`${position.currencyKey}`}</Label>
                                    <Value>{position.strikePrice}</Value>
                                </FlexContainer>
                                <Separator />
                                <FlexContainer>
                                    <Label>{t('options.trade.user-positions.end-date')}</Label>
                                    <Value>{formatShortDateFromTimestamp(position.maturityDate)}</Value>
                                </FlexContainer>
                                <Separator />
                                <FlexContainer>
                                    <Label>{t('options.trade.user-positions.size')}</Label>
                                    <Value>{`${formatNumberShort(position.amount)}  ${position.side}`}</Value>
                                </FlexContainer>
                                <Separator />
                                <FlexContainer>
                                    <Label>{t('options.trade.user-positions.paid')}</Label>
                                    <Value>{formatCurrencyWithSign(USD_SIGN, position.paid, 2)}</Value>
                                </FlexContainer>
                            </AlignedFlex>
                            <Button
                                {...defaultButtonProps}
                                disabled={Number(position.value) === 0}
                                additionalStyles={additionalStyle}
                                onClickHandler={() => handleSubmit(position)}
                            >
                                {submittingAddress === position.market
                                    ? t(`options.trade.user-positions.cash-out-progress`)
                                    : t('options.trade.user-positions.cash-out')}
                                {' ' + formatCurrencyWithSign(USD_SIGN, position.value, 2)}
                            </Button>
                        </Position>
                    );
                })}
            </PositionsWrapper>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    padding-bottom: 20px;
`;

const PositionsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    @media (max-width: 767px) {
        flex-direction: row;
        overflow: auto;
    }
`;

const Title = styled.span`
    font-family: 'Titillium Web';
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    margin-left: 20px;
    margin-bottom: 10px;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.secondary};
`;

const defaultButtonProps = {
    width: '100%',
    height: '27px',
    active: true,
};

const additionalStyle: CSSProperties = {
    maxWidth: '200px',
    fontWeight: 700,
    fontSize: '13px',
    lineHeight: '100%',
    textTransform: 'uppercase',
};

const Position = styled.div`
    background: ${(props) => props.theme.background.primary};
    border: 2px solid ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 17px;
    gap: 20px;
    @media (max-width: 767px) {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 10px 10px;
        gap: 10px;
    }
`;

const Icon = styled.i`
    font-size: 31px;
`;

const AlignedFlex = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: flex-end;
    width: 100%;
    @media (max-width: 767px) {
        flex-direction: column;
        gap: 6px;
    }
`;

const FlexContainer = styled(AlignedFlex)`
    gap: 4px;
    flex: 1;
    justify-content: center;
    &:first-child {
        min-width: 210px;
        max-width: 210px;
    }
    @media (max-width: 767px) {
        flex-direction: row;
        gap: 4px;
    }
`;

const Label = styled.span`
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.secondary};
    white-space: nowrap;
`;

const Value = styled(Label)`
    color: ${(props) => props.theme.textColor.primary};
    white-space: nowrap;
`;

const Separator = styled.div`
    width: 2px;
    height: 14px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 3px;
    @media (max-width: 767px) {
        display: none;
    }
`;

export default OpenPositions;
