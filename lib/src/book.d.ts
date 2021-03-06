import BN from 'bn.js';
import { PublicKey } from '@gemachain/web3.js';
import PerpMarket from './PerpMarket';
export interface PerpOrder {
    orderId: BN;
    owner: PublicKey;
    openOrdersSlot: number;
    price: number;
    priceLots: BN;
    size: number;
    feeTier: number;
    sizeLots: BN;
    side: 'buy' | 'sell';
    clientId?: BN;
    bestInitial: BN;
    timestamp: BN;
}
export declare class BookSide {
    publicKey: PublicKey;
    isBids: boolean;
    perpMarket: PerpMarket;
    bumpIndex: number;
    freeListLen: number;
    freelistHead: number;
    rootNode: number;
    leafCount: number;
    nodes: any[];
    constructor(publicKey: PublicKey, perpMarket: PerpMarket, decoded: any);
    items(): Generator<PerpOrder>;
    [Symbol.iterator](): Generator<PerpOrder, any, unknown>;
    getL2(depth: number): [number, number, BN, BN][];
}
//# sourceMappingURL=book.d.ts.map