'use strict';

import React from 'react';

class SingleInput extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.handleChange(event);
    }

    render() {
        return (
            <label>
                {this.props.label}
                <input 
                    onChange={this.handleChange} 
                    name={this.props.name}
                    index={this.props.index}
                    value={this.props.value}
                />
            </label>
        );
    }
}

export default SingleInput;