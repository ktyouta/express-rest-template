import { Prisma } from "@prisma/client";
import { SeqKey } from "./seq-key";
import { SeqRepository } from "./seq-repository";

export class SeqIssue {

    private static readonly INCREMENT_SEQ = 1;
    private static readonly _repository: SeqRepository = new SeqRepository();

    constructor() { }

    /**
     * シーケンスを発番する
     */
    static async get(seqKey: SeqKey, tx: Prisma.TransactionClient) {

        // シーケンスを取得
        const sequence = await SeqIssue._repository.getSequenceByKey(seqKey, tx);

        if (!sequence) {
            throw Error(`キーに対するシーケンスを取得できませんでした。key:${seqKey.value}`);
        }

        const retId = sequence.nextId;
        const nextId = retId + SeqIssue.INCREMENT_SEQ;

        // シーケンスを更新
        await SeqIssue._repository.updateSequence(seqKey, nextId, tx);

        return retId;
    }
}