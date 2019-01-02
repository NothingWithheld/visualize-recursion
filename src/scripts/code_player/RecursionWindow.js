'use strict';

import React from 'react';

class RecursionWindow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                className="fibonacci-wrapper"
            >
                {this.props.children}
            </div>
        );
    }
}

export default RecursionWindow;