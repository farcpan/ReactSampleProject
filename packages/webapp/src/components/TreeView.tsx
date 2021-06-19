import React, { useEffect, useState } from 'react';
import { TreeViewData, FlatTreeViewData, convertTreeViewToFlat } from "./index";
import { Button, Typography, Checkbox, Box } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


export interface TreeViewProps {
    data: TreeViewData[];
    onChange(results: TreeViewData[]): void;
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
            original[index].isChecked = isChecked;
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
            const trueCounts = d.children!.filter((value) => { return value.isChecked }).length;
            original[index].isChecked = (count == trueCounts);
        }
    })
}

/**
 * TreeView with checkbox component
 * @param props Data for treeview
 * @returns Component
 */
const TreeView = (props: TreeViewProps) => {
    // データ
    const [original, setOriginal] = useState<TreeViewData[]>([]);
    // 表示用に変換したデータ
    const [current, setCurrent] = useState<FlatTreeViewData[]>([]);

    // チェックボックス操作時のコールバック
    const onCheckChange = (id: number, isChecked: boolean) => {
        let copied = JSON.parse(JSON.stringify(original));  // deep copy
        updateChecked(id, isChecked, copied);
        setOriginal(copied);

        const flatten = convertTreeViewToFlat(copied);
        setCurrent(flatten);
    }

    // ツリー操作時のコールバック
    const onExpansionChange = (id: number, isExpanded: boolean) => {
        let copied = JSON.parse(JSON.stringify(original));  // deep copy
        updateExpansion(id, isExpanded, copied);
        setOriginal(copied);

        const flatten = convertTreeViewToFlat(copied);
        setCurrent(flatten);
    }

    // Componentマウント時にPropsで受け取ったデータをStateに反映する
    useEffect(() => {
        setOriginal(props.data);
        setCurrent(convertTreeViewToFlat(props.data, true));
    }, []);

    return (
        <div>
            {
                current.map((data) => {
                    let widthOfButtonArea = "0px";
                    if (data.rank === 2) {
                        widthOfButtonArea = "50px";
                    } else if (data.rank === 3) {
                        widthOfButtonArea = "100px";
                    } else if (data.rank >= 4) {
                        widthOfButtonArea = "150px";
                    }

                    return (
                        <div style={{textAlign: "start"}}>
                            {
                                (() => {
                                    if (data.isShow || data.rank === 1) {
                                        return (
                                            <Box flexDirection="row" display="inline-flex" >
                                                <div style={{ width: widthOfButtonArea }}></div>
                                                <div style={{ width: "50px"  }}>
                                                    {
                                                        (() => {
                                                            if (!data.isLeaf) {
                                                                if (data.isExpanded) {
                                                                    return (
                                                                        <Button onClick={() => { onExpansionChange(data.id, false) }}>
                                                                            <ExpandMoreIcon />
                                                                        </Button>
                                                                    );    
                                                                } else {
                                                                    return (
                                                                        <Button onClick={() => { onExpansionChange(data.id, true) }}>
                                                                            <ChevronRightIcon />
                                                                        </Button>
                                                                    );    
                                                                }
                                                            } else {
                                                                return <div></div>
                                                            }                        
                                                        })()
                                                    }
                                                </div>
                                                <div style={{ width: "50px" }}>
                                                    <Checkbox
                                                        checked={data.isChecked} 
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { 
                                                                    onCheckChange(data.id, event.target.checked) 
                                                                }}/>
                                                </div>
                                                <Typography style={{ color: "#000000", textAlign: "start", padding: "10px" }}>
                                                    {data.id}: {data.text}: {(data.isShow) ? "show" : "hidden"}
                                                </Typography>
                                            </Box>
                                        )
                                    }
                                })()
                            }
                        </div>
                    )
                })
            }
        </div>
    );
}

export default TreeView;
