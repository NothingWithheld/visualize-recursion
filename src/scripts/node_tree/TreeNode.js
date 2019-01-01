'use strict';

import React from 'react';

class TreeNode extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            childNodes: [],
            additionalProps: {}
        };

        this.addChildComponent = this.addChildComponent.bind(this);
        this.addProps = this.addProps.bind(this);
    }

    addChildComponent(childNode) {
        this.setState(prevState => (
            {
                childNodes: prevState.childNodes.concat(childNode)
            }
        ));
    }

    addProps(newProps) {
        this.setState(prevState => {
            let newAdditionalProps = prevState.additionalProps;
            for (const [propName, propValue] of newProps) {
                newAdditionalProps[propName] = propValue;
            }
            
            return newAdditionalProps;
        });
    }

    render() {
        const { nodeClassNames, ChildComponent, ...passThroughProps } = this.props;

        return (
            <div
                className={`tree-node ${nodeClassNames}`}
            >
                {ChildComponent && <ChildComponent {...passThroughProps} {...this.state.additionalProps} />}
                {
                    this.state.childNodes
                }
            </div>
        );
    }
}

export default TreeNode;