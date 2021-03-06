"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeForceSettleQuotePositionsInstruction = exports.makeSetGroupAdminInstruction = exports.makeChangePerpMarketParamsInstruction = exports.makeWithdrawMsrmInstruction = exports.makeDepositMsrmInstruction = exports.makeAddMangoAccountInfoInstruction = exports.makeRedeemMngoInstruction = exports.makeResolveTokenBankruptcyInstruction = exports.makeResolvePerpBankruptcyInstruction = exports.makeSettleFeesInstruction = exports.makeLiquidatePerpMarketInstruction = exports.makeLiquidateTokenAndPerpInstruction = exports.makeLiquidateTokenAndTokenInstruction = exports.makeForceCancelPerpOrdersInstruction = exports.makeForceCancelSpotOrdersInstruction = exports.makeUpdateFundingInstruction = exports.makePlacePerpOrderInstruction = exports.makeConsumeEventsInstruction = exports.makeSettlePnlInstruction = exports.makeCachePerpMarketsInstruction = exports.makeAddPerpMarketInstruction = exports.makeSetOracleInstruction = exports.makeAddOracleInstruction = exports.makeUpdateRootBankInstruction = exports.makePlaceSpotOrderInstruction = exports.makeInitSpotOpenOrdersInstruction = exports.makeAddSpotMarketInstruction = exports.makeCachePerpMarketInstruction = exports.makeCachePricesInstruction = exports.makeCacheRootBankInstruction = exports.makeDepositInstruction = exports.makeCancelAllPerpOrdersInstruction = exports.makeCancelPerpOrderByClientIdInstruction = exports.makeCancelPerpOrderInstruction = exports.makeCancelSpotOrderInstruction = exports.makeSettleFundsInstruction = exports.makeWithdrawInstruction = exports.makeInitMangoAccountInstruction = exports.makeInitMangoGroupInstruction = void 0;
const web3_js_1 = require("@gemachain/web3.js");
const layout_1 = require("./layout");
const bn_js_1 = __importDefault(require("bn.js"));
const spl_token_1 = require("@gemachain/gpl-token");
const fixednum_1 = require("./fixednum");
function makeInitMangoGroupInstruction(programId, mangoGroupPk, signerKey, payerPk, quoteMintPk, quoteVaultPk, quoteNodeBankPk, quoteRootBankPk, insuranceVaultPk, msrmVaultPk, feesVaultPk, mangoCachePk, dexProgramPk, signerNonce, validInterval, quoteOptimalUtil, quoteOptimalRate, quoteMaxRate) {
    const keys = [
        { isSigner: false, isWritable: true, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: false, pubkey: signerKey },
        { isSigner: true, isWritable: false, pubkey: payerPk },
        { isSigner: false, isWritable: false, pubkey: quoteMintPk },
        { isSigner: false, isWritable: true, pubkey: quoteVaultPk },
        { isSigner: false, isWritable: true, pubkey: quoteNodeBankPk },
        { isSigner: false, isWritable: true, pubkey: quoteRootBankPk },
        { isSigner: false, isWritable: false, pubkey: insuranceVaultPk },
        { isSigner: false, isWritable: false, pubkey: msrmVaultPk },
        { isSigner: false, isWritable: false, pubkey: feesVaultPk },
        { isSigner: false, isWritable: true, pubkey: mangoCachePk },
        { isSigner: false, isWritable: false, pubkey: dexProgramPk },
    ];
    const data = layout_1.encodeMangoInstruction({
        InitMangoGroup: {
            signerNonce,
            validInterval,
            quoteOptimalUtil,
            quoteOptimalRate,
            quoteMaxRate,
        },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId: programId,
    });
}
exports.makeInitMangoGroupInstruction = makeInitMangoGroupInstruction;
function makeInitMangoAccountInstruction(programId, mangoGroupPk, mangoAccountPk, ownerPk) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoAccountPk },
        { isSigner: true, isWritable: false, pubkey: ownerPk },
    ];
    const data = layout_1.encodeMangoInstruction({ InitMangoAccount: {} });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeInitMangoAccountInstruction = makeInitMangoAccountInstruction;
