import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

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
// チェックボックス状態定義
export const UNCHECKED: number = 0;
export const CHECKED: number = 1;
export const INDETERMINATED: number = 2;

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

// TreeViewData -> FlatTreeViewData
export const convertTreeViewToFlat = (
        data: TreeViewData[], 
        parentExpanded: boolean = true, 
        rank: number = 1): FlatTreeViewData[] => {
    let newArray: FlatTreeViewData[] = []

    data.forEach((d) => {
        const isShow = (rank === 1 || parentExpanded);
        let newCheckedState: number = d.checkedState;

        if (d.children !== undefined) {
            const counts = d.children!.length;
            const checkedCounts = d.children!.filter((value) => { return value.checkedState === CHECKED}).length;
            const uncheckedCounts = d.children!.filter((value) => { return value.checkedState === UNCHECKED}).length;

            if (uncheckedCounts === counts) {
                newCheckedState = UNCHECKED;
            } else if (checkedCounts === counts) {
                newCheckedState = CHECKED;
            } else {
                newCheckedState = INDETERMINATED;
            }
        }
        
        newArray.push({
            id: d.id, text: d.text,
            checkedState: newCheckedState,
            isExpanded: d.isExpanded, isShow: isShow, rank: rank, 
            isLeaf: (d.children === undefined)
        });

        if (d.children !== undefined) {
            newArray = newArray.concat(convertTreeViewToFlat(d.children!, d.isExpanded, rank + 1));
        }
    });

    return newArray;
}

// css
export const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#666666',
        },
        secondary: {
            main: '#00bb99',
        },
        background: {
            default: '#ddffdd',
        },
    },
});

export const useStyles = makeStyles((theme) =>({
    root: {
        padding: "5px",
        textAlign: "start",
        maxHeight: "25px",
    },
    expansionButton: {
      width: "40px",
      maxWidth: "40px",
      minWidth: "40px",
    },
    expansionIcon: {
        width: "40px",
    },
    checkbox: {
        color: "#222222",
    },
}));

// Tree構造のインデント調整用
export const getIndentSpaces = (rank: number) => {
    return `${(rank - 1) * 30}px`;
};

// テスト用データ
export const createTestTreeViewData = (): TreeViewData[] => {
    let treeViewData: TreeViewData[] = []
    for (let i = 0; i < 10; i++) {
        let parentData: TreeViewData[] = []
        for (let j = 0; j < 10; j++) {
            let childData: TreeViewData[] = []
            for (let k = 0; k < 10; k++) {
                const id = i * 10 * 10 + j * 10 + k;
                const text = `text-${i+1}-${j+1}-${k+1}`;                
                childData.push({ id: id, text: text, checkedState: 0, isExpanded: false, })
            }
            const id = i * 10 + j;
            const text = `text-${i+1}-${j+1}`;
            parentData.push({ id: id, text: text, checkedState: 0, isExpanded: false, children: childData});
        }
        const id = i;
        const text = `text-${i+1}`;
        treeViewData.push({ id: id, text: text, checkedState: 0, isExpanded: false, children: parentData});
    }

    return treeViewData;

    /*
    return [
        { 
            id: 1, text: "text1", checkedState: 0, isExpanded: false, children: [
                { id: 11, text: "text11", checkedState: 0, isExpanded: false, children: [
                    { id: 111, text: "text111", checkedState: 0, isExpanded: false, children: [
                        { id: 1111, text: "text1111", checkedState: 0, isExpanded: false, },
                        { id: 1112, text: "text1112", checkedState: 0, isExpanded: false, },
                    ] }
                ] },
                { id: 12, text: "text12", checkedState: 0, isExpanded: false, },
                { id: 13, text: "text12", checkedState: 0, isExpanded: false, },
                { id: 14, text: "text12", checkedState: 0, isExpanded: false, },
                { id: 15, text: "text12", checkedState: 0, isExpanded: false, },
                { id: 16, text: "text12", checkedState: 0, isExpanded: false, },
                { id: 17, text: "text12", checkedState: 0, isExpanded: false, },
                { id: 18, text: "text12", checkedState: 0, isExpanded: false, },
                { id: 19, text: "text12", checkedState: 0, isExpanded: false, },
                { id: 20, text: "text12", checkedState: 0, isExpanded: false, children: [
                    { id: 201, text: "text201", checkedState: 0, isExpanded: false, },
                    { id: 202, text: "text202", checkedState: 0, isExpanded: false, },
                    { id: 203, text: "text203", checkedState: 0, isExpanded: false, },
                    { id: 204, text: "text204", checkedState: 0, isExpanded: false, },
                    { id: 205, text: "text205", checkedState: 0, isExpanded: false, },
                    { id: 206, text: "text206", checkedState: 0, isExpanded: false, },
                    { id: 207, text: "text207", checkedState: 0, isExpanded: false, },
                    { id: 208, text: "text208", checkedState: 0, isExpanded: false, },
                    { id: 209, text: "text209", checkedState: 0, isExpanded: false, },
                    { id: 210, text: "text210", checkedState: 0, isExpanded: false, },
                ]},
            ]
        },
        {
            id: 2, text: "text2", checkedState: 0, isExpanded: false, children: [
                { id: 21, text: "text21", checkedState: 0, isExpanded: false, },
                { id: 22, text: "text22", checkedState: 0, isExpanded: false, },
                { id: 23, text: "text23", checkedState: 0, isExpanded: false, },
                { id: 24, text: "text24", checkedState: 0, isExpanded: false, },
                { id: 25, text: "text25", checkedState: 0, isExpanded: false, },
                { id: 26, text: "text26", checkedState: 0, isExpanded: false, },
                { id: 27, text: "text27", checkedState: 0, isExpanded: false, },
                { id: 28, text: "text28", checkedState: 0, isExpanded: false, },
                { id: 29, text: "text29", checkedState: 0, isExpanded: false, },
                { id: 30, text: "text30", checkedState: 0, isExpanded: false, },
            ]
        }
    ]
    */
}

export { default as Parent } from "./Parent";
export { default as TreeView } from "./TreeView";
