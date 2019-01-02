'use strict';

import React from 'react';
import TreeNode from '../../node_tree/TreeNode';
import FibonacciBlock from './FibonacciBlock';

function* fibonacciGenerator(argValue, parentComponent) {
    let fibBlockRef;
    const fibBlock = <TreeNode 
        ref={fibBlock => fibBlockRef = fibBlock}
        ChildComponent={FibonacciBlock}
        nodeClassNames="fibonacci-block__child"
        argValue={argValue}
        returned={false}
        key={argValue}
    />;

    parentComponent.addChildComponent(fibBlock);
    
    yield;

    let returnValue;
    if (argValue === 1 || argValue === 2) {
        returnValue = 1;
    } else {
        const fibOfArgValueMinusOne = yield* fibonacciGenerator(argValue - 1, fibBlockRef); 
        const fibOfArgValueMinusTwo = yield* fibonacciGenerator(argValue - 2, fibBlockRef);

        returnValue = fibOfArgValueMinusOne + fibOfArgValueMinusTwo;
    }

    // update node return value
    fibBlockRef.addProps([['returned', true], ['returnValue', returnValue]]);
    
    yield returnValue;
    return returnValue;
}

export default fibonacciGenerator;