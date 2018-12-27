import React from 'react';
import PlayPauseButton from './CodeControllerComponents/PlayPauseButton';
import StepButton from './CodeControllerComponents/StepButton';
import ResetButton from './CodeControllerComponents/ResetButton';
import SingleInput from './CodeControllerComponents/SingleInput';

function CodeController(props) {
    const {delayLabel, delayName, delayValue} = props.delayObj;

    return (
        <div
            className="code-controller"
        >
            <div
                className="code-controller__button-controlls"
            >
                <PlayPauseButton
                    handleClick={props.handlePlayPause}
                    isCompleted={props.isCompleted}
                    isPlaying={props.isPlaying}
                />
                <StepButton 
                    handleClick={props.handleStep}
                    isCompleted={props.isCompleted}
                />
                <ResetButton 
                    handleClick={props.handleReset}
                    isPlaying={props.isPlaying}
                />
            </div>
            <div
                className="code-controller__inputs"
            >
                {
                    props.functionInputObjs.map((inputObj) => {
                        const {inputLabel, inputName, inputValue} = inputObj;
                        
                        return (
                            <SingleInput 
                                key={inputName}
                                handleChange={props.handleChange}
                                label={inputLabel}
                                name={inputName}
                                value={inputValue}
                            />
                        )
                    })
                }
                <SingleInput 
                    handleChange={props.handleChange}
                    label={delayLabel}
                    name={delayName}
                    value={delayValue}
                />
            </div>
        </div>
    );
}

export default CodeController;