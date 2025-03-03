import React, { useEffect, useMemo, useState } from 'react';
import { ClaimMessage, EarnSection, FullRow, SectionContentContainer, Line, BalanceIcon } from '../../../components';
import { formatCurrency, formatCurrencyWithKey, truncToDecimals } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import NumericInput from 'pages/Token/components/NumericInput';
import { CurrencyLabel, InputContainer, InputLabel } from 'pages/Token/components/components';
import useThalesBalanceQuery from 'queries/walletBalances/useThalesBalanceQuery';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import snxJSConnector from 'utils/snxJSConnector';
import { BigNumber, ethers } from 'ethers';
import ValidationMessage from 'components/ValidationMessage';
import NetworkFees from 'pages/Token/components/NetworkFees';
import { checkAllowance, formatGasLimit, getIsOVM, getL1FeeInWei } from 'utils/network';
import { refetchTokenQueries } from 'utils/queryConnector';
import styled from 'styled-components';
import { dispatchMarketNotification } from 'utils/options';
import SimpleLoader from '../../../components/SimpleLoader';
import { MaxButton, ThalesWalletAmountLabel } from '../../../Migration/components';
import FieldValidationMessage from 'components/FieldValidationMessage';
import { getMaxGasLimitForNetwork } from 'constants/options';
import { FlexDivColumnCentered } from 'theme/common';
import ApprovalModal from 'components/ApprovalModal';
import Button from 'pages/Token/components/Button';
import { ButtonType } from 'pages/Token/components/Button/Button';
import { isMobile } from 'utils/device';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { UserStakingData } from 'types/token';
import useUserStakingDataQuery from 'queries/token/useUserStakingData';

