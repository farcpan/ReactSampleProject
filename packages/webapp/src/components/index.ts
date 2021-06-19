/**
 * for Parent
 */
export interface SubData {
    id: number;
    text: string;
    data: string[];
    answer: number;
}
  
export interface Data {
    id: number;
    text: string;
    data: SubData[];
}

/** 
 * for Treeview
 */

// ツリービュー用のデータ構造
export interface TreeViewData {
    id: number;
    text: string;
    checkedState: number;       // 0: unchecked, 1: checked, 2: indeterminated
    isExpanded: boolean;
    children?: TreeViewData[];
}

// ツリービュー表示用のデータ構造
export interface FlatTreeViewData {
    id: number;
    text: string;
    checkedState: number;       // 0: unchecked, 1: checked, 2: indeterminated
    isExpanded: boolean;
    isShow: boolean;
    rank: number;
    isLeaf: boolean;
}

// TreeViewData[] -> FlatTreeViewData[]
export const convertTreeViewToFlat = (
        data: TreeViewData[], 
        parentExpanded: boolean = true, 
        rank: number = 1): FlatTreeViewData[] => {
    let newArray: FlatTreeViewData[] = []

    data.forEach((d) => {
        const isShow = (rank == 1 || parentExpanded);
        let newCheckedState: number = d.checkedState;

        if (d.children !== undefined) {
            const counts = d.children!.length;
            const checkedCounts = d.children!.filter((value) => { return value.checkedState == 1}).length;
            const uncheckedCounts = d.children!.filter((value) => { return value.checkedState == 0}).length;

            if (checkedCounts == counts) {
                newCheckedState = 1;
            } else if (uncheckedCounts == counts) {
                newCheckedState = 0;
            } else {
                newCheckedState = 2;
            }
        }
        
        newArray.push({
            id: d.id, text: d.text,
            checkedState: newCheckedState,
            isExpanded: d.isExpanded, isShow: isShow, rank: rank, 
            isLeaf: (d.children === undefined)
        });

        if (d.children !== undefined) {
            const children = convertTreeViewToFlat(d.children!, d.isExpanded, rank + 1);
            children.forEach((child) => {
                newArray.push(child);
            })
        }
    });

    return newArray;
}

// テスト用データ
export const createTestTreeViewData = (): TreeViewData[] => {
    return [
        { 
            id: 1, text: "text1", checkedState: 0, isExpanded: true,
            children: [
                { id: 11, text: "text11", checkedState: 0, isExpanded: true, children: [
                    { id: 111, text: "text111", checkedState: 0, isExpanded: true, children: [
                        { id: 1111, text: "text1111", checkedState: 0, isExpanded: false, },
                        { id: 1112, text: "text1112", checkedState: 0, isExpanded: false, },
                    ] }
                ] },
                { id: 12, text: "text12", checkedState: 0, isExpanded: false, }
            ]
        },
        {
            id: 2, text: "text2", checkedState: 0, isExpanded: false, 
        }
    ]
}

export { default as Parent } from "./Parent";
export { default as TreeView } from "./TreeView";
