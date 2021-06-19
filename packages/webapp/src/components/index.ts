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
    id: number,
    text: string,
    isChecked: boolean,
    isExpanded: boolean,
    children?: TreeViewData[], 
}

// ツリービュー表示用のデータ構造
export interface FlatTreeViewData {
    id: number,
    text: string,
    isChecked: boolean,
    isExpanded: boolean,
    isShow: boolean,
    rank: number,
    isLeaf: boolean,
}

// TreeViewData[] -> FlatTreeViewData[]
export const convertTreeViewToFlat = (
        data: TreeViewData[], 
        parentExpanded: boolean = true, 
        rank: number = 1): FlatTreeViewData[] => {
    let newArray: FlatTreeViewData[] = []

    data.forEach((d) => {
        const isShow = (rank == 1 || parentExpanded);
        
        newArray.push({
            id: d.id, text: d.text,
            isChecked: d.isChecked,
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
            id: 1, text: "text1", isChecked: false, isExpanded: true,
            children: [
                { id: 11, text: "text11", isChecked: false, isExpanded: true, children: [
                    { id: 111, text: "text111", isChecked: false, isExpanded: true, children: [
                        { id: 1111, text: "text1111", isChecked: false, isExpanded: false, },
                        { id: 1112, text: "text1112", isChecked: false, isExpanded: false, },
                    ] }
                ] },
                { id: 12, text: "text12", isChecked: false, isExpanded: false, }
            ]
        },
        {
            id: 2, text: "text2", isChecked: false, isExpanded: false, 
        }
    ]
}

export { default as Parent } from "./Parent";
export { default as TreeView } from "./TreeView";
