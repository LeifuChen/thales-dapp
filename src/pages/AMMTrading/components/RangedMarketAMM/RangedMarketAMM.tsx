/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import useDebouncedEffect from 'hooks/useDebouncedEffect';
import useInterval from 'hooks/useInterval';

import Input from '../AMM/components/Input';
import Button from 'components/Button';
import RangeSlider from 'components/RangeSlider';
import Switch from 'components/SwitchInput/SwitchInputNew';
import Slippage from '../AMM/components/Slippage';
import Divider from '../AMM/styled-components/Divider';
import NetworkFees from '../AMM/components/NetworkFees';
import ApprovalModal from 'components/ApprovalModal';

import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { setBuyState } from 'redux/modules/marketWidgets';
import styled from 'styled-components';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import snxJSConnector from 'utils/snxJSConnector';

import useRangedAMMMaxLimitsQuery, {
    RangeAmmMaxLimits,
} from 'queries/options/rangedMarkets/useRangedAMMMaxLimitsQuery';
import { getCurrencyKeyStableBalance } from 'utils/balances';
import erc20Contract from 'utils/contracts/erc20Contract';
import { stableCoinFormatter, stableCoinParser } from 'utils/formatters/ethers';
import { refetchRangedAmmData, refetchTrades, refetchUserTrades, refetchBalances } from 'utils/queryConnector';
import {
    calculateAndFormatPercentage,
    formatCurrency,
    formatCurrencyWithKey,
    formatPercentage,
    truncToDecimals,
} from 'utils/formatters/number';

import { OrderSide, RangedMarketBalanceInfo, RangedMarketPositionType, StableCoins } from 'types/options';
import { OPTIONS_CURRENCY_MAP } from 'constants/currency';
import {
    COLLATERALS,
    getMaxGasLimitForNetwork,
    MINIMUM_AMM_LIQUIDITY,
    RANGE_SIDE,
    SLIPPAGE_PERCENTAGE,
} from 'constants/options';
import {
    checkAllowance,
    formatGasLimit,
    getIsArbitrum,
    getIsBSC,
    getIsMultiCollateralSupported,
    getIsOVM,
    getIsPolygon,
    getL1FeeInWei,
} from 'utils/network';

import { useTranslation } from 'react-i18next';
import WalletBalance from '../AMM/components/WalletBalance';
import { getErrorToastOptions, getSuccessToastOptions, getWarningToastOptions, UI_COLORS } from 'constants/ui';
import { toast } from 'react-toastify';
import { getDefaultStableIndexByBalance, getStableCoinBalance, getStableCoinForNetwork } from 'utils/currency';
import { POLYGON_GWEI_INCREASE_PERCENTAGE } from 'constants/network';
import Tooltip from 'components/Tooltip';
import useRangedMarketPositionBalanceQuery from 'queries/options/rangedMarkets/useRangedMarketPositionBalanceQuery';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { getReferralWallet } from 'utils/referral';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import useMultipleCollateralBalanceQuery from 'queries/walletBalances/useMultipleCollateralBalanceQuery';
import { getSellToken, getSellTokenCurrency } from 'utils/options';
import {
    getAmountToApprove,
    getEstimatedGasFees,
    getQuoteFromRangedAMM,
    parseSellAmount,
    preparePopulateTransactionForAMM,
    prepareTransactionForAMM,
} from 'utils/amm';
import CollateralSelector from 'components/CollateralSelector';
import useStableBalanceQuery from 'queries/walletBalances/useStableBalanceQuery';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export type OrderSideOptionType = { value: OrderSide; label: string };

const THREE_PERCENT = 0.03;

