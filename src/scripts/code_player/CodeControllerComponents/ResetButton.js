'use strict';

import React from 'react';

class ResetButton extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        this.props.handleReset();
    }

    render() {
        const resetButton = (
            <button
                className="code-player__button code-player__reset-button"
                onClick={this.handleClick}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="icon-refresh">
                    <circle cx="12" cy="12" r="10" className="icon-refresh--colored"/>
                    <path className="icon--white" d="M8.52 7.11a5.98 5.98 0 0 1 8.98 2.5 1 1 0 1 1-1.83.8 4 4 0 0 0-5.7-1.86l.74.74A1 1 0 0 1 10 11H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1.7-.7l.82.81zm5.51 8.34l-.74-.74A1 1 0 0 1 14 13h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1.7.7l-.82-.81A5.98 5.98 0 0 1 6.5 14.4a1 1 0 1 1 1.83-.8 4 4 0 0 0 5.7 1.85z"/>
                </svg>
                Reset
            </button>
        );

        const grayedOutResetButton = (
            <button
                className="code-player__button code-player__reset-button"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="icon-refresh">
                    <circle cx="12" cy="12" r="10" className="icon-refresh--gray"/>
                    <path className="icon--white" d="M8.52 7.11a5.98 5.98 0 0 1 8.98 2.5 1 1 0 1 1-1.83.8 4 4 0 0 0-5.7-1.86l.74.74A1 1 0 0 1 10 11H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1.7-.7l.82.81zm5.51 8.34l-.74-.74A1 1 0 0 1 14 13h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1.7.7l-.82-.81A5.98 5.98 0 0 1 6.5 14.4a1 1 0 1 1 1.83-.8 4 4 0 0 0 5.7 1.85z"/>
                </svg>
                Reset
            </button>
        );

        return this.isPlaying ? resetButton : grayedOutResetButton;
    }
}

export default ResetButton;