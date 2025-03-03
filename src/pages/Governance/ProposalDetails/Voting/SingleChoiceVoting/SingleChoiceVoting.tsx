import React, { useState } from 'react';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivCentered } from 'theme/common';
import { Proposal } from 'types/governance';
import { useTranslation } from 'react-i18next';
import { VoteContainer, VoteButton, VoteConfirmation } from 'pages/Governance/components';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import { refetchProposal } from 'utils/queryConnector';
import { dispatchMarketNotification } from 'utils/options';
import { ProposalTypeEnum } from 'constants/governance';
import ValidationMessage from 'components/ValidationMessage';
import voting from 'utils/voting';
import snapshot from '@snapshot-labs/snapshot.js';
import { ProposalType } from '@snapshot-labs/snapshot.js/dist/sign/types';
import { Web3Provider } from '@ethersproject/providers';

type SingleChoiceVotingProps = {
    proposal: Proposal;
    hasVotingRights: boolean;
};

const SingleChoiceVoting: React.FC<SingleChoiceVotingProps> = ({ proposal, hasVotingRights }) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [selectedChoices, setSelectedChoices] = useState<number | undefined>(undefined);
    const [isVoting, setIsVoting] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

    const handleVote = async () => {
        setTxErrorMessage(null);
        setIsVoting(true);
        try {
            const hub = 'https://hub.snapshot.org';
            const client = new snapshot.Client712(hub);

            // using Web3Provider instead of wagmi provider due to an error _signTypedData is not a function
            await client.vote(new Web3Provider(window.ethereum as any, 'any'), walletAddress, {
                space: proposal.space.id,
                proposal: proposal.id,
                type: proposal.type as ProposalType,
                choice: Number(selectedChoices),
                reason: '',
                app: 'thales',
            });

            refetchProposal(proposal.space.id, proposal.id, walletAddress);
            dispatchMarketNotification(t('governance.proposal.vote-confirmation-message'));
            setIsVoting(false);
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsVoting(false);
        }
    };

    const formattedChoiceString = new voting[ProposalTypeEnum.Single](
        proposal,
        [],
        [],
        selectedChoices
    ).getChoiceString();

    return (
        <>
            <VoteContainer>
                {proposal.choices.map((choice: any, i: number) => {
                    return (
                        <SingleChoice
                            key={choice}
                            className={selectedChoices === i + 1 ? 'selected' : ''}
                            onClick={() => setSelectedChoices(i + 1)}
                        >
                            {choice}
                        </SingleChoice>
                    );
                })}
                {selectedChoices && hasVotingRights && (
                    <VoteConfirmation>
                        {t(`governance.proposal.vote-confirmation`, { choice: formattedChoiceString })}
                    </VoteConfirmation>
                )}
            </VoteContainer>
            <FlexDivCentered>
                <VoteButton disabled={!selectedChoices || isVoting || !hasVotingRights} onClick={handleVote}>
                    {!isVoting
                        ? t(`governance.proposal.submit-vote-label`)
                        : t(`governance.proposal.vote-progress-label`)}
                </VoteButton>
            </FlexDivCentered>
            <ValidationMessage
                showValidation={txErrorMessage !== null}
                message={txErrorMessage}
                onDismiss={() => setTxErrorMessage(null)}
            />
        </>
    );
};

const SingleChoice = styled(FlexDivColumnCentered)`
    box-sizing: content-box;
    height: 48px;
    border: 1px solid #748bc6;
    border-radius: 5px;
    margin-bottom: 20px;
    color: #b8c6e5;
    font-weight: bold;
    font-size: 20px;
    line-height: 48px;
    text-align: center;
    &.selected {
        margin: -1px;
        margin-bottom: 19px;
        border: 2px solid var(--color-highlight);
        color: #f6f6fe;
        background: #1b1c33;
    }
    &:hover {
        margin: -1px;
        margin-bottom: 19px;
        border: 2px solid var(--color-highlight);
        color: #f6f6fe;
        cursor: pointer;
        background: #1b1c33;
    }
    @media (max-width: 767px) {
        height: 46px;
        font-size: 16px;
        line-height: 46px;
    }
`;

export default SingleChoiceVoting;
