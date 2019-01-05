'use strict';

import React from 'react';
import PlayPauseButton from './CodeControllerComponents/PlayPauseButton';
import StepButton from './CodeControllerComponents/StepButton';
import ResetButton from './CodeControllerComponents/ResetButton';
import SingleInput from './CodeControllerComponents/SingleInput';

function CodeController(props) {
    // object destructuring assignment, and assign to different variable name
    const { label: delayLabel, name: delayName, value: delayValue } = props.delayObj;

    return (
        <div
            className="code-controller"
        >
            <div
                className="code-controller__button-controls"
            >
                <PlayPauseButton
                    handlePlayPause={props.handlePlayPause}
                    isCompleted={props.isCompleted}
                    isPlaying={props.isPlaying}
                />
                <StepButton 
                    handleStep={props.handleStep}
                    isCompleted={props.isCompleted}
                    isPlaying={props.isPlaying}
                />
                <ResetButton 
                    handleReset={props.handleReset}
                    isPlaying={props.isPlaying}
                />
            </div>
            <div
                className="code-controller__inputs"
            >
                {
                    props.functionInputObjs.map((inputObj, i) => {
                        const { label: inputLabel, name: inputName, value: inputValue } = inputObj;
                        
                        return (
                            <SingleInput 
                                key={inputName}
                                handleChange={props.handleChange}
                                label={inputLabel}
                                name="functionInputObjs"
                                dataIndex={i}
                                value={inputValue}
                            />
                        )
                    })
                }
                <SingleInput 
                    handleChange={props.handleChange}
                    label={delayLabel}
                    name="delayObj"
                    value={delayValue}
                />
            </div>
        </div>
    );
}

export default CodeController;