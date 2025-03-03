import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { useTranslation } from 'react-i18next';
import { getIsAppReady } from 'redux/modules/app';
import { LiquidityPoolPnls } from 'types/liquidityPool';
import useLiquidityPoolPnlsQuery from 'queries/liquidityPool/useLiquidityPoolPnlsQuery';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LineChart,
    Line,
} from 'recharts';
import { Colors, FlexDivCentered, FlexDivColumn, FlexDivColumnCentered, FlexDivRow } from 'theme/common';
import { formatPercentageWithSign } from 'utils/formatters/number';
import { LiquidityPoolPnlType } from 'constants/liquidityPool';
import { UI_COLORS } from 'constants/ui';

type PnlProps = {
    lifetimePnl: number;
    type: LiquidityPoolPnlType;
};

const PnL: React.FC<PnlProps> = ({ lifetimePnl, type }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [liquidityPoolPnls, setLiquidityPoolPnls] = useState<LiquidityPoolPnls>([]);

    const liquidityPoolPnlsQuery = useLiquidityPoolPnlsQuery(networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (liquidityPoolPnlsQuery.isSuccess && liquidityPoolPnlsQuery.data) {
            setLiquidityPoolPnls(
                type === LiquidityPoolPnlType.CUMULATIVE_PNL && liquidityPoolPnlsQuery.data.length > 0
                    ? [
                          {
                              round: '',
                              pnlPerRound: 0,
                              cumulativePnl: 0,
                          },
                          ...liquidityPoolPnlsQuery.data,
                      ]
                    : liquidityPoolPnlsQuery.data
            );
        } else {
            setLiquidityPoolPnls([]);
        }
    }, [liquidityPoolPnlsQuery.isSuccess, liquidityPoolPnlsQuery.data, type]);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <TooltipContainer>
                    <TooltipAmount>{formatPercentageWithSign(payload[0].value)}</TooltipAmount>
                </TooltipContainer>
            );
        }
        return null;
    };

    const CustomizedDot: React.FC = (props: any) => {
        const { cx, cy, value } = props;

        return (
            <svg height="8" width="8" overflow="visible">
                <circle
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill={value === 0 ? '#8884d8' : value > 0 ? UI_COLORS.GREEN : UI_COLORS.RED}
                />
            </svg>
        );
    };

    const noData = liquidityPoolPnls.length === 0;

    const Chart = type === LiquidityPoolPnlType.PNL_PER_ROUND ? BarChart : LineChart;

    return (
        <Container>
            <Header noData={noData}>
                <Title>{t(`liquidity-pool.pnl.${type}.title`)}</Title>
                {type === LiquidityPoolPnlType.CUMULATIVE_PNL && (
                    <LifetimePnlContainer>
                        <LifetimePnlLabel>{t('liquidity-pool.pnl.lifetime-pnl')}:</LifetimePnlLabel>
                        <LifetimePnl
                            color={
                                lifetimePnl === 0 ? UI_COLORS.WHITE : lifetimePnl > 0 ? UI_COLORS.GREEN : UI_COLORS.RED
                            }
                        >
                            {formatPercentageWithSign(lifetimePnl)}
                        </LifetimePnl>
                    </LifetimePnlContainer>
                )}
            </Header>
            {!noData ? (
                <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                        <Chart data={liquidityPoolPnls}>
                            <CartesianGrid strokeDasharray="2 2" strokeWidth={0.5} stroke={Colors.GRAY_LIGHT} />
                            <XAxis
                                dataKey="round"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: Colors.GRAY_LIGHT }}
                                style={{
                                    fontSize: '13px',
                                }}
                            />
                            <YAxis
                                tickFormatter={(val: any) => {
                                    return formatPercentageWithSign(val, val < 0.1 && val > -0.1 ? 2 : 0);
                                }}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: Colors.GRAY_LIGHT }}
                                style={{
                                    fontSize: '13px',
                                }}
                                width={55}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: Colors.GRAY_LIGHT, fillOpacity: '0.2' }}
                                wrapperStyle={{ outline: 'none' }}
                            />
                            {type === LiquidityPoolPnlType.PNL_PER_ROUND ? (
                                <Bar dataKey="pnlPerRound" radius={[4, 4, 0, 0]} maxBarSize={60}>
                                    {liquidityPoolPnls.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.pnlPerRound > 0 ? UI_COLORS.GREEN : UI_COLORS.RED}
                                        />
                                    ))}
                                </Bar>
                            ) : (
                                <Line
                                    type="monotone"
                                    dataKey="cumulativePnl"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    dot={<CustomizedDot />}
                                />
                            )}
                        </Chart>
                    </ResponsiveContainer>
                </ChartContainer>
            ) : (
                <NoData>{t(`liquidity-pool.pnl.no-data`)}</NoData>
            )}
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    width: 100%;
`;

const ChartContainer = styled.div`
    height: 220px;
    width: 100%;
    @media (max-width: 767px) {
        height: 200px;
    }
`;

const TooltipContainer = styled(FlexDivColumnCentered)`
    border-radius: 3px;
    z-index: 999;
    padding: 2px 10px;
    background: ${(props) => props.theme.background.tertiary};
    color: ${(props) => props.theme.textColor.primary};
`;

const TooltipAmount = styled(FlexDivColumn)`
    font-weight: bold;
    font-size: 13px;
    text-align: center;
`;

const Header = styled(FlexDivRow)<{ noData?: boolean }>`
    margin: ${(props) => (props.noData ? '20px 0px 5px 0px' : '20px 6px 5px 58px')};
`;

const Title = styled.span`
    color: ${(props) => props.theme.textColor.secondary};
`;

const LifetimePnlContainer = styled(FlexDivRow)`
    align-items: center;
`;

const LifetimePnlLabel = styled.span``;

const LifetimePnl = styled.span<{ color: string }>`
    font-weight: 600;
    margin-left: 6px;
    color: ${(props) => props.color};
`;

const NoData = styled(FlexDivCentered)`
    border: 2px dotted ${(props) => props.theme.borderColor.primary};
    margin-bottom: 10px;
    height: 200px;
    color: ${(props) => props.theme.textColor.secondary};
    padding: 10px;
    text-align: center;
`;

export default PnL;
