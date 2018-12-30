'use strict';

import React from 'react';
import CodeController from './CodeController';

class RecursionVisualizer extends React.Component {
    constructor(props) {
        super(props);

        let functionInputObjs = [];
        for (let i = 1; i <= props.defaultArgs.length; i++) {
            const defaultFunctionArg = props.defaultArgs[i - 1];
            functionInputObjs.push({
                label: `Argument ${i}`,
                name: `Argument ${i}`,
                value: defaultFunctionArg
            });
        }

        this.state = {
            functionInputObjs,
            isReset: true,
            isCompleted: false,
            isPlaying: false,
            generator: null,
            generatorYield: null, 
            delayObj: {
                label: 'Delay in Seconds',
                name: 'delay',
                value: '0.5'
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handlePlayPause = this.handlePlayPause.bind(this);
        this.handleStep = this.handleStep.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleChange(event) {
        const { name, dataset, value } = event.target;
        const { index } = dataset;

        this.setState((prevState) => {
            let newInputState = prevState[name];

            if (Array.isArray(newInputState)) {
                let editedInputObj = newInputState[index];
                editedInputObj.value = value;
            } else {
                newInputState.value = value;
            }

            return newInputState;
        });
    }

    handlePlayPause() {
        if (this.state.isReset) {
            // check if the user inputs are valid
            const delayInputIsValid = !isNaN(this.state.delayObj.value);
            const functionInputsAreValid = this.state.functionInputObjs.reduce((acc, inputObj) => {
                const curInputIsValid = !isNaN(inputObj.value);
                return acc && curInputIsValid; 
            }, true);

            if (delayInputIsValid && functionInputsAreValid) {
                // if user inputs are valid
                // make a new generator with these inputs
                // start it

                this.setState({
                    isReset: false,
                    isPlaying: true
                });
            } else {
                // if user inputs are NOT valid
                // show an error message
            }
        } else if (this.state.isPlaying) {
            // pause 
            this.setState({
                isPlaying: false
            });
        } else {
            // play
            this.setState({
                isPlaying: true
            })
        }
    }

    handleStep() {

    }

    handleReset() {
        this.setState({
            isReset: true
        });
    }

    render() {
        return (
            <div>
                <CodeController 
                    handlePlayPause={this.handlePlayPause}
                    handleStep={this.handleStep}
                    handleReset={this.handleReset}
                    handleChange={this.handleChange}

                    isCompleted={this.state.isCompleted}
                    isPlaying={this.state.isPlaying}

                    delayObj={this.state.delayObj}
                    functionInputObjs={this.state.functionInputObjs}
                />
            </div>
            
        );
    }
}

// class CodePlayer {
//     constructor(generatorFunction, simulationControllerDOMRef, ...codePlayerClassNames) {
//         this.codePlayer = this.createCodePlayer(codePlayerClassNames);
//         this.generatorFunction = generatorFunction;

//         this.generator;
//         this.generatorYield;

//         this.simulationControllerDOMRef = simulationControllerDOMRef;
//         this.simluationStartButton = simulationControllerDOMRef.querySelector('.simulation-controller__start-button');
//         this.simluationFunctionParameterInput = simulationControllerDOMRef.querySelector('.simulation-controller__function-parameter');
//         this.simulationPlayPause = simulationControllerDOMRef.querySelector('.simulation-controller__play-button');
//         this.simulationDelayInput = simulationControllerDOMRef.querySelector('.simulation-controller__delay');
//         this.simulationStepper = simulationControllerDOMRef.querySelector('.simulation-controller__step-next');

//         this.delay;
//         this.paused = false;

//         this.playFunction = this.playFunction.bind(this);
//         this.step = this.step.bind(this);
//         this.getSimulationDelay = this.getSimulationDelay.bind(this);
//         this.getFunctionParameter = this.getFunctionParameter.bind(this);
//         this.togglePlayPause = this.togglePlayPause.bind(this);
//         this.startFunction = this.startFunction.bind(this);
//         this.clearCodePlayer = this.clearCodePlayer.bind(this);
//     }

//     createCodePlayer(classNames) {
//         const codePlayer = document.createElement('div');
//         codePlayer.classList.add('code-player', ...classNames);

//         return codePlayer;
//     }

//     placeCodePlayerAtLocation(DOMLocation) {
//         DOMLocation.appendChild(this.codePlayer);
//     }

//     startFunction() {
//         const functionParameter = this.getFunctionParameter();
//         const delay = this.getSimulationDelay();
//         this.delay = delay;

//         this.generator = this.generatorFunction(functionParameter, this.codePlayer);
//         console.log(this.generator);
//         this.clearCodePlayer();
//         this.paused = false;
//         this.playFunction();
//     }

//     playFunction() {
//         console.log(this.paused);
//         if (this.paused) {
//             return;
//         } else {
//             let codeStepper = setTimeout(function step(self) {
//                 if (self.paused) {
//                     return;
//                 }
//                 self.step();
//                 if (self.generatorYield && self.generatorYield.done) {
//                     return;
//                 } else {
//                     codeStepper = setTimeout(step, self.delay, self);
//                 }
//             }, this.delay, this);
//         }
//     }

//     step() {
//         if (this.generatorYield && this.generatorYield.done) {
//             return;
//         } else {
//             this.generatorYield = this.generator.next();
//         }
//     }

//     getFunctionParameter() {
//         return Number(this.simluationFunctionParameterInput.value);
//     }

//     getSimulationDelay() {
//         return Number(this.simulationDelayInput.value) * 1000;
//     }

//     togglePlayPause() {
//         this.paused = !this.paused;
//     }

//     clearCodePlayer() {
//         this.codePlayer.innerHTML = '';
//     }
// }

export default RecursionVisualizer;