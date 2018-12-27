'use strict';

import React from 'react';

class StepButton extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.handleStep();
    }

    render() {
        const stepButton = (
            <button
                className="code-player__button code-player__step-button"
                onClick={this.handleClick}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="icon-arrow-thin-right-circle">
                    <circle cx="12" cy="12" r="10" className="icon-arrow-thin-right-circle--colored"/>
                    <path className="icon--white" d="M14.59 13H7a1 1 0 0 1 0-2h7.59l-2.3-2.3a1 1 0 1 1 1.42-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.42-1.4l2.3-2.3z"/>
                </svg>
                Step
            </button>
        );

        const grayedOutStepButton = (
            <button
                className="code-player__button code-player__button--unclickable"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="icon-arrow-thin-right-circle">
                    <circle cx="12" cy="12" r="10" className="icon--gray"/>
                    <path className="icon--white" d="M14.59 13H7a1 1 0 0 1 0-2h7.59l-2.3-2.3a1 1 0 1 1 1.42-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.42-1.4l2.3-2.3z"/>
                </svg>
                Step
            </button>
        );

        return this.isCompleted ? grayedOutStepButton : stepButton;
    }
}

export default StepButton;

