import { DefaultSubmitButton } from 'pages/Options/Market/components';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { getWalletAddress } from 'redux/modules/wallet';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered } from 'theme/common';
import { RootState } from 'redux/rootReducer';
import axios from 'axios';
import useTokenManualTransactionQuery from 'queries/token/useTokenManualTransitionQuery';

const MigrationRequestNotice: React.FC = () => {
    const { t } = useTranslation();
    // const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const requestManualUpdate = async () => {
        try {
            // https://api.thales.market http://localhost:3002
            await axios.post('http://localhost:3003/token/do-transition-manually', {
                walletAddress,
                doTransactionManually: !doManualTransition,
            });
            didUserRequestedManualTransitionQuery.refetch();
        } catch (e) {
            console.log(e);
        }
    };
    const didUserRequestedManualTransitionQuery = useTokenManualTransactionQuery(walletAddress);
    const currentDoManualTransition = didUserRequestedManualTransitionQuery.isSuccess
        ? didUserRequestedManualTransitionQuery.data.doTransactionManually
        : false;
    useEffect(() => {
        console.log('useEffect', currentDoManualTransition);
        setDoManualTransition(currentDoManualTransition);
    }, [currentDoManualTransition]);

    const [doManualTransition, setDoManualTransition] = useState(currentDoManualTransition);
    return (
        <Wrapper>
            <Conatiner>
                <Notice>
                    {doManualTransition
                        ? t('migration.migration-request-cancel-notice.text')
                        : t('migration.migration-request-notice.text')}
                </Notice>
                <div style={{ margin: 'auto' }}>
                    <FlexDivCentered>
                        <MigrateButton onClick={() => requestManualUpdate()}>
                            {doManualTransition
                                ? t('migration.migration-request-cancel-notice.button-label')
                                : t('migration.migration-request-notice.button-label')}
                        </MigrateButton>
                    </FlexDivCentered>
                </div>
            </Conatiner>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDivColumnCentered)`
    border: none;
    background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
    box-shadow: -2px -2px 10px 4px rgba(100, 217, 254, 0.25), 2px 2px 10px 4px rgba(100, 217, 254, 0.25);
    border-radius: 10px;
    padding: 1px;
    margin-bottom: 15px;
`;

const Conatiner = styled(FlexDivCentered)`
    background: #04045a;
    border-radius: 10px;
    padding: 18px 20px;
    @media (max-width: 767px) {
        flex-direction: column;
        padding: 20px 20px;
    }
`;

const Notice = styled(FlexDiv)`
    max-width: 540px;
    font-weight: normal;
    font-size: 16px;
    line-height: 30px;
    color: #ffffff;
    margin-right: 50px;
    margin-left: 50px;
    @media (max-width: 767px) {
        margin-bottom: 20px;
        margin-right: 0;
        text-align: center;
    }
`;

export const MigrateButton = styled(DefaultSubmitButton)`
    margin: auto;
    background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
    white-space: nowrap;
`;

export default MigrationRequestNotice;