function makeWithdrawInstruction(programId, mangoGroupPk, mangoAccountPk, walletPk, mangoCachePk, rootBankPk, nodeBankPk, vaultPk, tokenAccPk, signerKey, openOrders, nativeQuantity, allowBorrow) {
    const withdrawKeys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoAccountPk },
        { isSigner: true, isWritable: false, pubkey: walletPk },
        { isSigner: false, isWritable: false, pubkey: mangoCachePk },
        { isSigner: false, isWritable: false, pubkey: rootBankPk },
        { isSigner: false, isWritable: true, pubkey: nodeBankPk },
        { isSigner: false, isWritable: true, pubkey: vaultPk },
        { isSigner: false, isWritable: true, pubkey: tokenAccPk },
        { isSigner: false, isWritable: false, pubkey: signerKey },
        { isSigner: false, isWritable: false, pubkey: spl_token_1.TOKEN_PROGRAM_ID },
        ...openOrders.map((pubkey) => ({
            isSigner: false,
            isWritable: false,
            pubkey,
        })),
    ];
    const withdrawData = layout_1.encodeMangoInstruction({
        Withdraw: { quantity: nativeQuantity, allowBorrow },
    });
    return new web3_js_1.TransactionInstruction({
        keys: withdrawKeys,
        data: withdrawData,
        programId,
    });
}
exports.makeWithdrawInstruction = makeWithdrawInstruction;
function makeSettleFundsInstruction(programId, mangoGroupPk, mangoCachePk, ownerPk, mangoAccountPk, dexProgramId, spotMarketPk, openOrdersPk, signerKey, spotMarketBaseVaultPk, spotMarketQuoteVaultPk, baseRootBankPk, baseNodeBankPk, quoteRootBankPk, quoteNodeBankPk, baseVaultPk, quoteVaultPk, dexSignerKey) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: false, pubkey: mangoCachePk },
        { isSigner: true, isWritable: false, pubkey: ownerPk },
        { isSigner: false, isWritable: true, pubkey: mangoAccountPk },
        { isSigner: false, isWritable: false, pubkey: dexProgramId },
        { isSigner: false, isWritable: true, pubkey: spotMarketPk },
        { isSigner: false, isWritable: true, pubkey: openOrdersPk },
        { isSigner: false, isWritable: false, pubkey: signerKey },
        { isSigner: false, isWritable: true, pubkey: spotMarketBaseVaultPk },
        { isSigner: false, isWritable: true, pubkey: spotMarketQuoteVaultPk },
        { isSigner: false, isWritable: false, pubkey: baseRootBankPk },
        { isSigner: false, isWritable: true, pubkey: baseNodeBankPk },
        { isSigner: false, isWritable: false, pubkey: quoteRootBankPk },
        { isSigner: false, isWritable: true, pubkey: quoteNodeBankPk },
        { isSigner: false, isWritable: true, pubkey: baseVaultPk },
        { isSigner: false, isWritable: true, pubkey: quoteVaultPk },
        { isSigner: false, isWritable: false, pubkey: dexSignerKey },
        { isSigner: false, isWritable: false, pubkey: spl_token_1.TOKEN_PROGRAM_ID },
    ];
    const data = layout_1.encodeMangoInstruction({ SettleFunds: {} });
    return new web3_js_1.TransactionInstruction({ keys, data, programId });
}
exports.makeSettleFundsInstruction = makeSettleFundsInstruction;
function makeCancelSpotOrderInstruction(programId, mangoGroupPk, ownerPk, mangoAccountPk, dexProgramId, spotMarketPk, bidsPk, asksPk, openOrdersPk, signerKey, eventQueuePk, order) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: true, isWritable: false, pubkey: ownerPk },
        { isSigner: false, isWritable: false, pubkey: mangoAccountPk },
        { isSigner: false, isWritable: false, pubkey: dexProgramId },
        { isSigner: false, isWritable: true, pubkey: spotMarketPk },
        { isSigner: false, isWritable: true, pubkey: bidsPk },
        { isSigner: false, isWritable: true, pubkey: asksPk },
        { isSigner: false, isWritable: true, pubkey: openOrdersPk },
        { isSigner: false, isWritable: false, pubkey: signerKey },
        { isSigner: false, isWritable: true, pubkey: eventQueuePk },
    ];
    const data = layout_1.encodeMangoInstruction({
        CancelSpotOrder: {
            side: order.side,
            orderId: order.orderId,
        },
    });
    return new web3_js_1.TransactionInstruction({ keys, data, programId });
}
exports.makeCancelSpotOrderInstruction = makeCancelSpotOrderInstruction;
function makeCancelPerpOrderInstruction(programId, mangoGroupPk, mangoAccountPk, ownerPk, perpMarketPk, bidsPk, asksPk, order, invalidIdOk) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoAccountPk },
        { isSigner: true, isWritable: false, pubkey: ownerPk },
        { isSigner: false, isWritable: true, pubkey: perpMarketPk },
        { isSigner: false, isWritable: true, pubkey: bidsPk },
        { isSigner: false, isWritable: true, pubkey: asksPk },
    ];
    const data = layout_1.encodeMangoInstruction({
        CancelPerpOrder: {
            orderId: order.orderId,
            invalidIdOk,
        },
    });
    console.log(order, order.orderId.toArray(), data);
    return new web3_js_1.TransactionInstruction({ keys, data, programId });
}
exports.makeCancelPerpOrderInstruction = makeCancelPerpOrderInstruction;
function makeCancelPerpOrderByClientIdInstruction(programId, mangoGroupPk, mangoAccountPk, ownerPk, perpMarketPk, bidsPk, asksPk, clientOrderId, invalidIdOk) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoAccountPk },
        { isSigner: true, isWritable: false, pubkey: ownerPk },
        { isSigner: false, isWritable: true, pubkey: perpMarketPk },
        { isSigner: false, isWritable: true, pubkey: bidsPk },
        { isSigner: false, isWritable: true, pubkey: asksPk },
    ];
    const data = layout_1.encodeMangoInstruction({
        CancelPerpOrderByClientId: {
            clientOrderId,
            invalidIdOk,
        },
    });
    return new web3_js_1.TransactionInstruction({ keys, data, programId });
}
exports.makeCancelPerpOrderByClientIdInstruction = makeCancelPerpOrderByClientIdInstruction;
function makeCancelAllPerpOrdersInstruction(programId, mangoGroupPk, mangoAccountPk, ownerPk, perpMarketPk, bidsPk, asksPk, limit) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoAccountPk },
        { isSigner: true, isWritable: false, pubkey: ownerPk },
        { isSigner: false, isWritable: true, pubkey: perpMarketPk },
        { isSigner: false, isWritable: true, pubkey: bidsPk },
        { isSigner: false, isWritable: true, pubkey: asksPk },
    ];
    const data = layout_1.encodeMangoInstruction({
        CancelAllPerpOrders: {
            limit,
        },
    });
    return new web3_js_1.TransactionInstruction({ keys, data, programId });
}
exports.makeCancelAllPerpOrdersInstruction = makeCancelAllPerpOrdersInstruction;
function makeDepositInstruction(programId, mangoGroupPk, ownerPk, merpsCachePk, mangoAccountPk, rootBankPk, nodeBankPk, vaultPk, tokenAccPk, nativeQuantity) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoAccountPk },
        { isSigner: true, isWritable: false, pubkey: ownerPk },
        { isSigner: false, isWritable: false, pubkey: merpsCachePk },
        { isSigner: false, isWritable: false, pubkey: rootBankPk },
        { isSigner: false, isWritable: true, pubkey: nodeBankPk },
        { isSigner: false, isWritable: true, pubkey: vaultPk },
        { isSigner: false, isWritable: false, pubkey: spl_token_1.TOKEN_PROGRAM_ID },
        { isSigner: false, isWritable: true, pubkey: tokenAccPk },
    ];
    const data = layout_1.encodeMangoInstruction({
        Deposit: { quantity: nativeQuantity },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeDepositInstruction = makeDepositInstruction;
function makeCacheRootBankInstruction(programId, mangoGroupPk, mangoCachePk, rootBanks) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoCachePk },
        ...rootBanks.map((pubkey) => ({
            isSigner: false,
            isWritable: true,
            pubkey,
        })),
    ];
    const data = layout_1.encodeMangoInstruction({
        CacheRootBanks: {},
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeCacheRootBankInstruction = makeCacheRootBankInstruction;
function makeCachePricesInstruction(programId, mangoGroupPk, mangoCachePk, oracles) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoCachePk },
        ...oracles.map((pubkey) => ({
            isSigner: false,
            isWritable: false,
            pubkey,
        })),
    ];
    const data = layout_1.encodeMangoInstruction({
        CachePrices: {},
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeCachePricesInstruction = makeCachePricesInstruction;
function makeCachePerpMarketInstruction(programId, mangoGroupPk, mangoCachePk, perpMarketPks) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoCachePk },
        ...perpMarketPks.map((pubkey) => ({
            isSigner: false,
            isWritable: false,
            pubkey,
        })),
    ];
    const data = layout_1.encodeMangoInstruction({
        CachePerpMarkets: {},
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeCachePerpMarketInstruction = makeCachePerpMarketInstruction;
function makeAddSpotMarketInstruction(programId, mangoGroupPk, oraclePk, spotMarketPk, serumDexPk, mintPk, nodeBankPk, vaultPk, rootBankPk, adminPk, maintLeverage, initLeverage, liquidationFee, optimalUtil, optimalRate, maxRate) {
    const keys = [
        { isSigner: false, isWritable: true, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: false, pubkey: oraclePk },
        { isSigner: false, isWritable: false, pubkey: spotMarketPk },
        { isSigner: false, isWritable: false, pubkey: serumDexPk },
        { isSigner: false, isWritable: false, pubkey: mintPk },
        { isSigner: false, isWritable: true, pubkey: nodeBankPk },
        { isSigner: false, isWritable: false, pubkey: vaultPk },
        { isSigner: false, isWritable: true, pubkey: rootBankPk },
        { isSigner: true, isWritable: false, pubkey: adminPk },
    ];
    const data = layout_1.encodeMangoInstruction({
        AddSpotMarket: {
            maintLeverage,
            initLeverage,
            liquidationFee,
            optimalUtil,
            optimalRate,
            maxRate,
        },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeAddSpotMarketInstruction = makeAddSpotMarketInstruction;
function makeInitSpotOpenOrdersInstruction(programId, mangoGroupPk, mangoAccountPk, ownerPk, serumDexPk, openOrdersPk, spotMarketPk, signerPk) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoAccountPk },
        { isSigner: true, isWritable: false, pubkey: ownerPk },
        { isSigner: false, isWritable: false, pubkey: serumDexPk },
        { isSigner: false, isWritable: true, pubkey: openOrdersPk },
        { isSigner: false, isWritable: false, pubkey: spotMarketPk },
        { isSigner: false, isWritable: false, pubkey: signerPk },
        { isSigner: false, isWritable: false, pubkey: web3_js_1.SYSVAR_RENT_PUBKEY },
    ];
    const data = layout_1.encodeMangoInstruction({
        InitSpotOpenOrders: {},
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeInitSpotOpenOrdersInstruction = makeInitSpotOpenOrdersInstruction;
function makePlaceSpotOrderInstruction(programId, mangoGroupPk, mangoAccountPk, ownerPk, mangoCachePk, serumDexPk, spotMarketPk, bidsPk, asksPk, requestQueuePk, eventQueuePk, spotMktBaseVaultPk, spotMktQuoteVaultPk, baseRootBankPk, baseNodeBankPk, baseVaultPk, quoteRootBankPk, quoteNodeBankPk, quoteVaultPk, signerPk, dexSignerPk, msrmOrSrmVaultPk, 
// pass in only openOrders in margin basket, and only the market index one should be writable
openOrders, side, limitPrice, maxBaseQuantity, maxQuoteQuantity, selfTradeBehavior, orderType, clientId) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoAccountPk },
        { isSigner: true, isWritable: false, pubkey: ownerPk },
        { isSigner: false, isWritable: false, pubkey: mangoCachePk },
        { isSigner: false, isWritable: false, pubkey: serumDexPk },
        { isSigner: false, isWritable: true, pubkey: spotMarketPk },
        { isSigner: false, isWritable: true, pubkey: bidsPk },
        { isSigner: false, isWritable: true, pubkey: asksPk },
        { isSigner: false, isWritable: true, pubkey: requestQueuePk },
        { isSigner: false, isWritable: true, pubkey: eventQueuePk },
        { isSigner: false, isWritable: true, pubkey: spotMktBaseVaultPk },
        { isSigner: false, isWritable: true, pubkey: spotMktQuoteVaultPk },
        { isSigner: false, isWritable: false, pubkey: baseRootBankPk },
        { isSigner: false, isWritable: true, pubkey: baseNodeBankPk },
        { isSigner: false, isWritable: true, pubkey: baseVaultPk },
        { isSigner: false, isWritable: false, pubkey: quoteRootBankPk },
        { isSigner: false, isWritable: true, pubkey: quoteNodeBankPk },
        { isSigner: false, isWritable: true, pubkey: quoteVaultPk },
        { isSigner: false, isWritable: false, pubkey: spl_token_1.TOKEN_PROGRAM_ID },
        { isSigner: false, isWritable: false, pubkey: signerPk },
        { isSigner: false, isWritable: false, pubkey: web3_js_1.SYSVAR_RENT_PUBKEY },
        { isSigner: false, isWritable: false, pubkey: dexSignerPk },
        { isSigner: false, isWritable: false, pubkey: msrmOrSrmVaultPk },
        ...openOrders.map(({ pubkey, isWritable }) => ({
            isSigner: false,
            isWritable,
            pubkey,
        })),
    ];
    const data = layout_1.encodeMangoInstruction({
        PlaceSpotOrder: {
            side,
            limitPrice,
            maxBaseQuantity,
            maxQuoteQuantity,
            selfTradeBehavior,
            orderType,
            clientId,
            limit: 65535,
        },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makePlaceSpotOrderInstruction = makePlaceSpotOrderInstruction;
function makeUpdateRootBankInstruction(programId, mangoGroupPk, mangoCachePk, rootBankPk, nodeBanks) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoCachePk },
        { isSigner: false, isWritable: true, pubkey: rootBankPk },
        ...nodeBanks.map((pubkey) => ({
            isSigner: false,
            isWritable: true,
            pubkey,
        })),
    ];
    const data = layout_1.encodeMangoInstruction({
        UpdateRootBank: {},
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeUpdateRootBankInstruction = makeUpdateRootBankInstruction;
function makeAddOracleInstruction(programId, mangoGroupPk, oraclePk, adminPk) {
    const keys = [
        { isSigner: false, isWritable: true, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: oraclePk },
        { isSigner: true, isWritable: false, pubkey: adminPk },
    ];
    const data = layout_1.encodeMangoInstruction({ AddOracle: {} });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeAddOracleInstruction = makeAddOracleInstruction;
function makeSetOracleInstruction(programId, mangoGroupPk, oraclePk, adminPk, price) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: oraclePk },
        { isSigner: true, isWritable: false, pubkey: adminPk },
    ];
    const data = layout_1.encodeMangoInstruction({
        SetOracle: { price },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeSetOracleInstruction = makeSetOracleInstruction;
function makeAddPerpMarketInstruction(programId, mangoGroupPk, oraclePk, perpMarketPk, eventQueuePk, bidsPk, asksPk, mngoVaultPk, adminPk, maintLeverage, initLeverage, liquidationFee, makerFee, takerFee, baseLotSize, quoteLotSize, rate, maxDepthBps, targetPeriodLength, mngoPerPeriod) {
    const keys = [
        { isSigner: false, isWritable: true, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: false, pubkey: oraclePk },
        { isSigner: false, isWritable: true, pubkey: perpMarketPk },
        { isSigner: false, isWritable: true, pubkey: eventQueuePk },
        { isSigner: false, isWritable: true, pubkey: bidsPk },
        { isSigner: false, isWritable: true, pubkey: asksPk },
        { isSigner: false, isWritable: false, pubkey: mngoVaultPk },
        { isSigner: true, isWritable: false, pubkey: adminPk },
    ];
    const data = layout_1.encodeMangoInstruction({
        AddPerpMarket: {
            maintLeverage,
            initLeverage,
            liquidationFee,
            makerFee,
            takerFee,
            baseLotSize,
            quoteLotSize,
            rate,
            maxDepthBps,
            targetPeriodLength,
            mngoPerPeriod,
        },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeAddPerpMarketInstruction = makeAddPerpMarketInstruction;
function makeCachePerpMarketsInstruction(programId, mangoGroupPk, mangoCachePk, perpMarkets) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoCachePk },
        ...perpMarkets.map((pubkey) => ({
            isSigner: false,
            isWritable: false,
            pubkey,
        })),
    ];
    const data = layout_1.encodeMangoInstruction({
        CachePerpMarkets: {},
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeCachePerpMarketsInstruction = makeCachePerpMarketsInstruction;
function makeSettlePnlInstruction(programId, mangoGroupPk, mangoAccountAPk, mangoAccountBPk, mangoCachePk, rootBankPk, nodeBankPk, marketIndex) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoAccountAPk },
        { isSigner: false, isWritable: true, pubkey: mangoAccountBPk },
        { isSigner: false, isWritable: false, pubkey: mangoCachePk },
        { isSigner: false, isWritable: false, pubkey: rootBankPk },
        { isSigner: false, isWritable: true, pubkey: nodeBankPk },
    ];
    const data = layout_1.encodeMangoInstruction({
        SettlePnl: {
            marketIndex,
        },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeSettlePnlInstruction = makeSettlePnlInstruction;
function makeConsumeEventsInstruction(programId, mangoGroupPk, mangoCachePk, perpMarketPk, eventQueuePk, mangoAccountPks, limit) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: false, pubkey: mangoCachePk },
        { isSigner: false, isWritable: true, pubkey: perpMarketPk },
        { isSigner: false, isWritable: true, pubkey: eventQueuePk },
        ...mangoAccountPks.sort().map((pubkey) => ({
            isSigner: false,
            isWritable: true,
            pubkey,
        })),
    ];
    const data = layout_1.encodeMangoInstruction({
        ConsumeEvents: { limit },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeConsumeEventsInstruction = makeConsumeEventsInstruction;
function makePlacePerpOrderInstruction(programId, mangoGroupPk, mangoAccountPk, ownerPk, mangoCachePk, perpMarketPk, bidsPk, asksPk, eventQueuePk, openOrders, price, quantity, clientOrderId, side, orderType) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoAccountPk },
        { isSigner: true, isWritable: false, pubkey: ownerPk },
        { isSigner: false, isWritable: false, pubkey: mangoCachePk },
        { isSigner: false, isWritable: true, pubkey: perpMarketPk },
        { isSigner: false, isWritable: true, pubkey: bidsPk },
        { isSigner: false, isWritable: true, pubkey: asksPk },
        { isSigner: false, isWritable: true, pubkey: eventQueuePk },
        ...openOrders.map((pubkey) => ({
            isSigner: false,
            isWritable: false,
            pubkey,
        })),
    ];
    const data = layout_1.encodeMangoInstruction({
        PlacePerpOrder: {
            price,
            quantity,
            clientOrderId,
            side,
            orderType,
        },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makePlacePerpOrderInstruction = makePlacePerpOrderInstruction;
function makeUpdateFundingInstruction(programId, mangoGroupPk, mangoCachePk, perpMarketPk, bidsPk, asksPk) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: false, pubkey: mangoCachePk },
        { isSigner: false, isWritable: true, pubkey: perpMarketPk },
        { isSigner: false, isWritable: false, pubkey: bidsPk },
        { isSigner: false, isWritable: false, pubkey: asksPk },
    ];
    const data = layout_1.encodeMangoInstruction({
        UpdateFunding: {},
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeUpdateFundingInstruction = makeUpdateFundingInstruction;
function makeForceCancelSpotOrdersInstruction(programId, mangoGroupPk, mangoCachePk, liqeeMangoAccountPk, baseRootBankPk, baseNodeBankPk, baseVaultPk, quoteRootBankPk, quoteNodeBankPk, quoteVaultPk, spotMarketPk, bidsPk, asksPk, signerPk, dexEventQueuePk, dexBasePk, dexQuotePk, dexSignerPk, dexProgramPk, liqeeOpenOrdersKeys, limit) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: false, pubkey: mangoCachePk },
        { isSigner: false, isWritable: true, pubkey: liqeeMangoAccountPk },
        { isSigner: false, isWritable: false, pubkey: baseRootBankPk },
        { isSigner: false, isWritable: true, pubkey: baseNodeBankPk },
        { isSigner: false, isWritable: true, pubkey: baseVaultPk },
        { isSigner: false, isWritable: false, pubkey: quoteRootBankPk },
        { isSigner: false, isWritable: true, pubkey: quoteNodeBankPk },
        { isSigner: false, isWritable: true, pubkey: quoteVaultPk },
        { isSigner: false, isWritable: true, pubkey: spotMarketPk },
        { isSigner: false, isWritable: true, pubkey: bidsPk },
        { isSigner: false, isWritable: true, pubkey: asksPk },
        { isSigner: false, isWritable: false, pubkey: signerPk },
        { isSigner: false, isWritable: true, pubkey: dexEventQueuePk },
        { isSigner: false, isWritable: true, pubkey: dexBasePk },
        { isSigner: false, isWritable: true, pubkey: dexQuotePk },
        { isSigner: false, isWritable: false, pubkey: dexSignerPk },
        { isSigner: false, isWritable: false, pubkey: dexProgramPk },
        { isSigner: false, isWritable: false, pubkey: spl_token_1.TOKEN_PROGRAM_ID },
        ...liqeeOpenOrdersKeys.map(({ pubkey, isWritable }) => ({
            isSigner: false,
            isWritable,
            pubkey,
        })),
    ];
    const data = layout_1.encodeMangoInstruction({
        ForceCancelSpotOrders: {
            limit,
        },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeForceCancelSpotOrdersInstruction = makeForceCancelSpotOrdersInstruction;
function makeForceCancelPerpOrdersInstruction(programId, mangoGroupPk, mangoCachePk, perpMarketPk, bidsPk, asksPk, liqeeMangoAccountPk, liqorOpenOrdersPks, limit) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: false, pubkey: mangoCachePk },
        { isSigner: false, isWritable: false, pubkey: perpMarketPk },
        { isSigner: false, isWritable: true, pubkey: bidsPk },
        { isSigner: false, isWritable: true, pubkey: asksPk },
        { isSigner: false, isWritable: true, pubkey: liqeeMangoAccountPk },
        ...liqorOpenOrdersPks.map((pubkey) => ({
            isSigner: false,
            isWritable: false,
            pubkey,
        })),
    ];
    const data = layout_1.encodeMangoInstruction({
        ForceCancelPerpOrders: {
            limit,
        },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeForceCancelPerpOrdersInstruction = makeForceCancelPerpOrdersInstruction;
function makeLiquidateTokenAndTokenInstruction(programId, mangoGroupPk, mangoCachePk, liqeeMangoAccountPk, liqorMangoAccountPk, liqorAccountPk, assetRootBankPk, assetNodeBankPk, liabRootBankPk, liabNodeBankPk, liqeeOpenOrdersPks, liqorOpenOrdersPks, maxLiabTransfer) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: false, pubkey: mangoCachePk },
        { isSigner: false, isWritable: true, pubkey: liqeeMangoAccountPk },
        { isSigner: false, isWritable: true, pubkey: liqorMangoAccountPk },
        { isSigner: true, isWritable: false, pubkey: liqorAccountPk },
        { isSigner: false, isWritable: false, pubkey: assetRootBankPk },
        { isSigner: false, isWritable: true, pubkey: assetNodeBankPk },
        { isSigner: false, isWritable: false, pubkey: liabRootBankPk },
        { isSigner: false, isWritable: true, pubkey: liabNodeBankPk },
        ...liqeeOpenOrdersPks.map((pubkey) => ({
            isSigner: false,
            isWritable: false,
            pubkey,
        })),
        ...liqorOpenOrdersPks.map((pubkey) => ({
            isSigner: false,
            isWritable: false,
            pubkey,
        })),
    ];
    const data = layout_1.encodeMangoInstruction({
        LiquidateTokenAndToken: {
            maxLiabTransfer,
        },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeLiquidateTokenAndTokenInstruction = makeLiquidateTokenAndTokenInstruction;
function makeLiquidateTokenAndPerpInstruction(programId, mangoGroupPk, mangoCachePk, liqeeMangoAccountPk, liqorMangoAccountPk, liqorAccountPk, rootBankPk, nodeBankPk, liqeeOpenOrdersPks, liqorOpenOrdersPks, assetType, assetIndex, liabType, liabIndex, maxLiabTransfer) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: false, pubkey: mangoCachePk },
        { isSigner: false, isWritable: true, pubkey: liqeeMangoAccountPk },
        { isSigner: false, isWritable: true, pubkey: liqorMangoAccountPk },
        { isSigner: true, isWritable: false, pubkey: liqorAccountPk },
        { isSigner: false, isWritable: false, pubkey: rootBankPk },
        { isSigner: false, isWritable: true, pubkey: nodeBankPk },
        ...liqeeOpenOrdersPks.map((pubkey) => ({
            isSigner: false,
            isWritable: false,
            pubkey,
        })),
        ...liqorOpenOrdersPks.map((pubkey) => ({
            isSigner: false,
            isWritable: false,
            pubkey,
        })),
    ];
    const data = layout_1.encodeMangoInstruction({
        LiquidateTokenAndPerp: {
            assetType,
            assetIndex,
            liabType,
            liabIndex,
            maxLiabTransfer,
        },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeLiquidateTokenAndPerpInstruction = makeLiquidateTokenAndPerpInstruction;
function makeLiquidatePerpMarketInstruction(programId, mangoGroupPk, mangoCachePk, perpMarketPk, eventQueuePk, liqeeMangoAccountPk, liqorMangoAccountPk, liqorAccountPk, liqeeOpenOrdersPks, liqorOpenOrdersPks, baseTransferRequest) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: false, pubkey: mangoCachePk },
        { isSigner: false, isWritable: true, pubkey: perpMarketPk },
        { isSigner: false, isWritable: true, pubkey: eventQueuePk },
        { isSigner: false, isWritable: true, pubkey: liqeeMangoAccountPk },
        { isSigner: false, isWritable: true, pubkey: liqorMangoAccountPk },
        { isSigner: true, isWritable: false, pubkey: liqorAccountPk },
        ...liqeeOpenOrdersPks.map((pubkey) => ({
            isSigner: false,
            isWritable: false,
            pubkey,
        })),
        ...liqorOpenOrdersPks.map((pubkey) => ({
            isSigner: false,
            isWritable: false,
            pubkey,
        })),
    ];
    const data = layout_1.encodeMangoInstruction({
        LiquidatePerpMarket: {
            baseTransferRequest,
        },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeLiquidatePerpMarketInstruction = makeLiquidatePerpMarketInstruction;
function makeSettleFeesInstruction(programId, mangoGroupPk, mangoCachePk, perpMarketPk, mangoAccountPk, rootBankPk, nodeBankPk, bankVaultPk, feesVaultPk, signerPk) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: false, pubkey: mangoCachePk },
        { isSigner: false, isWritable: true, pubkey: perpMarketPk },
        { isSigner: false, isWritable: true, pubkey: mangoAccountPk },
        { isSigner: false, isWritable: false, pubkey: rootBankPk },
        { isSigner: false, isWritable: true, pubkey: nodeBankPk },
        { isSigner: false, isWritable: true, pubkey: bankVaultPk },
        { isSigner: false, isWritable: true, pubkey: feesVaultPk },
        { isSigner: false, isWritable: false, pubkey: signerPk },
        { isSigner: false, isWritable: false, pubkey: spl_token_1.TOKEN_PROGRAM_ID },
    ];
    const data = layout_1.encodeMangoInstruction({
        SettleFees: {},
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeSettleFeesInstruction = makeSettleFeesInstruction;
function makeResolvePerpBankruptcyInstruction(programId, mangoGroupPk, mangoCachePk, liqeeMangoAccountPk, liqorMangoAccountPk, liqorPk, rootBankPk, nodeBankPk, vaultPk, insuranceVaultPk, signerPk, perpMarketPk, liqorOpenOrdersPks, liabIndex, maxLiabTransfer) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoCachePk },
        { isSigner: false, isWritable: true, pubkey: liqeeMangoAccountPk },
        { isSigner: false, isWritable: true, pubkey: liqorMangoAccountPk },
        { isSigner: true, isWritable: false, pubkey: liqorPk },
        { isSigner: false, isWritable: false, pubkey: rootBankPk },
        { isSigner: false, isWritable: true, pubkey: nodeBankPk },
        { isSigner: false, isWritable: true, pubkey: vaultPk },
        { isSigner: false, isWritable: true, pubkey: insuranceVaultPk },
        { isSigner: false, isWritable: false, pubkey: signerPk },
        { isSigner: false, isWritable: true, pubkey: perpMarketPk },
        { isSigner: false, isWritable: false, pubkey: spl_token_1.TOKEN_PROGRAM_ID },
        ...liqorOpenOrdersPks.map((pubkey) => ({
            isSigner: false,
            isWritable: false,
            pubkey,
        })),
    ];
    const data = layout_1.encodeMangoInstruction({
        ResolvePerpBankruptcy: {
            liabIndex,
            maxLiabTransfer,
        },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeResolvePerpBankruptcyInstruction = makeResolvePerpBankruptcyInstruction;
function makeResolveTokenBankruptcyInstruction(programId, mangoGroupPk, mangoCachePk, liqeeMangoAccountPk, liqorMangoAccountPk, liqorPk, quoteRootBankPk, quoteNodeBankPk, quoteVaultPk, insuranceVaultPk, signerPk, liabRootBankPk, liabNodeBankPk, liqorOpenOrdersPks, liabNodeBankPks, maxLiabTransfer) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: mangoCachePk },
        { isSigner: false, isWritable: true, pubkey: liqeeMangoAccountPk },
        { isSigner: false, isWritable: true, pubkey: liqorMangoAccountPk },
        { isSigner: true, isWritable: false, pubkey: liqorPk },
        { isSigner: false, isWritable: false, pubkey: quoteRootBankPk },
        { isSigner: false, isWritable: true, pubkey: quoteNodeBankPk },
        { isSigner: false, isWritable: true, pubkey: quoteVaultPk },
        { isSigner: false, isWritable: true, pubkey: insuranceVaultPk },
        { isSigner: false, isWritable: false, pubkey: signerPk },
        { isSigner: false, isWritable: true, pubkey: liabRootBankPk },
        { isSigner: false, isWritable: true, pubkey: liabNodeBankPk },
        { isSigner: false, isWritable: false, pubkey: spl_token_1.TOKEN_PROGRAM_ID },
        ...liqorOpenOrdersPks.map((pubkey) => ({
            isSigner: false,
            isWritable: false,
            pubkey,
        })),
        ...liabNodeBankPks.map((pubkey) => ({
            isSigner: false,
            isWritable: true,
            pubkey,
        })),
    ];
    const data = layout_1.encodeMangoInstruction({
        ResolveTokenBankruptcy: {
            maxLiabTransfer,
        },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeResolveTokenBankruptcyInstruction = makeResolveTokenBankruptcyInstruction;
function makeRedeemMngoInstruction(programId, mangoGroup, mangoCache, mangoAccount, owner, perpMarket, mngoPerpVault, mngoRootBank, mngoNodeBank, mngoBankVault, signer) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroup },
        { isSigner: false, isWritable: false, pubkey: mangoCache },
        { isSigner: false, isWritable: true, pubkey: mangoAccount },
        { isSigner: true, isWritable: false, pubkey: owner },
        { isSigner: false, isWritable: false, pubkey: perpMarket },
        { isSigner: false, isWritable: true, pubkey: mngoPerpVault },
        { isSigner: false, isWritable: false, pubkey: mngoRootBank },
        { isSigner: false, isWritable: true, pubkey: mngoNodeBank },
        { isSigner: false, isWritable: true, pubkey: mngoBankVault },
        { isSigner: false, isWritable: false, pubkey: signer },
        { isSigner: false, isWritable: false, pubkey: spl_token_1.TOKEN_PROGRAM_ID },
    ];
    const data = layout_1.encodeMangoInstruction({ RedeemMngo: {} });
    return new web3_js_1.TransactionInstruction({ keys, data, programId });
}
exports.makeRedeemMngoInstruction = makeRedeemMngoInstruction;
function makeAddMangoAccountInfoInstruction(programId, mangoGroup, mangoAccount, owner, info) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroup },
        { isSigner: false, isWritable: true, pubkey: mangoAccount },
        { isSigner: true, isWritable: false, pubkey: owner },
    ];
    // TODO convert info into a 32 byte utf encoded byte array
    const encoded = Buffer.from(info);
    if (encoded.length > layout_1.INFO_LEN) {
        throw new Error('info string too long. Must be less than or equal to 32 bytes');
    }
    const infoArray = new Uint8Array(encoded, 0, layout_1.INFO_LEN);
    const data = layout_1.encodeMangoInstruction({
        AddMangoAccountInfo: { info: infoArray },
    });
    return new web3_js_1.TransactionInstruction({ keys, data, programId });
}
exports.makeAddMangoAccountInfoInstruction = makeAddMangoAccountInfoInstruction;
function makeDepositMsrmInstruction(programId, mangoGroup, mangoAccount, owner, msrmAccount, msrmVault, quantity) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroup },
        { isSigner: false, isWritable: true, pubkey: mangoAccount },
        { isSigner: true, isWritable: false, pubkey: owner },
        { isSigner: false, isWritable: true, pubkey: msrmAccount },
        { isSigner: false, isWritable: true, pubkey: msrmVault },
        { isSigner: false, isWritable: false, pubkey: spl_token_1.TOKEN_PROGRAM_ID },
    ];
    const data = layout_1.encodeMangoInstruction({ DepositMsrm: { quantity } });
    return new web3_js_1.TransactionInstruction({ keys, data, programId });
}
exports.makeDepositMsrmInstruction = makeDepositMsrmInstruction;
function makeWithdrawMsrmInstruction(programId, mangoGroup, mangoAccount, owner, msrmAccount, msrmVault, signer, quantity) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroup },
        { isSigner: false, isWritable: true, pubkey: mangoAccount },
        { isSigner: true, isWritable: false, pubkey: owner },
        { isSigner: false, isWritable: true, pubkey: msrmAccount },
        { isSigner: false, isWritable: true, pubkey: msrmVault },
        { isSigner: false, isWritable: false, pubkey: signer },
        { isSigner: false, isWritable: false, pubkey: spl_token_1.TOKEN_PROGRAM_ID },
    ];
    const data = layout_1.encodeMangoInstruction({ WithdrawMsrm: { quantity } });
    return new web3_js_1.TransactionInstruction({ keys, data, programId });
}
exports.makeWithdrawMsrmInstruction = makeWithdrawMsrmInstruction;
function makeChangePerpMarketParamsInstruction(programId, mangoGroupPk, perpMarketPk, adminPk, maintLeverage, initLeverage, liquidationFee, makerFee, takerFee, rate, maxDepthBps, targetPeriodLength, mngoPerPeriod) {
    const keys = [
        { isSigner: false, isWritable: true, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: perpMarketPk },
        { isSigner: true, isWritable: false, pubkey: adminPk },
    ];
    const data = layout_1.encodeMangoInstruction({
        ChangePerpMarketParams: {
            maintLeverageOption: maintLeverage !== undefined,
            maintLeverage: maintLeverage !== undefined ? maintLeverage : fixednum_1.ZERO_I80F48,
            initLeverageOption: initLeverage !== undefined,
            initLeverage: initLeverage !== undefined ? initLeverage : fixednum_1.ZERO_I80F48,
            liquidationFeeOption: liquidationFee !== undefined,
            liquidationFee: liquidationFee !== undefined ? liquidationFee : fixednum_1.ZERO_I80F48,
            makerFeeOption: makerFee !== undefined,
            makerFee: makerFee !== undefined ? makerFee : fixednum_1.ZERO_I80F48,
            takerFeeOption: takerFee !== undefined,
            takerFee: takerFee !== undefined ? takerFee : fixednum_1.ZERO_I80F48,
            rateOption: rate !== undefined,
            rate: rate !== undefined ? rate : fixednum_1.ZERO_I80F48,
            maxDepthBpsOption: maxDepthBps !== undefined,
            maxDepthBps: maxDepthBps !== undefined ? maxDepthBps : fixednum_1.ZERO_I80F48,
            targetPeriodLengthOption: targetPeriodLength !== undefined,
            targetPeriodLength: targetPeriodLength !== undefined ? targetPeriodLength : new bn_js_1.default(0),
            mngoPerPeriodOption: mngoPerPeriod !== undefined,
            mngoPerPeriod: mngoPerPeriod !== undefined ? mngoPerPeriod : new bn_js_1.default(0),
        },
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeChangePerpMarketParamsInstruction = makeChangePerpMarketParamsInstruction;
function makeSetGroupAdminInstruction(programId, mangoGroupPk, newAdminPk, adminPk) {
    const keys = [
        { isSigner: false, isWritable: true, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: true, pubkey: newAdminPk },
        { isSigner: true, isWritable: false, pubkey: adminPk },
    ];
    const data = layout_1.encodeMangoInstruction({
        SetGroupAdmin: {},
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeSetGroupAdminInstruction = makeSetGroupAdminInstruction;
function makeForceSettleQuotePositionsInstruction(programId, mangoGroupPk, mangoCachePk, liqeeMangoAccountPk, liqorMangoAccountPk, liqorAccountPk, rootBankPk, nodeBankPk, liqeeOpenOrdersPks) {
    const keys = [
        { isSigner: false, isWritable: false, pubkey: mangoGroupPk },
        { isSigner: false, isWritable: false, pubkey: mangoCachePk },
        { isSigner: false, isWritable: true, pubkey: liqeeMangoAccountPk },
        { isSigner: false, isWritable: true, pubkey: liqorMangoAccountPk },
        { isSigner: true, isWritable: false, pubkey: liqorAccountPk },
        { isSigner: false, isWritable: false, pubkey: rootBankPk },
        { isSigner: false, isWritable: true, pubkey: nodeBankPk },
        ...liqeeOpenOrdersPks.map((pubkey) => ({
            isSigner: false,
            isWritable: false,
            pubkey,
        })),
    ];
    const data = layout_1.encodeMangoInstruction({
        ForceSettleQuotePositions: {},
    });
    return new web3_js_1.TransactionInstruction({
        keys,
        data,
        programId,
    });
}
exports.makeForceSettleQuotePositionsInstruction = makeForceSettleQuotePositionsInstruction;
//# sourceMappingURL=instruction.js.map