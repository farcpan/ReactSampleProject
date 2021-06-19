import React, { useEffect, useState } from 'react';
import { TreeViewData, FlatTreeViewData, convertTreeViewToFlat } from "./index";
import { CHECKED, UNCHECKED, INDETERMINATED } from "./index";
import { useStyles, getIndentSpaces, theme } from "./index";
import { ThemeProvider } from '@material-ui/core/styles';
import { Button, FormControlLabel, Checkbox, Box } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

// TreeView用Props
export interface TreeViewProps {
    data: TreeViewData[];
    onChange(results: TreeViewData[]): void;
}

// SubTreeView用Props
export interface SubTreeViewProps {
    data: TreeViewData;
    onChange(result: TreeViewData): void;
}

// ExpansionButton用Props
export interface ExpansionButtonProps {
    isLeaf: boolean;
    isExpanded: boolean;
    onClick(result: boolean): void;
}

// ツリーの展開状態を更新する
const updateExpansion = (id: number, isExpanded: boolean, original: TreeViewData[]) => {
    original.forEach((d, index) => {
        if (d.id === id) {
            original[index].isExpanded = isExpanded;
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
const updateChecked = (id: number, isChecked: boolean, original: TreeViewData[]) => {
    setChecked(id, isChecked, original);
    adjustChecked(original);
}

// 1st step of checked state update
const setChecked = (id: number, isChecked: boolean, original: TreeViewData[]) => {
    original.forEach((d, index) => {
        if (d.id === id) {
            original[index].checkedState = (isChecked) ? CHECKED : UNCHECKED;
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
const adjustChecked = (original: TreeViewData[]) => {
    original.forEach((d, index) => {
        if (d.children !== undefined) {
            adjustChecked(d.children!);

            const count = d.children!.length;   // 子要素の数
            const checkedCounts = d.children!.filter((value) => { return value.checkedState === CHECKED }).length;
            const uncheckedCounts = d.children!.filter((value) => { return value.checkedState === UNCHECKED }).length;
            
            if (count === uncheckedCounts) {
                original[index].checkedState = UNCHECKED;
            } else if (count === checkedCounts) {
                original[index].checkedState = CHECKED;
            } else {
                original[index].checkedState = INDETERMINATED; 
            }
        }
    })
}

// Expansion button
const ExpansionButton = (props: ExpansionButtonProps) => {
    const styles = useStyles();

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
    const [original, setOriginal] = useState<TreeViewData>(props.data);
    // 表示用に変換したデータ
    const [current, setCurrent] = useState<FlatTreeViewData[]>(convertTreeViewToFlat([props.data]));

    useEffect(() => {
        console.log("treeview is mounted.");
    }, []);

    // チェックボックス操作時のコールバック
    const onCheckChange = (id: number, isChecked: boolean) => {
        let copied: TreeViewData = JSON.parse(JSON.stringify(original));  // deep copy
        updateChecked(id, isChecked, [copied]);
        setOriginal(copied);

        const flatten = convertTreeViewToFlat([copied]);
        setCurrent(flatten);

        // callback
        props.onChange(copied);
    }

    // ツリー操作時のコールバック
    const onExpansionChange = (id: number, isExpanded: boolean) => {
        let copied: TreeViewData = JSON.parse(JSON.stringify(original));  // deep copy
        updateExpansion(id, isExpanded, [copied]);
        setOriginal(copied);

        const flatten = convertTreeViewToFlat([copied]);
        setCurrent(flatten);

        // callback
        props.onChange(copied);
    }

    return (
        <div>
            {
                current.map((data) => {
                    if (!data.isShow) {
                        return <div></div>;
                    }

                    const widthOfButtonArea = getIndentSpaces(data.rank);
                    return (
                        <div className={styles.root}>
                            <Box flexDirection="row" display="inline-flex">
                                <div style={{ width: widthOfButtonArea }}></div>
                                <ExpansionButton 
                                    isLeaf={data.isLeaf}
                                    isExpanded={data.isExpanded}
                                    onClick={(result) => { onExpansionChange(data.id, result) }}
                                    />
                                <FormControlLabel 
                                    className={styles.checkbox}
                                    control={
                                        <Checkbox
                                            checked={(data.checkedState === CHECKED || data.checkedState === INDETERMINATED)} 
                                            indeterminate={(data.checkedState === INDETERMINATED)}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => { 
                                                    onCheckChange(data.id, event.target.checked) 
                                                }}/>
                                            }
                                    label={data.text} />
                            </Box>
                        </div>
                    )                    
                })
            }
        </div>
    );
}

const TreeView = (props: TreeViewProps) => {
    const [original, setOriginal] = useState<TreeViewData[]>(props.data);

    const onChange = (index: number, result: TreeViewData) => {
        let copied: TreeViewData[] = JSON.parse(JSON.stringify(props.data));
        copied[index] = result;
        setOriginal(copied);

        props.onChange(copied);
    }

    return (
        <ThemeProvider theme={theme}>
            {
                props.data.map((d, index) => {
                    return (
                        <SubTreeView 
                            key={`subtreeview-${index+1}`} 
                            data={d} onChange={(result: TreeViewData) => { onChange(index, result)}}/>
                    )
                })
            }
        </ThemeProvider>
    )
}

export default TreeView;
