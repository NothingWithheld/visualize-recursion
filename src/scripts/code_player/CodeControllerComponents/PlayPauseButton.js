'use strict';

import React from 'react';

class PlayPauseButton extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.handlePlayPause();
    }

    render() {
        const playButton = (
            <button
                className="code-player__button code-play__play-button"
                onClick={this.handleClick}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="code-player__icon-play">
                    <circle cx="12" cy="12" r="10" className="code-player__icon-play--colored"/>
                    <path className="icon--white" d="M15.51 11.14a1 1 0 0 1 0 1.72l-5 3A1 1 0 0 1 9 15V9a1 1 0 0 1 1.51-.86l5 3z"/>
                </svg>
                Play
            </button>
        );

        const pauseButton = (
            <button
                className="code-player__button code-player__pause-button"
                onClick={this.handleClick}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="code-player__icon-pause">
                    <circle cx="12" cy="12" r="10" className="code-player__icon-pause--colored"/>
                    <path className="icon--white" d="M9 8h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zm5 0h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                </svg>
                Pause
            </button>
        );

        const grayedOutPlayButton = (
            <button
                className="code-player__button code-player__button--unclickable"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="code-player__icon-play">
                    <circle cx="12" cy="12" r="10" className="icon--gray"/>
                    <path className="icon--white" d="M15.51 11.14a1 1 0 0 1 0 1.72l-5 3A1 1 0 0 1 9 15V9a1 1 0 0 1 1.51-.86l5 3z"/>
                </svg>
                Play
            </button>
        );

        return this.props.isCompleted ? grayedOutPlayButton : this.props.isPlaying ? pauseButton : playButton;
    }
}

export default PlayPauseButton;