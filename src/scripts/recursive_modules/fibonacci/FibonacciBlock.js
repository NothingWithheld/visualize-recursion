'use strict';

import React from 'react';

function FibonacciBlock(props) {
    return (
        <div
            className="fibonacci-block"
        >
            <p  
                className={`fibonacci-block__function-name fibonacci-block__top-row ${props.returned ? 'fibonacci-block__function-name--resolved' : null}`}
            >
                fib({props.argValue})
            </p>
            <p
                className={`fibonacci-block__return-value fibonacci-block__bottom-row ${props.returned ? 'fibonacci-block__return-value--returned' : null}`}
            >
                {props.returned ? props.returnValue : 'waiting'}
            </p>
        </div>
    )
}

export default FibonacciBlock;