"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwUndefined = exports.getMultipleAccounts = exports.getFilteredProgramAccounts = exports.createSignerKeyAndNonce = exports.createTokenAccountInstructions = exports.createAccountInstruction = exports.simulateTransaction = exports.sleep = exports.awaitTransactionSignatureConfirmation = exports.splitOpenOrders = exports.getWeights = exports.nativeI80F48ToUi = exports.nativeToUi = exports.uiToNative = exports.promiseUndef = exports.zeroKey = exports.ZERO_BN = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const web3_js_1 = require("@gemachain/web3.js");
const serum_1 = require("@project-serum/serum");
const fixednum_1 = require("./fixednum");
exports.ZERO_BN = new bn_js_1.default(0);
exports.zeroKey = new web3_js_1.PublicKey(new Uint8Array(32));
function promiseUndef() {
    return __awaiter(this, void 0, void 0, function* () {
        return undefined;
    });
}
exports.promiseUndef = promiseUndef;
function uiToNative(amount, decimals) {
    return new bn_js_1.default(Math.round(amount * Math.pow(10, decimals)));
}
exports.uiToNative = uiToNative;
function nativeToUi(amount, decimals) {
    return amount / Math.pow(10, decimals);
}
exports.nativeToUi = nativeToUi;
function nativeI80F48ToUi(amount, decimals) {
    return amount.div(fixednum_1.I80F48.fromNumber(Math.pow(10, decimals)));
}
exports.nativeI80F48ToUi = nativeI80F48ToUi;
/**
 * Return weights corresponding to health type;
 * Weights are all 1 if no healthType provided
 */
