export class ArrayUtil {

    // 配列の等価チェック
    public static checkArrayEqual<T, U>(list1: T[], list2: U[]) {

        if (list1.length !== list2.length) {
            return false;
        }

        const list1Str = list1.sort().join(`,`);
        const list2Str = list2.sort().join(`,`);

        return list1Str === list2Str;
    }
}