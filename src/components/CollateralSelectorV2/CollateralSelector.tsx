import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useDispatch } from 'react-redux';
import { setSelectedCollateral } from 'redux/modules/wallet';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRowCentered, FlexDivStart } from 'theme/common';

type CollateralSelectorProps = {
    collateralArray: Array<string>;
    selectedItem: number;
    onChangeCollateral: (index: number) => void;
    disabled?: boolean;
};

const CollateralSelector: React.FC<CollateralSelectorProps> = ({
    collateralArray,
    selectedItem,
    onChangeCollateral,
    disabled,
}) => {
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);

    return (
        <Container>
            <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
                <SelectedCollateral disabled={!!disabled} onClick={() => !disabled && setOpen(!open)}>
                    <TextCollateralWrapper>
                        <TextCollateral>{collateralArray[selectedItem]}</TextCollateral>
                    </TextCollateralWrapper>
                    <Arrow className={open ? `icon icon--caret-up` : `icon icon--caret-down`} />
                </SelectedCollateral>
                {open && (
                    <Dropdown onClick={() => setOpen(!open)}>
                        {collateralArray.map((collateral, index) => {
                            return (
                                <CollateralOption
                                    key={index}
                                    onClick={() => {
                                        onChangeCollateral(index);
                                        dispatch(setSelectedCollateral(index));
                                    }}
                                >
                                    <TextCollateral>{collateral}</TextCollateral>
                                </CollateralOption>
                            );
                        })}
                    </Dropdown>
                )}
            </OutsideClickHandler>
        </Container>
    );
};

const Container = styled(FlexDivStart)`
    position: relative;
    margin: 0 7px;
    align-items: center;
    z-index: 2;
`;

const Text = styled.span`
    font-family: ${(props) => props.theme.fontFamily.primary};
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 15px;
`;

const TextCollateral = styled(Text)`
    color: ${(props) => props.theme.textColor.primary};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
`;

const TextCollateralWrapper = styled.div`
    min-width: 40px;
`;

const Arrow = styled.i`
    font-size: 10px;
    text-transform: none;
    color: ${(props) => props.theme.textColor.primary};
`;

const SelectedCollateral = styled(FlexDivRowCentered)<{ disabled: boolean }>`
    cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`;

const Dropdown = styled(FlexDivColumnCentered)`
    position: absolute;
    top: 30px;
    left: -7px;
    width: 76px;
    padding: 8px 0;
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
`;

const CollateralOption = styled.div`
    padding: 2px 10px;
    cursor: pointer;
    &:first-child {
        padding-top: 0;
    }
    &:last-child {
        padding-bottom: 0;
    }
    &:hover {
        background: ${(props) => props.theme.background.primary};
    }
`;

export default CollateralSelector;
