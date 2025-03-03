import React, { useEffect, useState } from 'react';
import { BalanceIcon, EarnSection, FullRow, Line, SectionContentContainer } from '../../components';
import { FlexDivColumnCentered } from 'theme/common';
import ValidationMessage from 'components/ValidationMessage/ValidationMessage';
import { useTranslation } from 'react-i18next';
import snxJSConnector from 'utils/snxJSConnector';
import { formatGasLimit, getL1FeeInWei } from 'utils/network';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import NetworkFees from 'pages/Token/components/NetworkFees';
import styled from 'styled-components';
import { refetchTokenQueries, refetchLPStakingQueries } from 'utils/queryConnector';
import NumericInput from 'pages/Token/components/NumericInput';
import { CurrencyLabel, InputContainer, InputLabel } from 'pages/Token/components/components';
import { formatCurrency, formatCurrencyWithKey, truncToDecimals } from 'utils/formatters/number';
import { dispatchMarketNotification } from 'utils/options';
import { GasLimit } from 'pages/Token/components/NetworkFees/NetworkFees';
import { MaxButton, ThalesWalletAmountLabel } from '../../Migration/components';
import FieldValidationMessage from 'components/FieldValidationMessage';
import { getMaxGasLimitForNetwork } from 'constants/options';
import { ethers } from 'ethers';
import { LP_TOKEN } from 'constants/currency';
import Button from 'pages/Token/components/Button';
import { ButtonType } from 'pages/Token/components/Button/Button';
import { isMobile } from 'utils/device';
import { useConnectModal } from '@rainbow-me/rainbowkit';

type Properties = {
    staked: number;
};

