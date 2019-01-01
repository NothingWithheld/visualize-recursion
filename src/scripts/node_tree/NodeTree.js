'use strict';

import React from 'react';

class NodeTree extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            root: null
        };

        this.addChildComponent = this.addChildComponent.bind(this);
    }

    addChildComponent(rootNode) {
        this.setState({
            root: rootNode
        });
    }

    render() {
        const RootNode = this.state.root;
        const { containerClassNames } = this.props;

        return (
            <div
                className={containerClassNames}
            >
                {RootNode}
            </div>
        );
    }
}

export default NodeTree;