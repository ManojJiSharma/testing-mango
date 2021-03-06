/// <reference types="node" />
import BN from 'bn.js';
import { Account, AccountInfo, Commitment, Connection, PublicKey, RpcResponseAndContext, SimulatedTransactionResponse, Transaction, TransactionConfirmationStatus, TransactionInstruction, TransactionSignature } from '@gemachain/web3.js';
import { OpenOrders } from '@project-serum/serum';
import { I80F48 } from './fixednum';
import MangoGroup from './MangoGroup';
import { HealthType } from './MangoAccount';
export declare const ZERO_BN: BN;
export declare const zeroKey: PublicKey;
export declare function promiseUndef(): Promise<undefined>;
export declare function uiToNative(amount: number, decimals: number): BN;
export declare function nativeToUi(amount: number, decimals: number): number;
export declare function nativeI80F48ToUi(amount: I80F48, decimals: number): I80F48;
/**
 * Return weights corresponding to health type;
 * Weights are all 1 if no healthType provided
 */
export declare function getWeights(mangoGroup: MangoGroup, marketIndex: number, healthType?: HealthType): {
    spotAssetWeight: I80F48;
    spotLiabWeight: I80F48;
    perpAssetWeight: I80F48;
    perpLiabWeight: I80F48;
};
export declare function splitOpenOrders(openOrders: OpenOrders): {
    quoteFree: I80F48;
    quoteLocked: I80F48;
    baseFree: I80F48;
    baseLocked: I80F48;
};
export declare function awaitTransactionSignatureConfirmation(txid: TransactionSignature, timeout: number, connection: Connection, confirmLevel: TransactionConfirmationStatus): Promise<unknown>;
export declare function sleep(ms: any): Promise<unknown>;
export declare function simulateTransaction(connection: Connection, transaction: Transaction, commitment: Commitment): Promise<RpcResponseAndContext<SimulatedTransactionResponse>>;
export declare function createAccountInstruction(connection: Connection, payer: PublicKey, space: number, owner: PublicKey, carats?: number): Promise<{
    account: Account;
    instruction: TransactionInstruction;
}>;
export declare function createTokenAccountInstructions(connection: Connection, payer: PublicKey, account: PublicKey, mint: PublicKey, owner: PublicKey): Promise<TransactionInstruction[]>;
export declare function createSignerKeyAndNonce(programId: PublicKey, accountKey: PublicKey): Promise<{
    signerKey: PublicKey;
    signerNonce: number;
}>;
export declare function getFilteredProgramAccounts(connection: Connection, programId: PublicKey, filters: any): Promise<{
    publicKey: PublicKey;
    accountInfo: AccountInfo<Buffer>;
}[]>;
export declare function getMultipleAccounts(connection: Connection, publicKeys: PublicKey[], commitment?: Commitment): Promise<{
    publicKey: PublicKey;
    context: {
        slot: number;
    };
    accountInfo: AccountInfo<Buffer>;
}[]>;
/**
 * Throw if undefined; return value otherwise
 */
export declare function throwUndefined<T>(x: T | undefined): T;
//# sourceMappingURL=utils.d.ts.map