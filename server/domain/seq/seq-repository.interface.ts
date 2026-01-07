import { Prisma, SeqMaster } from "@prisma/client";
import { SeqKey } from "./seq-key";


/**
 * 永続ロジック用インターフェース
 */
export interface SeqRepositoryInterface {

    /**
     * シーケンスを取得
     */
    getSequenceByKey(seqKey: SeqKey, tx: Prisma.TransactionClient): Promise<SeqMaster | null>;


    /**
     * シーケンスを更新
     * @param key 
     * @param nextId 
     */
    updateSequence(seqKey: SeqKey, nextId: number, tx: Prisma.TransactionClient): Promise<SeqMaster>;
}

