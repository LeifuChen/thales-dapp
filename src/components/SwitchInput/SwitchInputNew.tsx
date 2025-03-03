import React from 'react';
import styled from 'styled-components';

type LabelProps = {
    firstLabel?: string;
    secondLabel?: string;
    fontSize?: string;
};

type SwitchProps = {
    active: boolean;
    disabled?: boolean;
    handleClick?: () => void;
    width?: string;
    height?: string;
    borderWidth?: string;
    borderColor?: string;
    background?: string;
    backgroundGradient?: boolean;
    dotSize?: string;
    dotBackground?: string;
    dotGradient?: boolean;
    label?: LabelProps;
    shadow?: boolean;
    margin?: string;
    spanColumns?: number;
};

type SwitchContainerProps = {
    disabled?: boolean;
    handleClick?: () => void;
    borderWidth?: string;
    borderColor?: string;
    width?: string;
    height?: string;
    background?: string;
    backgroundGradient?: boolean;
    shadow?: boolean;
};

type CircleProps = {
    active: boolean;
    size?: string;
    background?: string;
    backgroundGradient?: boolean;
};

const defaultSwitchHeight = 28;

const Switch: React.FC<SwitchProps> = ({
    active,
    disabled,
    handleClick,
    width,
    height,
    borderWidth,
    borderColor,
    background,
    backgroundGradient,
    dotSize,
    dotBackground,
    dotGradient,
    label,
    shadow,
    margin,
    spanColumns,
}) => {
    return (
        <Wrapper margin={margin} disabled={disabled} spanColumns={spanColumns}>
            {label?.firstLabel && <Label fontSize={label?.fontSize}>{label.firstLabel}</Label>}
            <SwitchContainer
                disabled={disabled}
                borderWidth={borderWidth}
                borderColor={borderColor}
                width={width}
                height={height}
                background={background}
                backgroundGradient={backgroundGradient}
                shadow={shadow}
                onClick={() => (!disabled && handleClick ? handleClick() : null)}
            >
                <Circle active={active} size={dotSize} background={dotBackground} backgroundGradient={dotGradient} />
            </SwitchContainer>
            {label?.secondLabel && <Label fontSize={label?.fontSize}>{label.secondLabel}</Label>}
        </Wrapper>
    );
};

const Wrapper = styled.div<{ margin?: string; disabled?: boolean; spanColumns?: number }>`
    ${(_props) => (_props?.margin ? `margin: ${_props.margin}` : '')};
    opacity: ${(props: any) => (props.disabled ? '0.4' : '1')};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    cursor: ${(props: any) => (props.disabled ? 'not-allowed' : 'default')};
    @media (max-width: 768px) {
        ${(_props) => (_props?.spanColumns ? `grid-column: span ${_props.spanColumns}` : '')};
    }
`;

const Label = styled.span<{ fontSize?: string }>`
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '12px')};
    color: var(--color-white);
    margin-left: 5px;
    margin-right: 5px;
`;

const SwitchContainer = styled.div<SwitchContainerProps>`
    display: flex;
    align-items: center;
    position: relative;
    cursor: ${(props: any) => (props.disabled ? 'not-allowed' : 'pointer')};
    border-width: ${(props: any) => (props?.borderWidth ? props.borderWidth : '1px')};
    border-style: solid;
    border-color: ${(props: any) => (props?.borderColor ? props.borderColor : 'var(--input-border-color)')};
    border-radius: 30px;
    width: ${(props: any) => (props?.width ? props.width : defaultSwitchHeight * 2.18 + 'px')};
    height: ${(props: any) => (props?.height ? props.height : defaultSwitchHeight + 'px')};
    ${(_props) => (_props.shadow ? 'box-shadow: var(--shadow)' : '')}
`;

const Circle = styled.div<CircleProps>`
    width: ${(props: any) => (props.size ? props.size : '15px')};
    height: ${(props: any) => (props.size ? props.size : '15px')};
    border-radius: 60%;
    position: absolute;
    ${(props: any) =>
        props?.background ? `background-color: ${props.background}` : `background-color: var(--input-border-color)`};
    ${(props: any) => (props?.active ? `right: 5px;` : `left: 5px;`)};
`;

export default Switch;
