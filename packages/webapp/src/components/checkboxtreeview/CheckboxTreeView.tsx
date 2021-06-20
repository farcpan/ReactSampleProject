import React, { useEffect, useState } from 'react';

// Material UI
import { ThemeProvider } from '@material-ui/core/styles';
import { Button, FormControlLabel, Checkbox, Box } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { TreeViewData, FlatTreeViewData } from "./index";
import { convertTreeViewToFlat } from "./index";
import { useStyles, theme, getIndentSpaces } from "./index";
import { CHECKED, UNCHECKED, INDETERMINATED } from "./index";

// TreeView用Props
interface TreeViewProps {
    data: TreeViewData[];
    onChange(results: TreeViewData[]): void;
}

// SubTreeView用Props
interface SubTreeViewProps {
    data: TreeViewData;
    onChange(result: TreeViewData): void;
}

// ExpansionButton用Props
interface ExpansionButtonProps {
    isLeaf: boolean;
    isExpanded: boolean;
    onClick(result: boolean): void;
}

// ツリーの展開状態を更新する
const updateExpansion = (id: number, isExpanded: boolean, data: TreeViewData[]) => {
    data.forEach((d, index) => {
        if (d.id === id) {
            data[index].isExpanded = isExpanded;
            if (d.children !== undefined && !isExpanded) {  // 閉じる場合は子要素すべてに影響、開く場合は1つ下の階層まで
                d.children!.forEach((value) => {
                    updateExpansion(value.id, isExpanded, d.children!);
                })
            }
        } else {
            if (d.children !== undefined) {
                updateExpansion(id, isExpanded, d.children!);
            }
        }
    })
}

// チェックボックスの状態を更新する
const updateChecked = (id: number, isChecked: boolean, data: TreeViewData[]) => {
    setChecked(id, isChecked, data);    // 1st step: チェックボックスの状態を更新する
    adjustChecked(data);                // 2nd step: 1st stepの変更内容をデータ全体で確認して中間状態を考慮した状態に更新する
}

// 1st step
const setChecked = (id: number, isChecked: boolean, data: TreeViewData[]) => {
    data.forEach((d, index) => {
        if (d.id === id) {
            data[index].checkedState = (isChecked) ? CHECKED : UNCHECKED;
            if (d.children !== undefined) {
                d.children!.forEach((value) => {
                    setChecked(value.id, isChecked, d.children!);
                })
            }
        } else {
            if (d.children !== undefined) {
                setChecked(id, isChecked, d.children!);
            }
        }
    })
}

// 2nd step
const adjustChecked = (data: TreeViewData[]) => {
    data.forEach((d, index) => {
        if (d.children !== undefined) {
            adjustChecked(d.children!);

            const count = d.children!.length;   // 子要素の数
            const checkedCounts = d.children!.filter((value) => { return value.checkedState === CHECKED }).length;
            const uncheckedCounts = d.children!.filter((value) => { return value.checkedState === UNCHECKED }).length;
            
            if (count === uncheckedCounts) {
                data[index].checkedState = UNCHECKED;
            } else if (count === checkedCounts) {
                data[index].checkedState = CHECKED;
            } else {
                data[index].checkedState = INDETERMINATED; 
            }
        }
    })
}

// Expansion button
const ExpansionButton = (props: ExpansionButtonProps) => {
    const styles = useStyles();

    // TreeViewの末端にはボタンを表示しない
    if (props.isLeaf) {
        return (<div className={styles.expansionButton}></div>);
    }

    if (props.isExpanded) {
        return (
            <Button className={styles.expansionButton} onClick={() => { props.onClick(false) }}>
                <ExpandMoreIcon className={styles.expansionIcon}/>
            </Button>
        );
    }

    return (
        <Button className={styles.expansionButton} onClick={() => { props.onClick(true) }}>
            <ChevronRightIcon className={styles.expansionIcon}/>
        </Button>
    );
}

// SubTreeView
const SubTreeView = (props: SubTreeViewProps) => {
    const styles = useStyles();

    // データ
    const [data, setData] = useState<TreeViewData>(props.data);
    // 表示用に変換したデータ
    const [displayData, setDisplayData] = useState<FlatTreeViewData[]>(convertTreeViewToFlat([props.data]));

    // チェックボックス操作時のコールバック
    const onCheckChange = (id: number, isChecked: boolean) => {
        let copied: TreeViewData = JSON.parse(JSON.stringify(data));  // deep copy
        updateChecked(id, isChecked, [copied]);
        setData(copied);

        const flatten = convertTreeViewToFlat([copied]);
        setDisplayData(flatten);    // Stateの更新
        props.onChange(copied);     // 呼び出し元に変更内容を返す 
    }

    // ツリー操作時のコールバック
    const onExpansionChange = (id: number, isExpanded: boolean) => {
        let copied: TreeViewData = JSON.parse(JSON.stringify(data));
        updateExpansion(id, isExpanded, [copied]);
        setData(copied);

        const flatten = convertTreeViewToFlat([copied]);
        setDisplayData(flatten);    // Stateの更新
        props.onChange(copied);     // 呼び出し元に変更内容を返す
    }

    return (
        <div>
            {
                displayData.map((value) => {
                    if (value.hidden) {
                        return <div key={`subtreeview-div-${value.id}`}></div>;
                    }

                    const widthOfButtonArea = getIndentSpaces(value.hierarchy);
                    return (
                        <div key={`subtreeview-div-${value.id}`} className={styles.root}>
                            <Box flexDirection="row" display="inline-flex">
                                <div style={{ width: widthOfButtonArea }}></div>
                                <ExpansionButton 
                                    isLeaf={value.isLeaf}
                                    isExpanded={value.isExpanded}
                                    onClick={(result) => { onExpansionChange(value.id, result) }}
                                    />
                                <FormControlLabel 
                                    className={styles.checkbox}
                                    control={
                                        <Checkbox
                                            checked={(value.checkedState === CHECKED || value.checkedState === INDETERMINATED)} 
                                            indeterminate={(value.checkedState === INDETERMINATED)}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => { 
                                                    onCheckChange(value.id, event.target.checked) 
                                                }}/>
                                            }
                                    label={value.text} />
                            </Box>
                        </div>
                    )                    
                })
            }
        </div>
    );
}

// TreeView本体
const CheckboxTreeView = (props: TreeViewProps) => {
    const [data, setData] = useState<TreeViewData[]>([]);

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    // TreeViewの変更内容を受け取ってデータを更新する
    const onChange = (index: number, result: TreeViewData) => {
        let copied: TreeViewData[] = JSON.parse(JSON.stringify(props.data));
        copied[index] = result;     // データを更新する

        setData(copied);            // Stateの更新
        props.onChange(copied);     // 呼び出し元に変更後のデータを返す
    }

    return (
        <ThemeProvider theme={theme}>
            {
                data.map((value, index) => {
                    return (
                        <SubTreeView 
                            key={`subtreeview-${index + 1}`} 
                            data={value} 
                            onChange={(result: TreeViewData) => { onChange(index, result)}}/>
                    )
                })
            }
        </ThemeProvider>
    )
}

export default CheckboxTreeView;