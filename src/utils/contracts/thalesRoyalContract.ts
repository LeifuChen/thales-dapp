import { Network } from 'utils/network';

export const thalesRoyaleContract = {
    addresses: {
        [Network.Mainnet]: 'TBD',
        [Network.Ropsten]: 'TBD',
        [Network.Rinkeby]: 'TBD',
        [Network.Kovan]: 'TBD',
        // added to resolve error with typings
        [Network.Goerli]: '', // TODO: goerli network remove or implement
        [Network['Mainnet-Ovm']]: '0x3198ab211CdF3E4d13a698E1Fb819507BcA2e579',
        [Network['Kovan-Ovm']]: '0x5De27390C8280Db5732Ee6aA7f7aBC4e2a476B30',
        [Network['Goerli-Ovm']]: 'TBD',
        [Network['POLYGON-MUMBAI']]: 'TBD',
        [Network['POLYGON-MAINNET']]: 'TBD',
        [Network.BSC]: 'TBD',
        [Network.Arbitrum]: 'TBD',
    },
    abi: [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'buyInAmount',
                    type: 'uint256',
                },
            ],
            name: 'NewBuyInAmount',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'nextSeasonStartsAutomatically',
                    type: 'bool',
                },
            ],
            name: 'NewNextSeasonStartsAutomatically',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_rounds',
                    type: 'uint256',
                },
            ],
            name: 'NewNumberOfRounds',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'bytes32',
                    name: '_oracleKey',
                    type: 'bytes32',
                },
            ],
            name: 'NewOracleKey',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'pauseBetweenSeasonsTime',
                    type: 'uint256',
                },
            ],
            name: 'NewPauseBetweenSeasonsTime',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'contract IPriceFeed',
                    name: 'priceFeed',
                    type: 'address',
                },
            ],
            name: 'NewPriceFeed',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_rewardToken',
                    type: 'address',
                },
            ],
            name: 'NewRewardToken',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'roundChoosingLength',
                    type: 'uint256',
                },
            ],
            name: 'NewRoundChoosingLength',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'roundLength',
                    type: 'uint256',
                },
            ],
            name: 'NewRoundLength',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_safeBox',
                    type: 'address',
                },
            ],
            name: 'NewSafeBox',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: '_safeBoxPercentage',
                    type: 'uint256',
                },
            ],
            name: 'NewSafeBoxPercentage',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'season',
                    type: 'uint256',
                },
            ],
            name: 'NewSeasonStarted',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'signUpPeriod',
                    type: 'uint256',
                },
            ],
            name: 'NewSignUpPeriod',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_royalePass',
                    type: 'address',
                },
            ],
            name: 'NewThalesRoyalePass',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'contract IThalesRoyalePassport',
                    name: '_thalesRoyalePassport',
                    type: 'address',
                },
            ],
            name: 'NewThalesRoyalePassport',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'oldOwner',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'newOwner',
                    type: 'address',
                },
            ],
            name: 'OwnerChanged',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'newOwner',
                    type: 'address',
                },
            ],
            name: 'OwnerNominated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'Paused',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'from',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'season',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'PutFunds',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'season',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'winner',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'reward',
                    type: 'uint256',
                },
            ],
            name: 'RewardClaimed',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'season',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'winner',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'tokenId',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'reward',
                    type: 'uint256',
                },
            ],
            name: 'RewardClaimedPassport',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'season',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'round',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'result',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'strikePrice',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'finalPrice',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'numberOfEliminatedPlayers',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'numberOfWinningPlayers',
                    type: 'uint256',
                },
            ],
            name: 'RoundClosed',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'season',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'numberOfWinners',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'rewardPerWinner',
                    type: 'uint256',
                },
            ],
            name: 'RoyaleFinished',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'season',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'totalTokens',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'totalReward',
                    type: 'uint256',
                },
            ],
            name: 'RoyaleStarted',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'user',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'season',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'position',
                    type: 'uint256',
                },
            ],
            name: 'SignedUp',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'user',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'tokenId',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'season',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256[]',
                    name: 'positions',
                    type: 'uint256[]',
                },
            ],
            name: 'SignedUpPassport',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'user',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'season',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'round',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'position',
                    type: 'uint256',
                },
            ],
            name: 'TookAPosition',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'Unpaused',
            type: 'event',
        },
        {
            inputs: [],
            name: 'DOWN',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'UP',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'acceptOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'buyInAmount',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'canCloseRound',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'canSeasonBeAutomaticallyStartedAfterSomePeriod',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'canStartNewSeason',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'canStartRoyale',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_season',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'tokenId',
                    type: 'uint256',
                },
            ],
            name: 'claimRewardForSeason',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'closeRound',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'eliminatedPerRoundPerSeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'finalPricePerRoundPerSeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'getBuyInAmount',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'tokenId',
                    type: 'uint256',
                },
            ],
            name: 'getTokenPositions',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'uint256',
                            name: 'round',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'position',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct IPassportPosition.Position[]',
                    name: '',
                    type: 'tuple[]',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_season',
                    type: 'uint256',
                },
            ],
            name: 'getTokensForSeason',
            outputs: [
                {
                    internalType: 'uint256[]',
                    name: '',
                    type: 'uint256[]',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_player',
                    type: 'address',
                },
            ],
            name: 'hasParticipatedInCurrentOrLastRoyale',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'initNonReentrant',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
                {
                    internalType: 'bytes32',
                    name: '_oracleKey',
                    type: 'bytes32',
                },
                {
                    internalType: 'contract IPriceFeed',
                    name: '_priceFeed',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_rewardToken',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_rounds',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_signUpPeriod',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_roundChoosingLength',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_roundLength',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_buyInAmount',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_pauseBetweenSeasonsTime',
                    type: 'uint256',
                },
                {
                    internalType: 'bool',
                    name: '_nextSeasonStartsAutomatically',
                    type: 'bool',
                },
            ],
            name: 'initialize',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'tokenId',
                    type: 'uint256',
                },
            ],
            name: 'isTokenAlive',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'tokenId',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_season',
                    type: 'uint256',
                },
            ],
            name: 'isTokenAliveInASpecificSeason',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'mintedTokensCount',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'nextSeasonStartsAutomatically',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
            ],
            name: 'nominateNewOwner',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'nominatedOwner',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'oracleKey',
            outputs: [
                {
                    internalType: 'bytes32',
                    name: '',
                    type: 'bytes32',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'oracleKeyPerSeason',
            outputs: [
                {
                    internalType: 'bytes32',
                    name: '',
                    type: 'bytes32',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'owner',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'pauseBetweenSeasonsTime',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'paused',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'playerSignedUpPerSeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'playersPerSeason',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'positionInARoundPerSeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'positionsPerRoundPerSeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'priceFeed',
            outputs: [
                {
                    internalType: 'contract IPriceFeed',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_amount',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_season',
                    type: 'uint256',
                },
            ],
            name: 'putFunds',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'rewardCollectedPerSeason',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'rewardPerSeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'rewardPerWinnerPerSeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'rewardToken',
            outputs: [
                {
                    internalType: 'contract IERC20Upgradeable',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'roundChoosingLength',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'roundInASeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'roundInASeasonStartTime',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'roundInSeasonEndTime',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'roundLength',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'roundResultPerSeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'roundTargetPrice',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'rounds',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'royaleInSeasonStarted',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'royalePass',
            outputs: [
                {
                    internalType: 'contract IThalesRoyalePass',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'royaleSeasonEndTime',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'safeBox',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'safeBoxPercentage',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'season',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'seasonCreationTime',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'seasonFinished',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'seasonStarted',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_buyInAmount',
                    type: 'uint256',
                },
            ],
            name: 'setBuyInAmount',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bool',
                    name: '_nextSeasonStartsAutomatically',
                    type: 'bool',
                },
            ],
            name: 'setNextSeasonStartsAutomatically',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_rounds',
                    type: 'uint256',
                },
            ],
            name: 'setNumberOfRounds',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes32',
                    name: '_oracleKey',
                    type: 'bytes32',
                },
            ],
            name: 'setOracleKey',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
            ],
            name: 'setOwner',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_pauseBetweenSeasonsTime',
                    type: 'uint256',
                },
            ],
            name: 'setPauseBetweenSeasonsTime',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'contract IPriceFeed',
                    name: '_priceFeed',
                    type: 'address',
                },
            ],
            name: 'setPriceFeed',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_rewardToken',
                    type: 'address',
                },
            ],
            name: 'setRewardToken',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_roundChoosingLength',
                    type: 'uint256',
                },
            ],
            name: 'setRoundChoosingLength',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_roundLength',
                    type: 'uint256',
                },
            ],
            name: 'setRoundLength',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_royalePass',
                    type: 'address',
                },
            ],
            name: 'setRoyalePassAddress',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_safeBox',
                    type: 'address',
                },
            ],
            name: 'setSafeBox',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_safeBoxPercentage',
                    type: 'uint256',
                },
            ],
            name: 'setSafeBoxPercentage',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_signUpPeriod',
                    type: 'uint256',
                },
            ],
            name: 'setSignUpPeriod',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'contract IThalesRoyalePassport',
                    name: '_thalesRoyalePassport',
                    type: 'address',
                },
            ],
            name: 'setThalesRoyalePassport',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'signUp',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'signUpPeriod',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'passId',
                    type: 'uint256',
                },
            ],
            name: 'signUpWithPass',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'passId',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256[]',
                    name: '_positions',
                    type: 'uint256[]',
                },
            ],
            name: 'signUpWithPassWithPosition',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256[]',
                    name: '_positions',
                    type: 'uint256[]',
                },
            ],
            name: 'signUpWithPosition',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'signedUpPlayersCount',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'startNewSeason',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'startRoyaleInASeason',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: 'tokenId',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'position',
                    type: 'uint256',
                },
            ],
            name: 'takeAPosition',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'targetPricePerRoundPerSeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'thalesRoyalePassport',
            outputs: [
                {
                    internalType: 'contract IThalesRoyalePassport',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'tokenPositionInARoundPerSeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'tokenPositions',
            outputs: [
                {
                    internalType: 'uint256',
                    name: 'round',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'position',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'tokenRewardCollectedPerSeason',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'tokenSeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'tokensMintedPerSeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'tokensPerSeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'totalPlayersPerRoundPerSeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'totalTokensPerRoundPerSeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'proxyAddress',
                    type: 'address',
                },
            ],
            name: 'transferOwnershipAtInit',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'unclaimedRewardPerSeason',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
    ],
};

export default thalesRoyaleContract;
