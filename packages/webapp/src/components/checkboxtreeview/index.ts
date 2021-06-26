import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

// チェックボックス状態定義
export const UNCHECKED: number = 0;
export const CHECKED: number = 1;
export const INDETERMINATED: number = 2;

// ツリービュー用のデータ構造
export interface TreeViewData {
    id: number;
    text: string;
    checkedState: number;       // UNCHECKED/CHECKED/INDETERMINATED
    isExpanded: boolean;
    children?: TreeViewData[];
}

// ツリービュー表示用のデータ構造
export interface FlatTreeViewData {
    id: number;
    text: string;
    checkedState: number;       // UNCHECKED/CHECKED/INDETERMINATED
    isExpanded: boolean;
    hidden: boolean;
    hierarchy: number;
    isLeaf: boolean;
}

// TreeViewData -> FlatTreeViewData
export const convertTreeViewToFlat = (data: TreeViewData[], parentExpanded: boolean = true, hierarchy: number = 1): FlatTreeViewData[] => {
    let converted: FlatTreeViewData[] = []

    data.forEach((d) => {
        const hidden = !(hierarchy === 1 || parentExpanded);
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
        
        converted.push({
            id: d.id, text: d.text,
            checkedState: newCheckedState,
            isExpanded: d.isExpanded, hidden: hidden, hierarchy: hierarchy, 
            isLeaf: (d.children === undefined)
        });

        if (d.children !== undefined) {
            converted = converted.concat(convertTreeViewToFlat(d.children!, d.isExpanded, hierarchy + 1));
        }
    });

    return converted;
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

// TreeViewのスタイル
export const useStyles = makeStyles((theme) =>({
    root: {
        textAlign: "start",
        minHeight: "35px",
        maxHeight: "35px",
        margin: "5px",
    },
    expansionButton: {
        width: "30px",
        minHeight: "25px",
        maxHeight: "25px",
        marginLeft: "5px",
        marginRight: "10px",
        paddingLeft: "5px",
        paddingRight: "5px",
        paddingTop: "5px",
        paddingBottom: "5px",
        textAlign: "center",
    },
    expansionIcon: {
        color: "#000000",
    },
    checkbox: {
        color: "#222222",
        minHeight: "35px",
        maxHeight: "35px",
    },
}));

// Tree構造のインデント調整用
export const getIndentSpaces = (hierarchy: number, width: number = 30) => {
    return `${(hierarchy - 1) * width}px`;
};

// テスト用データ
const N = 10;
export const createTestTreeViewData = (): TreeViewData[] => {
    let treeViewData: TreeViewData[] = []
    for (let i = 1; i <= N; i++) {
        let parentData: TreeViewData[] = []
        for (let j = 1; j <= N; j++) {
            let childData: TreeViewData[] = []
            for (let k = 1; k <= N; k++) {
                const id = i * N * N + j * N + k;
                const text = `text-${i}-${j}-${k}`;                
                childData.push({ id: id, text: text, checkedState: 0, isExpanded: false, })
            }
            const id = i * N + j;
            const text = `text-${i}-${j}`;
            parentData.push({ id: id, text: text, checkedState: 0, isExpanded: false, children: childData});
        }
        const id = i;
        const text = `text-${i}`;
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

export { default as CheckboxTreeView } from "./CheckboxTreeView";
