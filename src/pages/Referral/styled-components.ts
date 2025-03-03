import styled from 'styled-components';

export const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 520px) {
        width: 100%;
        margin-bottom: 20px;
    }
`;

export const Label = styled.span`
    font-size: 18px;
    line-height: 18px;
    color: var(--color-white);
`;

export const StatisticsWrapper = styled.div`
    border: 1.73987px solid var(--input-border-color);
    padding: 16px 32px;
    border-radius: 13.049px;
    @media screen and (max-width: 520px) {
        width: 100%;
        margin-bottom: 20px;
    }
`;

export const KeyValue = styled.span`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export const StatLabel = styled.span<{ color?: string }>`
    font-size: 21px;
    line-height: 26.53px;
    color: ${(_props) => (_props?.color ? _props.color : 'var(--color-white)')};
`;

export const StatValue = styled(StatLabel)<{ customColor?: string }>`
    font-weight: 700;
    color: ${(_props) => (_props?.color ? _props.color : 'var(--color-white)')};
    padding-left: 100px;
    text-align: right;
    @media screen and (max-width: 520px) {
        padding-left: 0px;
    }
`;

export const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 31px;
    @media screen and (max-width: 520px) {
        justify-content: center;
        margin-bottom: 0;
    }
`;

export const DescriptionContainer = styled.div`
    color: var(--color-white);
    display: block;
    width: 40%;
    @media screen and (max-width: 520px) {
        width: 100%;
        margin-bottom: 20px;
    }
`;

export const Text = styled.p<{ height?: string }>`
    color: var(--color-white);
    font-size: 16px;
    font-weight: 100 !important;
    line-height: 150%;
    height: ${(_props) => (_props?.height ? _props.height : '')};
    transition: height 0.3s ease-out;
    overflow: hidden;
    font-family: 'Roboto Thin' !important;
`;

export const TableWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 100px;
    @media (max-width: 768px) {
        margin-bottom: 10px;
    }
`;

export const RowContrainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 7px 0;
`;

export const InputField = styled.input`
    border: 1px solid var(--input-border-color);
    background: rgba(0, 0, 0, 0);
    border-radius: 30px;
    color: var(--input-border-color);
    width: 100%;
    height: 34px;
    font-size: 16px;
    padding-left: 12px;
    padding-right: 12px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    &::placeholder {
        color: var(--input-border-color);
    }
`;