const AMM: React.FC = () => {
    const { t } = useTranslation();
    const { openConnectModal } = useConnectModal();
    const rangedMarketData = useRangedMarketContext();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const dispatch = useDispatch();

    const { trackEvent } = useMatomo();

    const orderSideOptions = [
        {
            value: 'buy' as OrderSide,
            label: t('common.buy'),
        },
        {
            value: 'sell' as OrderSide,
            label: t('common.sell'),
        },
    ];
    const [orderSide, setOrderSide] = useState<OrderSideOptionType>(orderSideOptions[0]);
    const [rangeSide, setRangeSide] = useState<RangedMarketPositionType>('in');
    const [amount, setAmount] = useState<number | string>('');
    const [price, setPrice] = useState<number | string>('');
    const [basePrice, setBasePrice] = useState<number | string>('');
    const [total, setTotal] = useState<number | string>('');
    const [priceImpact, setPriceImpact] = useState<number | string>('');
    const [potentialReturn, setPotentialReturn] = useState<number | string>('');
    const [potentialBaseReturn, setPotentialBaseReturn] = useState<number | string>('');
    const [isPotentialReturnAvailable, setIsPotentialReturnAvailable] = useState<boolean>(true);
    const [slippage, setSlippage] = useState<number | string>(SLIPPAGE_PERCENTAGE[2]);
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isGettingQuote, setIsGettingQuote] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [isPriceChanged, setIsPriceChanged] = useState<boolean>(false);
    const [maxLimitExceeded, setMaxLimitExceeded] = useState<boolean>(false);
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [isSlippageValid, setIsSlippageValid] = useState<boolean>(true);
    const [insufficientLiquidity, setInsufficientLiquidity] = useState<boolean>(false);
    const [maxLimit, setMaxLimit] = useState<number>(0);
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);

    const isL2 = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);
    const isArbitrum = getIsArbitrum(networkId);
    const isBSC = getIsBSC(networkId);

    const [selectedStableIndex, setStableIndex] = useState<number>(0);
    const isMultiCollateralSupported = getIsMultiCollateralSupported(networkId);
    const isNonDefaultStable = selectedStableIndex !== 0 && isMultiCollateralSupported && orderSide.value === 'buy';

    const referral =
        walletAddress && getReferralWallet()?.toLowerCase() !== walletAddress?.toLowerCase()
            ? getReferralWallet()
            : null;

    const rawParams = useLocation();
    const queryParamSide = queryString.parse(rawParams?.search)?.side;

    useEffect(() => {
        if (queryParamSide == 'in') {
            setRangeSide('in');
        }

        if (queryParamSide == 'out') {
            setRangeSide('out');
        }
    }, [queryParamSide]);

    const positionBalanceQuery = useRangedMarketPositionBalanceQuery(
        rangedMarketData?.address,
        walletAddress,
        networkId,
        {
            enabled: isAppReady && isWalletConnected,
        }
    );

    let optBalances = {
        in: 0,
        out: 0,
    };

    if (isWalletConnected && positionBalanceQuery.isSuccess && positionBalanceQuery.data) {
        optBalances = positionBalanceQuery.data as RangedMarketBalanceInfo;
    }
    const multipleStableBalances = useMultipleCollateralBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && isMultiCollateralSupported,
    });

    useEffect(() => {
        refetchBalances(walletAddress, networkId);
    }, [walletAddress]);

    // If sUSD balance is zero, select first stable with nonzero value as default
    useEffect(() => {
        if (
            multipleStableBalances?.data &&
            multipleStableBalances?.isSuccess &&
            selectedStableIndex == 0 &&
            isMultiCollateralSupported
        ) {
            const defaultStableBalance = getDefaultStableIndexByBalance(multipleStableBalances?.data);
            setStableIndex(defaultStableBalance);
        }
    }, [multipleStableBalances?.data]);

    const tokenBalance = rangeSide === 'in' ? optBalances.in : optBalances.out;

    const stableBalanceQuery = useStableBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !isMultiCollateralSupported,
    });
    const walletBalancesMap = stableBalanceQuery.isSuccess && stableBalanceQuery.data ? stableBalanceQuery.data : null;
    const stableBalance = isMultiCollateralSupported
        ? getStableCoinBalance(multipleStableBalances?.data, COLLATERALS[selectedStableIndex] as StableCoins)
        : getCurrencyKeyStableBalance(walletBalancesMap, getStableCoinForNetwork(networkId) as StableCoins);

    const ammMaxLimitsQuery = useRangedAMMMaxLimitsQuery(rangedMarketData?.address, networkId, {
        enabled: isAppReady,
    });
    const ammMaxLimits =
        ammMaxLimitsQuery.isSuccess && ammMaxLimitsQuery.data
            ? (ammMaxLimitsQuery.data as RangeAmmMaxLimits)
            : undefined;

    const collateral = snxJSConnector.collateral;
    const multiCollateral = snxJSConnector.multipleCollateral;
    const isBuy = orderSide.value === 'buy';
    const isInPosition = rangeSide === 'in';
    const isAmountEntered = Number(amount) > 0;
    const isPriceEntered = Number(price) > 0;
    const isTotalEntered = Number(total) > 0;
    const isAmmTradingDisabled =
        (ammMaxLimits &&
            !ammMaxLimits.in.maxBuy &&
            !ammMaxLimits.in.maxSell &&
            !ammMaxLimits.out.maxBuy &&
            !ammMaxLimits.out.maxSell) ||
        !ammMaxLimits;

    const insufficientBalance = isBuy
        ? stableBalance < Number(total) || !stableBalance
        : tokenBalance < Number(amount) || !tokenBalance;

    const isButtonDisabled =
        !isTotalEntered ||
        !isPriceEntered ||
        !isAmountEntered ||
        !isSlippageValid ||
        isSubmitting ||
        !isWalletConnected ||
        insufficientBalance ||
        maxLimitExceeded ||
        isGettingQuote ||
        isAmmTradingDisabled ||
        !hasAllowance;

    const sellToken = getSellToken(
        isNonDefaultStable,
        isBuy,
        isInPosition,
        rangedMarketData?.inAddress,
        rangedMarketData?.outAddress,
        selectedStableIndex,
        collateral,
        multiCollateral
    );

    const sellTokenCurrencyKey = getSellTokenCurrency(
        isNonDefaultStable,
        isBuy,
        networkId,
        rangeSide,
        selectedStableIndex
    );

    const sellAmount = isBuy ? total : amount;

    const formatBuySellArguments = () => {
        const marketAddress = rangedMarketData?.address;
        const side = RANGE_SIDE[rangeSide];
        const parsedAmount = ethers.utils.parseEther(amount.toString());
        const parsedTotal = stableCoinParser(total.toString(), networkId);
        const parsedSlippage = ethers.utils.parseEther((Number(slippage) / 100).toString());
        return { marketAddress, side, parsedAmount, parsedTotal, parsedSlippage };
    };

    useEffect(() => {
        const erc20Instance = new ethers.Contract(sellToken as any, erc20Contract.abi, snxJSConnector.signer);
        const { rangedMarketAMMContract } = snxJSConnector;
        const addressToApprove = rangedMarketAMMContract ? rangedMarketAMMContract.address : '';

        const getAllowance = async () => {
            try {
                const parsedSellAmount = parseSellAmount(sellAmount, selectedStableIndex, networkId);

                const allowance = await checkAllowance(
                    parsedSellAmount,
                    erc20Instance,
                    walletAddress,
                    addressToApprove
                );

                setAllowance(allowance);
            } catch (e) {
                console.log(e);
            }
        };
        if (isWalletConnected) {
            getAllowance();
        }
    }, [walletAddress, isWalletConnected, isBuy, rangeSide, hasAllowance, sellAmount, isAllowing]);

    useEffect(() => {
        orderSide.value == 'buy' ? dispatch(setBuyState(true)) : dispatch(setBuyState(false));
    }, [orderSide?.value]);

    useEffect(() => {
        setAmount('');
    }, [orderSide?.value, rangeSide]);

    const fetchL1Fee = async (
        ammContractWithSigner: any,
        marketAddress: string,
        side: any,
        parsedAmount: any,
        parsedTotal: any,
        parsedSlippage: any
    ) => {
        const txRequest: any = await preparePopulateTransactionForAMM(
            isNonDefaultStable,
            isBuy,
            ammContractWithSigner,
            marketAddress,
            side,
            parsedAmount,
            parsedTotal,
            parsedSlippage,
            sellToken,
            referral
        );

        return getL1FeeInWei(txRequest, snxJSConnector);
    };

    const fetchGasLimit = async (
        marketAddress: string,
        side: any,
        parsedAmount: any,
        parsedTotal: any,
        parsedSlippage: any
    ) => {
        try {
            const { rangedMarketAMMContract } = snxJSConnector as any;
            const ammContractWithSigner = rangedMarketAMMContract.connect((snxJSConnector as any).signer);

            if (isL2) {
                const l1FeeInWei = await fetchL1Fee(
                    ammContractWithSigner,
                    marketAddress,
                    side,
                    parsedAmount,
                    parsedTotal,
                    parsedSlippage
                );
                setGasLimit(getMaxGasLimitForNetwork(networkId));
                setL1Fee(l1FeeInWei ? l1FeeInWei : 0);
                return getMaxGasLimitForNetwork(networkId);
            } else if (isPolygon || isArbitrum || isBSC) {
                const gasLimit = await getEstimatedGasFees(
                    isNonDefaultStable,
                    isBuy,
                    ammContractWithSigner,
                    marketAddress,
                    side,
                    parsedAmount,
                    parsedTotal,
                    parsedSlippage,
                    sellToken,
                    referral
                );

                const safeGasLimit = Math.round(Number(+gasLimit + 0.1 * +gasLimit));
                setGasLimit(safeGasLimit);
                return safeGasLimit;
            } else {
                setGasLimit(getMaxGasLimitForNetwork(networkId));
                return getMaxGasLimitForNetwork(networkId);
            }
        } catch (e) {
            console.log(e);
            setGasLimit(null);
            return null;
        }
    };

    useEffect(() => {
        if (isButtonDisabled) return;
        const { marketAddress, side, parsedAmount, parsedTotal, parsedSlippage } = formatBuySellArguments();
        fetchGasLimit(marketAddress, side, parsedAmount, parsedTotal, parsedSlippage);
    }, [isWalletConnected, hasAllowance, slippage]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const erc20Instance = new ethers.Contract(sellToken as any, erc20Contract.abi, snxJSConnector.signer);
        const { rangedMarketAMMContract } = snxJSConnector;
        const addressToApprove = rangedMarketAMMContract ? rangedMarketAMMContract.address : '';
        const amountToApprove = getAmountToApprove(
            approveAmount,
            isNonDefaultStable,
            isBuy,
            selectedStableIndex,
            networkId
        );

        const gasPrice = await snxJSConnector.provider?.getGasPrice();
        const gasInGwei = ethers.utils.formatUnits(gasPrice || 400000000000, 'gwei');

        try {
            setIsAllowing(true);
            const gasEstimate = await erc20Instance.estimateGas.approve(addressToApprove, amountToApprove);
            const providerOptions = isPolygon
                ? {
                      gasLimit: formatGasLimit(gasEstimate, networkId),
                      gasPrice: ethers.utils.parseUnits(
                          Math.floor(+gasInGwei + +gasInGwei * POLYGON_GWEI_INCREASE_PERCENTAGE).toString(),
                          'gwei'
                      ),
                  }
                : {
                      gasLimit: formatGasLimit(gasEstimate, networkId),
                  };

            const tx = (await erc20Instance.approve(
                addressToApprove,
                amountToApprove,
                providerOptions
            )) as ethers.ContractTransaction;
            setOpenApprovalModal(false);
            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                setIsAllowing(false);
            }
        } catch (e) {
            console.log(e);
            setIsAllowing(false);
            setOpenApprovalModal(false);
        }
    };

    const resetData = () => {
        setPrice('');
        setTotal('');
        setPriceImpact('');
        setPotentialReturn('');
        setGasLimit(null);
        setIsPotentialReturnAvailable(isBuy);
    };

    const fetchAmmPriceData = async (isRefresh: boolean, isSubmit = false) => {
        let priceChanged = false;
        let latestGasLimit = null;
        if (!isRefresh && !isSubmit) {
            setIsGettingQuote(true);
        }
        if (isAmountEntered) {
            try {
                const { rangedMarketAMMContract } = snxJSConnector as any;
                const ammContractWithSigner = rangedMarketAMMContract.connect((snxJSConnector as any).signer);

                const parsedAmount = ethers.utils.parseEther(amount.toString());
                let ammQuote = await getQuoteFromRangedAMM(
                    isNonDefaultStable,
                    isBuy,
                    ammContractWithSigner,
                    parsedAmount,
                    rangedMarketData.address,
                    RANGE_SIDE[rangeSide],
                    sellToken
                );

                if (isNonDefaultStable) {
                    ammQuote = ammQuote[0];
                }

                const ammPrice =
                    stableCoinFormatter(
                        ammQuote,
                        networkId,
                        isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                    ) / Number(amount);

                setPrice(ammPrice);
                setTotal(
                    stableCoinFormatter(
                        ammQuote,
                        networkId,
                        isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                    )
                );
                setPotentialReturn(ammPrice > 0 && isBuy ? 1 / ammPrice - 1 : 0);
                setIsPotentialReturnAvailable(isBuy);

                const parsedSlippage = ethers.utils.parseEther((Number(slippage) / 100).toString());
                const isQuoteChanged =
                    ammPrice !== price ||
                    total !==
                        stableCoinFormatter(
                            ammQuote,
                            networkId,
                            isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                        );

                if (isSubmit) {
                    latestGasLimit = await fetchGasLimit(
                        rangedMarketData.address,
                        RANGE_SIDE[rangeSide],
                        parsedAmount,
                        ammQuote,
                        parsedSlippage
                    );
                } else {
                    if (
                        ammPrice > 0 &&
                        stableCoinFormatter(
                            ammQuote,
                            networkId,
                            isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                        ) > 0 &&
                        isSlippageValid &&
                        isQuoteChanged &&
                        hasAllowance
                    ) {
                        fetchGasLimit(
                            rangedMarketData.address,
                            RANGE_SIDE[rangeSide],
                            parsedAmount,
                            ammQuote,
                            parsedSlippage
                        );
                    }
                }
                priceChanged = ammPrice !== price;
            } catch (e) {
                console.log(e);
                resetData();
                priceChanged = true;
            }
        } else {
            resetData();
        }
        if (!isRefresh && !isSubmit) {
            setIsGettingQuote(false);
        }
        return { priceChanged, latestGasLimit };
    };

    useDebouncedEffect(() => {
        fetchAmmPriceData(false);
    }, [amount, isBuy, isInPosition, walletAddress, isAmountEntered, selectedStableIndex]);

    useInterval(async () => {
        fetchAmmPriceData(true);
    }, 5000);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setIsPriceChanged(false);

        const id = toast.loading(t('amm.progress'));

        const { priceChanged, latestGasLimit } = await fetchAmmPriceData(true, true);
        if (priceChanged) {
            toast.update(id, getErrorToastOptions(t('common.errors.try-again')));
            setIsPriceChanged(true);
            setIsSubmitting(false);
            return;
        }
        try {
            const { rangedMarketAMMContract } = snxJSConnector as any;
            const ammContractWithSigner = rangedMarketAMMContract.connect((snxJSConnector as any).signer);

            const { marketAddress, side, parsedAmount, parsedTotal, parsedSlippage } = formatBuySellArguments();
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
                isNonDefaultStable,
                isBuy,
                ammContractWithSigner,
                marketAddress,
                side,
                parsedAmount,
                parsedTotal,
                parsedSlippage,
                sellToken,
                referral,
                providerOptions
            );

            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                toast.update(
                    id,
                    getSuccessToastOptions(
                        t(
                            `options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.confirmation-message`
                        )
                    )
                );
                refetchBalances(walletAddress, networkId);
                refetchRangedAmmData(walletAddress, rangedMarketData?.address, networkId);
                refetchTrades(rangedMarketData?.address);
                refetchUserTrades(rangedMarketData?.address, walletAddress);
                setIsSubmitting(false);
                resetData();
                setAmount('');

                if (isBuy) {
                    trackEvent({
                        category: 'RangeAMM',
                        action: `buy-with-${COLLATERALS[selectedStableIndex]}`,
                        value: Number(total),
                    });
                } else {
                    trackEvent({
                        category: 'RangeAMM',
                        action: 'sell-to-amm',
                    });
                }
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        let max = 0;
        let base = 0;
        if (ammMaxLimits) {
            max = isInPosition
                ? isBuy
                    ? ammMaxLimits.in.maxBuy
                    : ammMaxLimits.in.maxSell
                : isBuy
                ? ammMaxLimits.out.maxBuy
                : ammMaxLimits.out.maxSell;
            base = isInPosition
                ? isBuy
                    ? ammMaxLimits.in.buyPrice
                    : ammMaxLimits.in.sellPrice
                : isBuy
                ? ammMaxLimits.out.buyPrice
                : ammMaxLimits.out.sellPrice;
        }
        setMaxLimit(max);
        setBasePrice(base);
        setPotentialBaseReturn(
            isBuy && total && total > 0 && amount && amount > 0
                ? calculateAndFormatPercentage(Number(total), Number(amount))
                : 0
        );
        setInsufficientLiquidity(max < MINIMUM_AMM_LIQUIDITY);
    }, [ammMaxLimits, isInPosition, isBuy]);

    useEffect(() => {
        setIsSlippageValid(Number(slippage) > 0 && Number(slippage) <= 100);
    }, [slippage]);

    useEffect(() => {
        toast(getWarningToastOptions(t('amm.price-changed-warning')));
    }, [isPriceChanged]);

    useEffect(() => {
        setIsAmountValid(
            Number(amount) === 0 ||
                (Number(amount) > 0 &&
                    (isBuy
                        ? (Number(total) > 0 && Number(total) <= stableBalance) ||
                          (Number(total) === 0 && stableBalance > 0)
                        : Number(amount) <= tokenBalance))
        );
        setPotentialBaseReturn(
            isBuy && total && total > 0 && amount && amount > 0
                ? calculateAndFormatPercentage(Number(total), Number(amount))
                : 0
        );
    }, [amount, total, isBuy, stableBalance, tokenBalance]);

    useEffect(() => {
        setMaxLimitExceeded(Number(amount) > maxLimit);
    }, [amount, maxLimit]);

    const getSubmitButton = () => {
        const defaultButtonProps = {
            padding: '3px 35px',
            active: true,
            margin: '15px auto 0 auto',
            hoverShadow: 'var(--button-shadow)',
            fontSize: '20px',
        };

        if (isAmmTradingDisabled) {
            return (
                <Button disabled={true} {...defaultButtonProps}>
                    {t('amm.amm-disabled')}
                </Button>
            );
        }
        if (!isWalletConnected) {
            return (
                <Button {...defaultButtonProps} onClickHandler={openConnectModal}>
                    {t('common.wallet.connect-your-wallet')}
                </Button>
            );
        }
        if (insufficientLiquidity) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.insufficient-liquidity`)}
                </Button>
            );
        }
        if (insufficientBalance) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.insufficient-balance`)}
                </Button>
            );
        }
        if (!isAmountEntered) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.enter-amount`)}
                </Button>
            );
        }
        if (!isSlippageValid) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.invalid-slippage`)}
                </Button>
            );
        }
        if (maxLimitExceeded) {
            return (
                <Button {...defaultButtonProps} disabled={true}>
                    {t(`common.errors.insufficient-liquidity`)}
                </Button>
            );
        }
        if (!hasAllowance) {
            return (
                <Button {...defaultButtonProps} disabled={isAllowing} onClickHandler={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: sellTokenCurrencyKey })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: sellTokenCurrencyKey,
                          })}
                </Button>
            );
        }
        return (
            <Button {...defaultButtonProps} disabled={isButtonDisabled || !gasLimit} onClickHandler={handleSubmit}>
                {!isSubmitting
                    ? t(`options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.label`)
                    : t(
                          `options.market.trade-options.place-order.swap-confirm-button.${orderSide.value}.progress-label`
                      )}
            </Button>
        );
    };

    const getPriceImpactColor = (priceImpactPercentage: number) => {
        if (priceImpactPercentage >= 0.03 || Number(priceImpactPercentage) <= -0.03) {
            return UI_COLORS.GREEN;
        }
        if (priceImpactPercentage >= 0.01 || Number(priceImpactPercentage) <= -0.01) {
            return UI_COLORS.GREEN;
        }
        return UI_COLORS.GREEN;
    };

    const onMaxClick = async (isBuy: boolean) => {
        trackEvent({
            category: 'RangeAMM',
            action: 'click-on-max-button',
        });
        if (isBuy) {
            const { rangedMarketAMMContract } = snxJSConnector as any;
            const ammContractWithSigner = rangedMarketAMMContract.connect((snxJSConnector as any).signer);

            const calcPrice = !price ? basePrice : price;

            if (calcPrice) {
                let tmpSuggestedAmount = Number(stableBalance) / Number(calcPrice);
                const suggestedAmount = ethers.utils.parseEther(tmpSuggestedAmount.toString());

                if (tmpSuggestedAmount > maxLimit) {
                    setAmount(truncToDecimals(maxLimit));
                    return;
                }

                let ammQuote = await getQuoteFromRangedAMM(
                    isNonDefaultStable,
                    isBuy,
                    ammContractWithSigner,
                    suggestedAmount,
                    rangedMarketData.address,
                    RANGE_SIDE[rangeSide],
                    sellToken
                );

                if (isNonDefaultStable) {
                    ammQuote = ammQuote[0];
                }

                const ammPrice =
                    stableCoinFormatter(
                        ammQuote,
                        networkId,
                        isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                    ) / Number(tmpSuggestedAmount);

                tmpSuggestedAmount = (Number(stableBalance) / Number(ammPrice)) * ((100 - Number(slippage)) / 100);

                setAmount(truncToDecimals(tmpSuggestedAmount));
            }
        } else {
            setAmount(truncToDecimals(tokenBalance));
        }
    };

    const formDisabled = isSubmitting || isAmmTradingDisabled;
    return (
        <Wrapper>
            {isBuy && isMultiCollateralSupported && (
                <CollateralSelector
                    collateralArray={COLLATERALS}
                    selectedItem={selectedStableIndex}
                    onChangeCollateral={(index) => setStableIndex(index)}
                />
            )}
            <WalletBalance type={rangeSide} stableIndex={isBuy ? selectedStableIndex : undefined} />
            <Switch
                active={orderSide.value !== 'buy'}
                width={'94px'}
                height={'32px'}
                dotSize={'22px'}
                label={{
                    firstLabel: orderSideOptions[0].label.toUpperCase(),
                    secondLabel: orderSideOptions[1].label.toUpperCase(),
                    fontSize: '25px',
                }}
                shadow={true}
                dotBackground={'var(--amm-switch-circle)'}
                handleClick={() => {
                    orderSide.value == 'buy' ? setOrderSide(orderSideOptions[1]) : setOrderSide(orderSideOptions[0]);
                }}
            />
            <ButtonWrapper>
                <Button
                    width={'48%'}
                    active={rangeSide == 'in'}
                    padding={'5px 0px'}
                    fontSize={'14px'}
                    hoverShadow={'var(--button-shadow)'}
                    onClickHandler={() => setRangeSide('in')}
                >
                    {t('options.common.in')}
                </Button>
                <Button
                    width={'48%'}
                    active={rangeSide == 'out'}
                    padding={'5px 0px'}
                    fontSize={'14px'}
                    hoverShadow={'var(--button-shadow)'}
                    onClickHandler={() => setRangeSide('out')}
                >
                    {t('options.common.out')}
                </Button>
            </ButtonWrapper>
            <Input
                title={t('options.market.trade-options.place-order.amount-label', {
                    orderSide: orderSide.value.toUpperCase(),
                })}
                value={amount}
                valueType={'number'}
                subValue={OPTIONS_CURRENCY_MAP[rangeSide]}
                valueChange={(value) => setAmount(value)}
                borderColor={!isAmountValid ? '#C3244A' : undefined}
                displayTooltip={!isAmountValid || maxLimitExceeded}
                tooltipText={t(
                    !isAmountValid ? 'common.errors.insufficient-balance-wallet' : 'common.errors.max-limit-exceeded',
                    {
                        currencyKey: isBuy
                            ? getStableCoinForNetwork(
                                  networkId,
                                  isNonDefaultStable ? (COLLATERALS[selectedStableIndex] as StableCoins) : undefined
                              )
                            : OPTIONS_CURRENCY_MAP[rangeSide],
                    }
                )}
            >
                <MaxButtonContainer>
                    <MaxButton
                        onClick={() => onMaxClick(isBuy)}
                        disabled={formDisabled || insufficientLiquidity || isGettingQuote}
                    >
                        {t('common.max')}
                    </MaxButton>
                    <Tooltip message={t('amm.max-button-tooltip')} type={'info'} />
                </MaxButtonContainer>
            </Input>
            <RangeSlider
                min={1}
                max={maxLimit}
                showFooter={true}
                step={1}
                container={{ margin: '0 0 30px 0' }}
                footerText={t('amm.max-amount', {
                    amount: formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[rangeSide], maxLimit),
                })}
                defaultValue={Number(amount)}
                onChangeEventHandler={(value) => setAmount(value)}
            />
            <Input
                title={t('options.market.trade-options.place-order.price-label', {
                    currencyKey: OPTIONS_CURRENCY_MAP[rangeSide],
                })}
                value={
                    isGettingQuote
                        ? '...'
                        : Number(price) > 0 || Number(basePrice) > 0
                        ? formatCurrency(Number(price) > 0 ? price : basePrice, 4)
                        : '-'
                }
                subValue={getStableCoinForNetwork(
                    networkId,
                    isNonDefaultStable ? (COLLATERALS[selectedStableIndex] as StableCoins) : undefined
                )}
                valueEditDisable={true}
            />
            <Input
                title={t(`amm.total-${orderSide.value}-label`)}
                value={isGettingQuote ? '...' : Number(price) > 0 ? formatCurrency(total, 4) : '-'}
                subValue={getStableCoinForNetwork(
                    networkId,
                    isNonDefaultStable ? (COLLATERALS[selectedStableIndex] as StableCoins) : undefined
                )}
                valueEditDisable={true}
            />
            <Input
                title={t('amm.return-label')}
                value={
                    isGettingQuote
                        ? '...'
                        : Number(price) > 0
                        ? isPotentialReturnAvailable
                            ? `${formatCurrencyWithKey(
                                  getStableCoinForNetwork(networkId),
                                  Number(potentialReturn) * Number(total)
                              )}`
                            : '-'
                        : '-'
                }
                valueColor={isPotentialReturnAvailable ? getPriceImpactColor(Number(priceImpact)) : undefined}
                subValue={
                    isPotentialReturnAvailable
                        ? `(${formatPercentage(potentialBaseReturn)})`
                        : isBuy && Number(basePrice) > 0 && Number(potentialBaseReturn) > 0
                        ? formatPercentage(potentialReturn)
                        : ''
                }
                subValueColor={isPotentialReturnAvailable ? getPriceImpactColor(Number(priceImpact)) : undefined}
                valueEditDisable={true}
            />
            <Slippage
                fixed={SLIPPAGE_PERCENTAGE}
                defaultValue={Number(slippage)}
                onChangeHandler={(value) => setSlippage(value)}
            />
            <Divider />
            <NetworkFees gasLimit={gasLimit} disabled={formDisabled} l1Fee={l1Fee} />
            {openApprovalModal && (
                <ApprovalModal
                    // add three percent to approval amount to take into account price changes
                    defaultAmount={+(+sellAmount + THREE_PERCENT * +sellAmount).toFixed(2)}
                    tokenSymbol={sellTokenCurrencyKey}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
            {getSubmitButton()}
        </Wrapper>
    );
};

const MaxButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    /* align-items: center; */
    position: absolute;
    top: 5px;
    right: 2px;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    border: 2px solid var(--card-border-color);
    border-radius: 15px;
    padding: 30px;
    margin-right: 27px;
    min-width: 300px;
    width: 40%;
    @media (max-width: 1024px) {
        width: 100%;
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 28px;
`;

export const MaxButton = styled.button`
    /* position: absolute; */
    /* top: 5px; */
    /* right: 10px; */
    padding: 1px 8px;
    font-weight: 700;
    font-size: 10px;
    color: var(--color-white);
    background-color: rgba(100, 217, 254, 0.5);
    border-radius: 10px;
    line-height: 15.21px;
    border: none;
    outline: none;
    text-transform: uppercase;
    cursor: pointer;
    &:focus {
        outline: none;
        border: none;
    }
    &:active {
        outline: none;
        border-style: none;
    }
    &:disabled {
        opacity: 0.6;
    }
`;

export default AMM;
