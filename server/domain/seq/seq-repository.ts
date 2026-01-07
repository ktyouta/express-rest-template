import { Prisma } from "@prisma/client";
import { SeqKey } from "./seq-key";
import { SeqRepositoryInterface } from "./seq-repository.interface";



/**
 * json形式の永続ロジック用クラス
 */
export class SeqRepository implements SeqRepositoryInterface {


    constructor() { }

    /**
     * シーケンスを取得
     */
    async getSequenceByKey(seqKey: SeqKey, tx: Prisma.TransactionClient) {

        const key = seqKey.value;

        const seqData = await tx.seqMaster.findUnique({
            where: { key },
        });

        return seqData;
    }


    /**
     * シーケンスを更新
     */
    async updateSequence(seqKey: SeqKey, nextId: number, tx: Prisma.TransactionClient) {

        const key = seqKey.value;

        const seqData = await tx.seqMaster.update({
            where: { key },
            data: {
                nextId,
                updateDate: new Date(),
            },
        });

        return seqData;
    }
}