const Stake: React.FC = () => {
    const { t } = useTranslation();
    const { openConnectModal } = useConnectModal();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [amountToStake, setAmountToStake] = useState<number | string>('');
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [isAllowingStake, setIsAllowingStake] = useState<boolean>(false);
    const [isStaking, setIsStaking] = useState<boolean>(false);
    const [hasStakeAllowance, setStakeAllowance] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const isL2 = getIsOVM(networkId);
    const { stakingThalesContract } = snxJSConnector as any;
    const [lastValidUserStakingData, setLastValidUserStakingData] = useState<UserStakingData | undefined>(undefined);

    const thalesBalanceQuery = useThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const userStakingDataQuery = useUserStakingDataQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (userStakingDataQuery.isSuccess && userStakingDataQuery.data) {
            setLastValidUserStakingData(userStakingDataQuery.data);
        }
    }, [userStakingDataQuery.isSuccess, userStakingDataQuery.data]);

    const userStakingData: UserStakingData | undefined = useMemo(() => {
        if (userStakingDataQuery.isSuccess && userStakingDataQuery.data) {
            return userStakingDataQuery.data;
        }
        return lastValidUserStakingData;
    }, [userStakingDataQuery.isSuccess, userStakingDataQuery.data, lastValidUserStakingData]);

    const thalesBalance =
        thalesBalanceQuery.isSuccess && thalesBalanceQuery.data ? Number(thalesBalanceQuery.data.balance) : 0;
    const isUnstaking = userStakingData && userStakingData.isUnstaking;
    const isStakingPaused = userStakingData && userStakingData.isPaused;

    const isAmountEntered = Number(amountToStake) > 0;
    const insufficientBalance = Number(amountToStake) > thalesBalance || !thalesBalance;
    const isButtonDisabled =
        isStaking ||
        !stakingThalesContract ||
        isUnstaking ||
        !isAmountEntered ||
        insufficientBalance ||
        !isWalletConnected ||
        isStakingPaused ||
        !hasStakeAllowance;

    useEffect(() => {
        if (!!stakingThalesContract) {
            const { thalesTokenContract } = snxJSConnector as any;
            const thalesTokenContractWithSigner = thalesTokenContract.connect((snxJSConnector as any).signer);
            const addressToApprove = stakingThalesContract.address;
            const getAllowance = async () => {
                try {
                    const parsedStakeAmount = ethers.utils.parseEther(Number(amountToStake).toString());
                    const allowance = await checkAllowance(
                        parsedStakeAmount,
                        thalesTokenContractWithSigner,
                        walletAddress,
                        addressToApprove
                    );
                    setStakeAllowance(allowance);
                } catch (e) {
                    console.log(e);
                }
            };
            if (isWalletConnected && thalesTokenContractWithSigner.signer) {
                getAllowance();
            }
        }
    }, [walletAddress, isWalletConnected, hasStakeAllowance, stakingThalesContract, amountToStake, isAllowingStake]);

    useEffect(() => {
        const fetchL1Fee = async (stakingThalesContractWithSigner: any, amount: any) => {
            const txRequest = await stakingThalesContractWithSigner.populateTransaction.stake(amount);
            return getL1FeeInWei(txRequest, snxJSConnector);
        };

        const fetchGasLimit = async () => {
            const amount = ethers.utils.parseEther(amountToStake.toString());
            try {
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                if (isL2) {
                    const [gasEstimate, l1FeeInWei] = await Promise.all([
                        stakingThalesContractWithSigner.estimateGas.stake(amount),
                        fetchL1Fee(stakingThalesContractWithSigner, amount),
                    ]);
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                    setL1Fee(l1FeeInWei);
                } else {
                    const gasEstimate = await stakingThalesContractWithSigner.estimateGas.stake(amount);
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                }
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (isButtonDisabled) return;
        fetchGasLimit();
    }, [isButtonDisabled, amountToStake, hasStakeAllowance, walletAddress]);

    const handleStakeThales = async () => {
        try {
            setTxErrorMessage(null);
            setIsStaking(true);
            const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
            const amount = ethers.utils.parseEther(amountToStake.toString());
            const tx = await stakingThalesContractWithSigner.stake(amount, {
                gasLimit: getMaxGasLimitForNetwork(networkId),
            });
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(t('options.earn.gamified-staking.staking.stake.confirmation-message'));
                refetchTokenQueries(walletAddress, networkId);
                setAmountToStake('');
                setIsStaking(false);
            }
        } catch (e) {
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsStaking(false);
        }
    };

    const handleAllowance = async (approveAmount: BigNumber) => {
        const { thalesTokenContract } = snxJSConnector as any;
        const thalesTokenContractWithSigner = thalesTokenContract.connect((snxJSConnector as any).signer);

        const addressToApprove = stakingThalesContract.address;
        try {
            setIsAllowingStake(true);
            const gasEstimate = await thalesTokenContractWithSigner.estimateGas.approve(
                addressToApprove,
                approveAmount
            );
            const tx = (await thalesTokenContractWithSigner.approve(addressToApprove, approveAmount, {
                gasLimit: formatGasLimit(gasEstimate, networkId),
            })) as ethers.ContractTransaction;
            setOpenApprovalModal(false);
            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                setIsAllowingStake(false);
            }
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsAllowingStake(false);
            setOpenApprovalModal(false);
        }
    };

    const getStakeButton = () => {
        if (!isWalletConnected) {
            return (
                <Button active={true} onClickHandler={openConnectModal} type={ButtonType.submit}>
                    {t('common.wallet.connect-your-wallet')}
                </Button>
            );
        }
        if (insufficientBalance) {
            return (
                <Button disabled={true} type={ButtonType.submit}>
                    {t(`common.errors.insufficient-balance`)}
                </Button>
            );
        }
        if (!isAmountEntered) {
            return (
                <Button disabled={true} type={ButtonType.submit}>
                    {t(`common.errors.enter-amount`)}
                </Button>
            );
        }
        if (!hasStakeAllowance) {
            return (
                <Button
                    active={!isAllowingStake}
                    disabled={isAllowingStake}
                    onClickHandler={() => setOpenApprovalModal(true)}
                    type={ButtonType.submit}
                >
                    {!isAllowingStake
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: THALES_CURRENCY })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: THALES_CURRENCY,
                          })}
                </Button>
            );
        }

        return (
            <Button
                active={!isButtonDisabled}
                disabled={isButtonDisabled}
                onClickHandler={handleStakeThales}
                type={ButtonType.submit}
            >
                {!isStaking
                    ? `${t('options.earn.gamified-staking.staking.stake.name')} ${formatCurrencyWithKey(
                          THALES_CURRENCY,
                          amountToStake
                      )}`
                    : `${t('options.earn.gamified-staking.staking.stake.staking')} ${formatCurrencyWithKey(
                          THALES_CURRENCY,
                          amountToStake
                      )}...`}
            </Button>
        );
    };

    const onMaxClick = () => {
        setAmountToStake(truncToDecimals(thalesBalance, 8));
    };

    useEffect(() => {
        setIsAmountValid(
            Number(amountToStake) === 0 || (Number(amountToStake) > 0 && Number(amountToStake) <= thalesBalance)
        );
    }, [amountToStake, thalesBalance]);

    return (
        <EarnSection spanOnTablet={5} orderOnMobile={4} orderOnTablet={4}>
            <SectionContentContainer>
                <InputContainer marginTop={isMobile() ? 20 : 40}>
                    <NumericInput
                        value={amountToStake}
                        onChange={(_, value) => setAmountToStake(value)}
                        disabled={isStaking || isUnstaking || isStakingPaused}
                        className={isAmountValid ? '' : 'error'}
                    />
                    <InputLabel>{t('options.earn.gamified-staking.staking.stake.amount-to-stake')}</InputLabel>
                    <CurrencyLabel className={isStaking || isUnstaking || isStakingPaused ? 'disabled' : ''}>
                        {THALES_CURRENCY}
                    </CurrencyLabel>
                    <ThalesWalletAmountLabel>
                        {!isMobile() && <BalanceIcon />}
                        {isWalletConnected ? (
                            thalesBalanceQuery.isLoading ? (
                                <SimpleLoader />
                            ) : (
                                t('options.earn.gamified-staking.staking.stake.balance') +
                                ' ' +
                                formatCurrency(thalesBalance)
                            )
                        ) : (
                            '-'
                        )}
                        <MaxButton
                            disabled={isStaking || isUnstaking || isStakingPaused || !isWalletConnected}
                            onClick={onMaxClick}
                        >
                            {t('common.max')}
                        </MaxButton>
                    </ThalesWalletAmountLabel>
                    <FieldValidationMessage
                        showValidation={!isAmountValid}
                        message={t(`common.errors.insufficient-balance-wallet`, { currencyKey: THALES_CURRENCY })}
                    />
                </InputContainer>
                <Line margin={isMobile() ? '10px 0' : '41px 0 10px 0'} />
                <NetworkFees gasLimit={gasLimit} disabled={isStaking} l1Fee={l1Fee} />
                <StakeButtonDiv>
                    {getStakeButton()}
                    {isStakingPaused && (
                        <ClaimMessage>{t('options.earn.gamified-staking.staking.stake.paused-message')}</ClaimMessage>
                    )}
                </StakeButtonDiv>
                <FullRow>
                    <ValidationMessage
                        showValidation={txErrorMessage !== null}
                        message={txErrorMessage}
                        onDismiss={() => setTxErrorMessage(null)}
                    />
                </FullRow>
            </SectionContentContainer>
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={amountToStake}
                    tokenSymbol={THALES_CURRENCY}
                    isAllowing={isAllowingStake}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </EarnSection>
    );
};

const StakeButtonDiv = styled(FlexDivColumnCentered)`
    padding-top: 31px;
    padding-bottom: 25px;
    align-items: center;
    @media (max-width: 1024px) {
        padding-top: 15px;
        padding-bottom: 5px;
    }
`;

export default Stake;
