import { Market, OpenOrders } from '@project-serum/serum';
import { Connection, PublicKey } from '@gemachain/web3.js';
import { I80F48 } from './fixednum';
import { MangoCache, MetaData, RootBankCache } from './layout';
import RootBank from './RootBank';
import BN from 'bn.js';
import MangoGroup from './MangoGroup';
import PerpAccount from './PerpAccount';
import { GroupConfig } from '.';
import PerpMarket from './PerpMarket';
export default class MangoAccount {
    publicKey: PublicKey;
    metaData: MetaData;
    mangoGroup: PublicKey;
    owner: PublicKey;
    inMarginBasket: boolean[];
    numInMarginBasket: number;
    deposits: I80F48[];
    borrows: I80F48[];
    spotOpenOrders: PublicKey[];
    spotOpenOrdersAccounts: (OpenOrders | undefined)[];
    perpAccounts: PerpAccount[];
    orderMarket: number[];
    orderSide: string[];
    orders: BN[];
    clientOrderIds: BN[];
    msrmAmount: BN;
    beingLiquidated: boolean;
    isBankrupt: boolean;
    info: number[];
    constructor(publicKey: PublicKey, decoded: any);
    get name(): string;
    reload(connection: Connection, dexProgramId?: PublicKey | undefined): Promise<MangoAccount>;
    loadOpenOrders(connection: Connection, serumDexPk: PublicKey): Promise<(OpenOrders | undefined)[]>;
    getNativeDeposit(rootBank: RootBank | RootBankCache, tokenIndex: number): I80F48;
    getNativeBorrow(rootBank: RootBank | RootBankCache, tokenIndex: number): I80F48;
    getUiDeposit(rootBank: RootBank | RootBankCache, mangoGroup: MangoGroup, tokenIndex: number): I80F48;
    getUiBorrow(rootBank: RootBank | RootBankCache, mangoGroup: MangoGroup, tokenIndex: number): I80F48;
    getSpotVal(mangoGroup: any, mangoCache: any, index: any, assetWeight: any): I80F48;
    getAssetsVal(mangoGroup: MangoGroup, mangoCache: MangoCache, healthType?: HealthType): I80F48;
    getLiabsVal(mangoGroup: MangoGroup, mangoCache: MangoCache, healthType?: HealthType): I80F48;
    getNativeLiabsVal(mangoGroup: MangoGroup, mangoCache: MangoCache, healthType?: HealthType): I80F48;
    /**
     * deposits - borrows in native terms
     */
    getNet(bankCache: RootBankCache, tokenIndex: number): I80F48;
    /**
     * Take health components and return the assets and liabs weighted
     */
    getWeightedAssetsLiabsVals(mangoGroup: MangoGroup, mangoCache: MangoCache, spot: I80F48[], perps: I80F48[], quote: I80F48, healthType?: HealthType): {
        assets: I80F48;
        liabs: I80F48;
    };
    getHealthFromComponents(mangoGroup: MangoGroup, mangoCache: MangoCache, spot: I80F48[], perps: I80F48[], quote: I80F48, healthType: HealthType): I80F48;
    getHealthsFromComponents(mangoGroup: MangoGroup, mangoCache: MangoCache, spot: I80F48[], perps: I80F48[], quote: I80F48, healthType: HealthType): {
        spot: I80F48;
        perp: I80F48;
    };
    /**
     * Amount of native quote currency available to expand your position in this market
     */
    getMarketMarginAvailable(mangoGroup: MangoGroup, mangoCache: MangoCache, marketIndex: number, marketType: 'spot' | 'perp'): I80F48;
    /**
     * Get token amount available to withdraw without borrowing.
     */
    getAvailableBalance(mangoGroup: MangoGroup, mangoCache: MangoCache, tokenIndex: number): I80F48;
    /**
     * Return the spot, perps and quote currency values after adjusting for
     * worst case open orders scenarios. These values are not adjusted for health
     * type
     * @param mangoGroup
     * @param mangoCache
     */
    getHealthComponents(mangoGroup: MangoGroup, mangoCache: MangoCache): {
        spot: I80F48[];
        perps: I80F48[];
        quote: I80F48;
    };
    getHealth(mangoGroup: MangoGroup, mangoCache: MangoCache, healthType: HealthType): I80F48;
    getHealthRatio(mangoGroup: MangoGroup, mangoCache: MangoCache, healthType: HealthType): I80F48;
    computeValue(mangoGroup: MangoGroup, mangoCache: MangoCache): I80F48;
    getLeverage(mangoGroup: MangoGroup, mangoCache: MangoCache): I80F48;
    getMaxLeverageForMarket(mangoGroup: MangoGroup, mangoCache: MangoCache, marketIndex: number, market: Market | PerpMarket, side: 'buy' | 'sell', price: I80F48): {
        max: I80F48;
        uiDepositVal: I80F48;
        deposits: I80F48;
        uiBorrowVal: I80F48;
        borrows: I80F48;
    };
    getMaxWithBorrowForToken(mangoGroup: MangoGroup, mangoCache: MangoCache, tokenIndex: number): I80F48;
    toPrettyString(groupConfig: GroupConfig, mangoGroup: MangoGroup, cache: MangoCache): string;
}
export declare type HealthType = 'Init' | 'Maint';
//# sourceMappingURL=MangoAccount.d.ts.map