import { ProvideLiquidityLink, UniswapExchangeLink } from 'pages/Token/components';
import React, { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { isMobile } from 'utils/device';

const Instructions: React.FC = () => {
    const { t } = useTranslation();

    const [stepSelected, setStepSelected] = useState(1);

    const step1 = useRef<null | HTMLDivElement>(null);
    const step2 = useRef<null | HTMLDivElement>(null);
    const step3 = useRef<null | HTMLDivElement>(null);
    const step4 = useRef<null | HTMLDivElement>(null);
    const step5 = useRef<null | HTMLDivElement>(null);

    const stepNavClickhandler = (step: React.MutableRefObject<HTMLDivElement | null>, stepNum: number) => {
        setStepSelected(stepNum);
        step.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: stepNum === 5 ? 'end' : 'start' });
    };

    return (
        <>
            <Container>
                {!isMobile() && (
                    <StepsWrapper firstRow={true}>
                        <Step>1</Step>
                        <StepConnect />
                        <Step>2</Step>
                        <StepConnect />
                        <Step>3</Step>
                        <StepConnect />
                        <Step>4</Step>
                        <StepConnect />
                        <Step>5</Step>
                    </StepsWrapper>
                )}
                <StepsWrapper firstRow={false}>
                    <StepInfo ref={step1}>
                        <StepInfoLabel>{t('options.earn.lp-staking.instructions.step1-label')}</StepInfoLabel>
                        <StepInfoDescription>
                            {t('options.earn.lp-staking.instructions.step1-desc')}
                        </StepInfoDescription>
                    </StepInfo>
                    <StepInfo ref={step2}>
                        <StepInfoLabel>{t('options.earn.lp-staking.instructions.step2-label')}</StepInfoLabel>
                        <StepInfoDescription>
                            <Trans
                                i18nKey="options.earn.lp-staking.instructions.step2-desc"
                                components={[<UniswapExchangeLink key="1" />]}
                            />
                        </StepInfoDescription>
                    </StepInfo>
                    <StepInfo ref={step3}>
                        <StepInfoLabel>{t('options.earn.lp-staking.instructions.step3-label')}</StepInfoLabel>
                        <StepInfoDescription>
                            <Trans
                                i18nKey="options.earn.lp-staking.instructions.step3-desc"
                                components={[<ProvideLiquidityLink key="1" />]}
                            />
                        </StepInfoDescription>
                    </StepInfo>
                    <StepInfo ref={step4}>
                        <StepInfoLabel>{t('options.earn.lp-staking.instructions.step4-label')}</StepInfoLabel>
                        <StepInfoDescription>
                            {t('options.earn.lp-staking.instructions.step4-desc')}
                        </StepInfoDescription>
                    </StepInfo>
                    <StepInfo ref={step5}>
                        <StepInfoLabel>{t('options.earn.lp-staking.instructions.step5-label')}</StepInfoLabel>
                        <StepInfoDescription>
                            {t('options.earn.lp-staking.instructions.step5-desc')}
                        </StepInfoDescription>
                    </StepInfo>
                </StepsWrapper>
            </Container>
            {isMobile() && (
                <StepNavContainer>
                    <StepNav onClick={() => stepNavClickhandler(step1, 1)} selected={stepSelected === 1} />
                    <StepNav onClick={() => stepNavClickhandler(step2, 2)} selected={stepSelected === 2} />
                    <StepNav onClick={() => stepNavClickhandler(step3, 3)} selected={stepSelected === 3} />
                    <StepNav onClick={() => stepNavClickhandler(step4, 4)} selected={stepSelected === 4} />
                    <StepNav onClick={() => stepNavClickhandler(step5, 5)} selected={stepSelected === 5} />
                </StepNavContainer>
            )}
        </>
    );
};

const STEP_WIDTH = '60px';

const Container = styled.div`
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: auto min-content;
    @media (max-width: 768px) {
        overflow-x: scroll;
        &::-webkit-scrollbar {
            display: none;
        }
    }
`;

const StepsWrapper = styled.div<{ firstRow?: boolean }>`
    width: 100%;
    display: flex;
    ${(props) =>
        props.firstRow
            ? `
                align-items: center; 
                margin-bottom: 20px;
              `
            : ''};
    justify-content: ${(props) => (props.firstRow ? 'center' : 'space-around')};
    @media (max-width: 768px) {
        width: 320%;
    }
`;

const Step = styled.div`
    position: relative;
    width: ${STEP_WIDTH};
    height: 60px;
    background: var(--background);
    border-radius: 50%;
    border: 4px solid var(--input-border-color);
    color: var(--input-border-color);
    text-align: center;
    font-style: normal;
    font-weight: 700;
    font-size: 40px;
    line-height: 52px;
    text-transform: uppercase;
    cursor: default;
`;

const StepConnect = styled.div`
    width: calc(20% - ${STEP_WIDTH});
    border-top: 3px solid var(--input-border-color);
`;

const StepInfo = styled.div`
    display: flex;
    flex-direction: column;
    width: 200px;
    border: 1px dashed var(--input-border-color);
    border-radius: 15px;
    padding: 15px 10px;
    @media (min-width: 768px) and (max-width: 1192px) {
        width: 180px;
    }
`;

const StepInfoLabel = styled.span`
    padding-bottom: 15px;
    font-weight: 700;
    font-size: 15px;
    letter-spacing: 0.035em;
    text-transform: uppercase;
`;

const StepInfoDescription = styled.span`
    font-weight: 400;
    font-size: 14px;
    line-height: 15px;
`;

const StepNavContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10px;
`;

const StepNav = styled.div<{ selected: boolean }>`
    border-radius: 50%;
    background: var(--color-highlight);
    width: 14px;
    height: 14px;
    margin: 0 5px;
    ${(props) => (props.selected ? 'opacity: 1' : 'opacity: 0.5')};
`;

export default Instructions;