const Unstake: React.FC<Properties> = ({ staked }) => {
    const { t } = useTranslation();
    const { openConnectModal } = useConnectModal();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [isUnstaking, setIsUnstaking] = useState<boolean>(false);
    const [unstakingEnded, setUnstakingEnded] = useState<boolean>(false);
    const [amountToUnstake, setAmountToUnstake] = useState<number | string>('');
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [gasLimit, setGasLimit] = useState<number | GasLimit[] | null>(null);
    const [l1Fee, setL1Fee] = useState<number | number[] | null>(null);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const { lpStakingRewardsContract } = snxJSConnector as any;

    const isAmountEntered = Number(amountToUnstake) > 0;
    const insufficientBalance = Number(amountToUnstake) > staked || !staked;

    const isStartUnstakeButtonDisabled =
        isUnstaking || !lpStakingRewardsContract || !isAmountEntered || insufficientBalance || !isWalletConnected;

    const isUnstakeButtonDisabled = isUnstaking || !lpStakingRewardsContract || !isWalletConnected;

    useEffect(() => {
        const fetchL1FeeUnstake = async (lpStakingRewardsContractWithSigner: any, amount: any) => {
            const txRequest = await lpStakingRewardsContractWithSigner.populateTransaction.withdraw(amount);
            return getL1FeeInWei(txRequest, snxJSConnector);
        };

        const fetchGasLimit = async () => {
            try {
                const { lpStakingRewardsContract } = snxJSConnector as any;
                const lpStakingRewardsContractWithSigner = lpStakingRewardsContract.connect(
                    (snxJSConnector as any).signer
                );
                const amount = ethers.utils.parseEther(amountToUnstake.toString());
                const [unstakeGasEstimate, l1FeeUnstakeInWei] = await Promise.all([
                    lpStakingRewardsContractWithSigner.estimateGas.withdraw(amount),
                    fetchL1FeeUnstake(lpStakingRewardsContractWithSigner, amount),
                ]);
                setGasLimit(formatGasLimit(unstakeGasEstimate, networkId));
                setL1Fee(l1FeeUnstakeInWei);
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (isUnstakeButtonDisabled || isStartUnstakeButtonDisabled) return;
        fetchGasLimit();
    }, [isUnstaking, walletAddress, unstakingEnded, amountToUnstake]);

    const handleUnstakeThales = async () => {
        const { lpStakingRewardsContract } = snxJSConnector as any;

        try {
            setTxErrorMessage(null);
            setIsUnstaking(true);
            const lpStakingRewardsContractWithSigner = lpStakingRewardsContract.connect((snxJSConnector as any).signer);
            const amount = ethers.utils.parseEther(amountToUnstake.toString());
            const tx = await lpStakingRewardsContractWithSigner.withdraw(amount, {
                gasLimit: getMaxGasLimitForNetwork(networkId),
            });
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(
                    t('options.earn.gamified-staking.staking.unstake.unstake-confirmation-message')
                );
                refetchTokenQueries(walletAddress, networkId);
                refetchLPStakingQueries(walletAddress, networkId);
                setUnstakingEnded(true);
                setIsUnstaking(false);
                setGasLimit(null);
                setAmountToUnstake('');
            }
        } catch (e) {
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsUnstaking(false);
        }
    };

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <Button
                    active={true}
                    onClickHandler={openConnectModal}
                    type={ButtonType.submit}
                    width={isMobile() ? '100%' : '60%'}
                >
                    {t('common.wallet.connect-your-wallet')}
                </Button>
            );
        }
        if (insufficientBalance) {
            return (
                <Button disabled={true} type={ButtonType.submit} width={isMobile() ? '100%' : '60%'}>
                    {t(`common.errors.insufficient-staking-balance`)}
                </Button>
            );
        }
        if (!isAmountEntered) {
            return (
                <Button disabled={true} type={ButtonType.submit} width={isMobile() ? '100%' : '60%'}>
                    {t(`common.errors.enter-amount`)}
                </Button>
            );
        }

        return (
            <Button
                active={!isUnstakeButtonDisabled}
                disabled={isUnstakeButtonDisabled}
                onClickHandler={handleUnstakeThales}
                type={ButtonType.submit}
                width={isMobile() ? '100%' : '60%'}
            >
                {!isUnstaking
                    ? `${t('options.earn.gamified-staking.staking.unstake.name')} ${formatCurrencyWithKey(
                          LP_TOKEN,
                          amountToUnstake
                      )}`
                    : `${t('options.earn.gamified-staking.staking.unstake.unstaking')} ${formatCurrencyWithKey(
                          LP_TOKEN,
                          amountToUnstake
                      )}...`}
            </Button>
        );
    };

    const onMaxClick = () => {
        setAmountToUnstake(truncToDecimals(staked, 8));
    };

    useEffect(() => {
        setIsAmountValid(
            Number(amountToUnstake) === 0 || (Number(amountToUnstake) > 0 && Number(amountToUnstake) <= staked)
        );
    }, [amountToUnstake, staked]);

    return (
        <EarnSection spanOnTablet={5} orderOnMobile={5} orderOnTablet={5}>
            <SectionContentContainer>
                <InputContainer>
                    <NumericInput
                        value={amountToUnstake}
                        onChange={(_, value) => setAmountToUnstake(value)}
                        disabled={isUnstaking}
                        className={isAmountValid ? '' : 'error'}
                    />
                    <InputLabel>{t('options.earn.gamified-staking.staking.unstake.amount-to-unstake')}</InputLabel>
                    <CurrencyLabel className={isUnstaking ? 'disabled' : ''}>{LP_TOKEN}</CurrencyLabel>
                    <ThalesWalletAmountLabel>
                        {!isMobile() && <BalanceIcon />}
                        {isWalletConnected
                            ? t('options.earn.gamified-staking.staking.unstake.balance') + ' ' + formatCurrency(staked)
                            : '-'}
                        <MaxButton disabled={isUnstaking || !isWalletConnected} onClick={onMaxClick}>
                            {t('common.max')}
                        </MaxButton>
                    </ThalesWalletAmountLabel>
                    <FieldValidationMessage
                        showValidation={!isAmountValid}
                        message={t(`common.errors.insufficient-staking-balance`, { currencyKey: LP_TOKEN })}
                    />
                </InputContainer>
                <Line margin={'0 0 10px 0'} />
                <NetworkFees gasLimit={gasLimit} disabled={isUnstaking} l1Fee={l1Fee} />
                <ButtonsContainer>{getSubmitButton()}</ButtonsContainer>
                <FullRow>
                    <ValidationMessage
                        showValidation={txErrorMessage !== null}
                        message={txErrorMessage}
                        onDismiss={() => setTxErrorMessage(null)}
                    />
                </FullRow>
            </SectionContentContainer>
        </EarnSection>
    );
};

const ButtonsContainer = styled(FlexDivColumnCentered)`
    padding-top: 40px;
    align-items: center;
    > * {
        &:nth-child(2) {
            margin-top: 15px;
        }
    }
`;

export default Unstake;