function getWeights(mangoGroup, marketIndex, healthType) {
    if (healthType === 'Maint') {
        return {
            spotAssetWeight: mangoGroup.spotMarkets[marketIndex].maintAssetWeight,
            spotLiabWeight: mangoGroup.spotMarkets[marketIndex].maintLiabWeight,
            perpAssetWeight: mangoGroup.perpMarkets[marketIndex].maintAssetWeight,
            perpLiabWeight: mangoGroup.perpMarkets[marketIndex].maintLiabWeight,
        };
    }
    else if (healthType === 'Init') {
        return {
            spotAssetWeight: mangoGroup.spotMarkets[marketIndex].initAssetWeight,
            spotLiabWeight: mangoGroup.spotMarkets[marketIndex].initLiabWeight,
            perpAssetWeight: mangoGroup.perpMarkets[marketIndex].initAssetWeight,
            perpLiabWeight: mangoGroup.perpMarkets[marketIndex].initLiabWeight,
        };
    }
    else {
        return {
            spotAssetWeight: fixednum_1.ONE_I80F48,
            spotLiabWeight: fixednum_1.ONE_I80F48,
            perpAssetWeight: fixednum_1.ONE_I80F48,
            perpLiabWeight: fixednum_1.ONE_I80F48,
        };
    }
}
exports.getWeights = getWeights;
function splitOpenOrders(openOrders) {
    const quoteFree = fixednum_1.I80F48.fromU64(openOrders.quoteTokenFree.add(openOrders['referrerRebatesAccrued']));
    const quoteLocked = fixednum_1.I80F48.fromU64(openOrders.quoteTokenTotal.sub(openOrders.quoteTokenFree));
    const baseFree = fixednum_1.I80F48.fromU64(openOrders.baseTokenFree);
    const baseLocked = fixednum_1.I80F48.fromU64(openOrders.baseTokenTotal.sub(openOrders.baseTokenFree));
    return { quoteFree, quoteLocked, baseFree, baseLocked };
}
exports.splitOpenOrders = splitOpenOrders;
function awaitTransactionSignatureConfirmation(txid, timeout, connection, confirmLevel) {
    return __awaiter(this, void 0, void 0, function* () {
        let done = false;
        const confirmLevels = [
            'finalized',
        ];
        console.log('confirmLevel = ', confirmLevel);
        if (confirmLevel === 'confirmed') {
            confirmLevels.push('confirmed');
        }
        else if (confirmLevel === 'processed') {
            confirmLevels.push('confirmed');
            confirmLevels.push('processed');
        }
        const result = yield new Promise((resolve, reject) => {
            (() => __awaiter(this, void 0, void 0, function* () {
                setTimeout(() => {
                    if (done) {
                        return;
                    }
                    done = true;
                    console.log('Timed out for txid', txid);
                    reject({ timeout: true });
                }, timeout);
                try {
                    connection.onSignature(txid, (result) => {
                        // console.log('WS confirmed', txid, result);
                        done = true;
                        if (result.err) {
                            reject(result.err);
                        }
                        else {
                            resolve(result);
                        }
                    }, 'processed');
                    // console.log('Set up WS connection', txid);
                }
                catch (e) {
                    done = true;
                    console.log('WS error in setup', txid, e);
                }
                while (!done) {
                    // eslint-disable-next-line no-loop-func
                    (() => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const signatureStatuses = yield connection.getSignatureStatuses([
                                txid,
                            ]);
                            const result = signatureStatuses && signatureStatuses.value[0];
                            if (!done) {
                                if (!result) {
                                    // console.log('REST null result for', txid, result);
                                }
                                else if (result.err) {
                                    console.log('REST error for', txid, result);
                                    done = true;
                                    reject(result.err);
                                }
                                else if (!(result.confirmations ||
                                    confirmLevels.includes(result.confirmationStatus))) {
                                    console.log('REST not confirmed', txid, result);
                                }
                                else {
                                    console.log('REST confirmed', txid, result);
                                    done = true;
                                    resolve(result);
                                }
                            }
                        }
                        catch (e) {
                            if (!done) {
                                console.log('REST connection error: txid', txid, e);
                            }
                        }
                    }))();
                    yield sleep(300);
                }
            }))();
        });
        done = true;
        return result;
    });
}
exports.awaitTransactionSignatureConfirmation = awaitTransactionSignatureConfirmation;
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, ms));
    });
}
exports.sleep = sleep;
function simulateTransaction(connection, transaction, commitment) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        transaction.recentBlockhash = yield connection._recentBlockhash(
        // @ts-ignore
        connection._disableBlockhashCaching);
        const signData = transaction.serializeMessage();
        // @ts-ignore
        const wireTransaction = transaction._serialize(signData);
        const encodedTransaction = wireTransaction.toString('base64');
        const config = { encoding: 'base64', commitment };
        const args = [encodedTransaction, config];
        // @ts-ignore
        const res = yield connection._rpcRequest('simulateTransaction', args);
        if (res.error) {
            throw new Error('failed to simulate transaction: ' + res.error.message);
        }
        return res.result;
    });
}
exports.simulateTransaction = simulateTransaction;
function createAccountInstruction(connection, payer, space, owner, carats) {
    return __awaiter(this, void 0, void 0, function* () {
        const account = new web3_js_1.Account();
        const instruction = web3_js_1.SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: account.publicKey,
            carats: carats
                ? carats
                : yield connection.getMinimumBalanceForRentExemption(space),
            space,
            programId: owner,
        });
        return { account, instruction };
    });
}
exports.createAccountInstruction = createAccountInstruction;
function createTokenAccountInstructions(connection, payer, account, mint, owner) {
    return __awaiter(this, void 0, void 0, function* () {
        return [
            web3_js_1.SystemProgram.createAccount({
                fromPubkey: payer,
                newAccountPubkey: account,
                carats: yield connection.getMinimumBalanceForRentExemption(165),
                space: 165,
                programId: serum_1.TokenInstructions.TOKEN_PROGRAM_ID,
            }),
            serum_1.TokenInstructions.initializeAccount({
                account: account,
                mint,
                owner,
            }),
        ];
    });
}
exports.createTokenAccountInstructions = createTokenAccountInstructions;
function createSignerKeyAndNonce(programId, accountKey) {
    return __awaiter(this, void 0, void 0, function* () {
        // let res = await PublicKey.findProgramAddress([accountKey.toBuffer()], programId);
        // console.log(res);
        // return {
        //   signerKey: res[0],
        //   signerNonce: res[1]
        // };
        for (let nonce = 0; nonce <= Number.MAX_SAFE_INTEGER; nonce++) {
            try {
                const nonceBuffer = Buffer.alloc(8);
                nonceBuffer.writeUInt32LE(nonce, 0);
                const seeds = [accountKey.toBuffer(), nonceBuffer];
                const key = yield web3_js_1.PublicKey.createProgramAddress(seeds, programId);
                return {
                    signerKey: key,
                    signerNonce: nonce,
                };
            }
            catch (e) {
                continue;
            }
        }
        throw new Error('Could not generate signer key');
    });
}
exports.createSignerKeyAndNonce = createSignerKeyAndNonce;
function getFilteredProgramAccounts(connection, programId, filters) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const resp = yield connection._rpcRequest('getProgramAccounts', [
            programId.toBase58(),
            {
                commitment: connection.commitment,
                filters,
                encoding: 'base64',
            },
        ]);
        if (resp.error) {
            throw new Error(resp.error.message);
        }
        return resp.result.map(({ pubkey, account: { data, executable, owner, carats } }) => ({
            publicKey: new web3_js_1.PublicKey(pubkey),
            accountInfo: {
                data: Buffer.from(data[0], 'base64'),
                executable,
                owner: new web3_js_1.PublicKey(owner),
                carats,
            },
        }));
    });
}
exports.getFilteredProgramAccounts = getFilteredProgramAccounts;
function getMultipleAccounts(connection, publicKeys, commitment) {
    return __awaiter(this, void 0, void 0, function* () {
        const len = publicKeys.length;
        if (len > 100) {
            const mid = Math.floor(publicKeys.length / 2);
            return Promise.all([
                getMultipleAccounts(connection, publicKeys.slice(0, mid), commitment),
                getMultipleAccounts(connection, publicKeys.slice(mid, len), commitment),
            ]).then((a) => a[0].concat(a[1]));
        }
        const publicKeyStrs = publicKeys.map((pk) => pk.toBase58());
        // load connection commitment as a default
        commitment || (commitment = connection.commitment);
        const args = commitment ? [publicKeyStrs, { commitment }] : [publicKeyStrs];
        // @ts-ignore
        const resp = yield connection._rpcRequest('getMultipleAccounts', args);
        if (resp.error) {
            throw new Error(resp.error.message);
        }
        return resp.result.value.map(({ data, executable, carats, owner }, i) => ({
            publicKey: publicKeys[i],
            context: resp.result.context,
            accountInfo: {
                data: Buffer.from(data[0], 'base64'),
                executable,
                owner: new web3_js_1.PublicKey(owner),
                carats,
            },
        }));
    });
}
exports.getMultipleAccounts = getMultipleAccounts;
/**
 * Throw if undefined; return value otherwise
 */
function throwUndefined(x) {
    if (x === undefined) {
        throw new Error('Undefined');
    }
    return x;
}
exports.throwUndefined = throwUndefined;
//# sourceMappingURL=utils.js.map