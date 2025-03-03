import React, { useState } from 'react';
import styled from 'styled-components';
import { Image } from 'theme/common';
import { history } from 'utils/routes';
import queryString from 'query-string';
import snxStakingActiveIcon from 'assets/images/snx-staking-active.png';
import snxStakingIcon from 'assets/images/snx-staking.png';
import stakingActiveIcon from 'assets/images/staking-active.svg';
import stakingIcon from 'assets/images/staking.svg';
import vestingActiveIcon from 'assets/images/vesting-active.svg';
import vestingIcon from 'assets/images/vesting.svg';
import lpActiveIcon from 'assets/images/lp-active.svg';
import lpIcon from 'assets/images/lp.svg';
import lpl2ActiveIcon from 'assets/images/lp-l2-active.svg';
import lpl2Icon from 'assets/images/lp-l2.svg';
import migrationActiveIcon from 'assets/images/migration-active.svg';
import migrationIcon from 'assets/images/migration.svg';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsArbitrum, getIsOVM } from 'utils/network';
import { RootState } from 'redux/rootReducer';
import { TokenTabEnum, TokenTabSectionIdEnum } from 'types/token';

type TokenNavProps = {
    setSelectedTab: any;
    selectedTab: any;
    setSelectedSection: (sectionId: TokenTabSectionIdEnum) => void;
    selectedSection: TokenTabSectionIdEnum | undefined;
};

const TokenNavFooter: React.FC<TokenNavProps> = ({
    selectedTab,
    setSelectedTab,
    selectedSection,
    setSelectedSection,
}) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);
    const isArb = getIsArbitrum(networkId);

    const [showNav, setShowNav] = useState(false);

    return (
        <NavFooter>
            <BurgerWrapper onClick={setShowNav.bind(this, !showNav)}>
                <BurgerLine />
                <BurgerLine />
                <BurgerLine />
            </BurgerWrapper>
            {showNav && (
                <Container>
                    <Icon
                        onClick={() => {
                            history.push({
                                pathname: location.pathname,
                                search: queryString.stringify({
                                    tab: TokenTabEnum.GAMIFIED_STAKING,
                                }),
                            });
                            setSelectedTab(TokenTabEnum.GAMIFIED_STAKING);
                            setSelectedSection(TokenTabSectionIdEnum.STAKING);
                        }}
                        src={selectedSection === TokenTabSectionIdEnum.STAKING ? stakingActiveIcon : stakingIcon}
                    />
                    {(isL2 || isArb) && (
                        <Icon
                            onClick={() => {
                                history.push({
                                    pathname: location.pathname,
                                    search: queryString.stringify({
                                        tab: TokenTabEnum.GAMIFIED_STAKING,
                                    }),
                                });
                                setSelectedTab(TokenTabEnum.GAMIFIED_STAKING);
                                setSelectedSection(TokenTabSectionIdEnum.REWARDS);
                            }}
                            src={
                                selectedSection === TokenTabSectionIdEnum.REWARDS
                                    ? snxStakingActiveIcon
                                    : snxStakingIcon
                            }
                        />
                    )}
                    {(isL2 || isArb) && (
                        <Icon
                            onClick={() => {
                                history.push({
                                    pathname: location.pathname,
                                    search: queryString.stringify({
                                        tab: TokenTabEnum.GAMIFIED_STAKING,
                                    }),
                                });
                                setSelectedTab(TokenTabEnum.GAMIFIED_STAKING);
                                setSelectedSection(TokenTabSectionIdEnum.VESTING);
                            }}
                            src={selectedSection === TokenTabSectionIdEnum.VESTING ? vestingActiveIcon : vestingIcon}
                        />
                    )}
                    {(isL2 || isArb) && (
                        <Icon
                            onClick={() => {
                                history.push({
                                    pathname: location.pathname,
                                    search: queryString.stringify({
                                        tab: TokenTabEnum.GAMIFIED_STAKING,
                                    }),
                                });
                                setSelectedTab(TokenTabEnum.GAMIFIED_STAKING);
                                setSelectedSection(TokenTabSectionIdEnum.MERGE_ACCOUNT);
                            }}
                            src={
                                selectedSection === TokenTabSectionIdEnum.MERGE_ACCOUNT
                                    ? migrationActiveIcon
                                    : migrationIcon
                            }
                        />
                    )}
                    {!isArb && (
                        <Icon
                            onClick={() => {
                                history.push({
                                    pathname: location.pathname,
                                    search: queryString.stringify({
                                        tab: TokenTabEnum.LP_STAKING,
                                    }),
                                });
                                setSelectedTab(TokenTabEnum.LP_STAKING);
                                setSelectedSection(TokenTabSectionIdEnum.LP_STAKING);
                            }}
                            src={
                                selectedTab === TokenTabEnum.LP_STAKING
                                    ? isL2
                                        ? lpl2ActiveIcon
                                        : lpActiveIcon
                                    : isL2
                                    ? lpl2Icon
                                    : lpIcon
                            }
                        />
                    )}

                    {!isL2 && !isArb && (
                        <Icon
                            onClick={() => {
                                history.push({
                                    pathname: location.pathname,
                                    search: queryString.stringify({
                                        tab: TokenTabEnum.MIGRATION,
                                    }),
                                });
                                setSelectedTab(TokenTabEnum.MIGRATION);
                            }}
                            src={selectedTab === TokenTabEnum.MIGRATION ? migrationActiveIcon : migrationIcon}
                        />
                    )}
                    {!isL2 && !isArb && (
                        <Icon
                            onClick={() => {
                                history.push({
                                    pathname: location.pathname,
                                    search: queryString.stringify({
                                        tab: TokenTabEnum.STRATEGIC_INVESTORS,
                                    }),
                                });
                                setSelectedTab(TokenTabEnum.STRATEGIC_INVESTORS);
                            }}
                            src={
                                selectedTab === TokenTabEnum.STRATEGIC_INVESTORS ? snxStakingActiveIcon : snxStakingIcon
                            }
                        />
                    )}
                </Container>
            )}
        </NavFooter>
    );
};

const NavFooter = styled.div`
    @media (min-width: 767px) {
        display: none;
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 85px;
    left: 0;
    width: 100px;
    padding: 0 10px;
    z-index: 999;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 145px;
    left: 0;
    width: 100px;
`;

const Icon = styled(Image)`
    width: 42px;
    height: 42px;
    padding: 4px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 26.1818px;
    margin-top: 4px;
`;

const BurgerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 26.1818px;
`;

const BurgerLine = styled.div`
    width: 27px;
    height: 4px;
    background: ${(props) => props.theme.textColor.primary};
    border-radius: 5px;
    &:nth-child(2) {
        margin-top: 4px;
        margin-bottom: 4px;
    }
`;

export default TokenNavFooter;
