"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookSide = void 0;
const layout_1 = require("./layout");
// TODO - maybe store ref inside PerpMarket class
class BookSide {
    constructor(publicKey, perpMarket, decoded) {
        this.publicKey = publicKey;
        this.isBids = decoded.metaData.dataType === layout_1.DataType.Bids;
        this.perpMarket = perpMarket;
        Object.assign(this, decoded);
    }
    *items() {
        if (this.leafCount === 0) {
            return;
        }
        const stack = [this.rootNode];
        while (stack.length > 0) {
            const index = stack.pop();
            // @ts-ignore
            const { leafNode, innerNode } = this.nodes[index]; // we know index is undefined
            if (leafNode) {
                const price = getPriceFromKey(leafNode.key);
                yield {
                    orderId: leafNode.key,
                    clientId: leafNode.clientOrderId,
                    owner: leafNode.owner,
                    openOrdersSlot: leafNode.ownerSlot,
                    feeTier: 0,
                    price: this.perpMarket.priceLotsToNumber(price),
                    priceLots: price,
                    size: this.perpMarket.baseLotsToNumber(leafNode.quantity),
                    sizeLots: leafNode.quantity,
                    side: (this.isBids ? 'buy' : 'sell'),
                    bestInitial: leafNode.bestInitial,
                    timestamp: leafNode.timestamp,
                };
            }
            else if (innerNode) {
                if (this.isBids) {
                    stack.push(innerNode.children[0], innerNode.children[1]);
                }
                else {
                    stack.push(innerNode.children[1], innerNode.children[0]);
                }
            }
        }
    }
    [Symbol.iterator]() {
        return this.items();
    }
    getL2(depth) {
        const levels = []; // (price, size)
        //@ts-ignore
        for (const { priceLots, sizeLots } of this.items()) {
            if (levels.length > 0 && levels[levels.length - 1][0].eq(priceLots)) {
                levels[levels.length - 1][1].iadd(sizeLots);
            }
            else if (levels.length === depth) {
                break;
            }
            else {
                levels.push([priceLots, sizeLots]);
            }
        }
        return levels.map(([priceLots, sizeLots]) => [
            this.perpMarket.priceLotsToNumber(priceLots),
            this.perpMarket.baseLotsToNumber(sizeLots),
            priceLots,
            sizeLots,
        ]);
    }
}
exports.BookSide = BookSide;
function getPriceFromKey(key) {
    return key.ushrn(64); // TODO - maybe use shrn instead
}
//# sourceMappingURL=book.js.map