import React from 'react';
import { Data, SubData } from './index';

import { Button } from '@material-ui/core';

export interface ParentProps {
    data: Data;
    onChange(parentIndex: number, childIndex: number, index: number): void;
}

export interface ChildProps {
    subData: SubData;
    onChange(childIndex: number, index: number): void;
};


const Child = (props: ChildProps) => {
    return (
        <div>
            <p>---------------------------------</p>
            <p>----subid: {props.subData.id}</p>
            <p>----subtext: {props.subData.text}</p>
            <p>----answer: {props.subData.answer}</p>
            {
                props.subData.data.map((value, index) => {
                    return <Button onClick={() => { props.onChange(props.subData.id, index) }}>{value}</Button>
                })
            }
        </div>
    );
};

const Parent = (props: ParentProps) => {
    const handler = (childIndex: number, index: number) => {
        // console.log(`INDEX CHANGE: ${index}`);
        props.onChange(props.data.id, childIndex, index);
    }

    return (
        <div>
            <p>id: {props.data.id}</p>
            <p>text: {props.data.text}</p>
            {
                props.data.data.map((value, index) => {
                    const childProps = { subData: value, onChange: handler }
                    return <Child {...childProps}/>
                })
            }
        </div>
    );
}

export default Parent;