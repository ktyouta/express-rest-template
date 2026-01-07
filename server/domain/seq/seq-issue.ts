import { Prisma } from "@prisma/client";
import { SeqKey } from "./seq-key";
import { SeqRepositoryInterface } from "./seq-repository.interface";

export class SeqIssue {

    private static readonly INCREMENT_SEQ = 1;
    constructor(private readonly _repository: SeqRepositoryInterface) { }

    /**
     * シーケンスを発番する
     */
    async get(seqKey: SeqKey, tx: Prisma.TransactionClient) {

        // シーケンスを取得
        const sequence = await this._repository.getSequenceByKey(seqKey, tx);

        if (!sequence) {
            throw Error(`キーに対するシーケンスを取得できませんでした。key:${seqKey.value}`);
        }

        const retId = sequence.nextId;
        const nextId = retId + SeqIssue.INCREMENT_SEQ;

        // シーケンスを更新
        await this._repository.updateSequence(seqKey, nextId, tx);

        return retId;
    }
}