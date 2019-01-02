'use strict';

import React from 'react';
import CodeController from './CodeController';
import RecursionWindow from './RecursionWindow';

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

        const Container = this.props.outputContainer;
        const ContainerComponent = <Container 
            ref={thisComponent => this.containerComponentRef = thisComponent} 
            containerClassNames={this.props.containerClassNames} 
        />;

        this.state = {
            functionInputObjs,
            ContainerComponent,
            isReset: true,
            isCompleted: false,
            isPlaying: false,
            generator: null,
            iteratorRes: null, 
            delayObj: {
                label: 'Delay in Seconds',
                name: 'delay',
                value: '0.5'
            },
            calledDelayValue: null,
            calledFunctionArgs: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handlePlayPause = this.handlePlayPause.bind(this);
        this.handleStep = this.handleStep.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleChange(event) {
        const { name, dataset, value } = event.target;
        const { index } = dataset;

        this.setState(prevState => {
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
            if (!this.areInputsValid()) return;

            this.initializeGenerator();
        }

        if (this.state.isPlaying) {
            // pause
            this.setState({
                isPlaying: false
            });
        } else {
            // play
            this.setState({
                isPlaying: true
            });

            this.startPlaying();
        }
    }

    handleStep() {
        if (this.state.isReset) {
            if (!this.areInputsValid()) return;

            this.initializeGenerator();
        }

        this.stepOnce();
    }

    handleReset() {
        this.updateContainer();
        this.setState({
            isReset: true
        });
    }

    areInputsValid() {
        const delayInputIsValid = !isNaN(this.state.delayObj.value);
        const functionInputsAreValid = this.state.functionInputObjs.reduce((acc, inputObj) => {
            const curInputIsValid = !isNaN(inputObj.value);
            return acc && curInputIsValid; 
        }, true);

        return delayInputIsValid && functionInputsAreValid;
    }

    initializeGenerator() {
        const calledDelayValue = Number(this.state.delayObj.value) * 1000;
        const calledFunctionArgs = this.state.functionInputObjs.map(inputObj => Number(inputObj.value));

        const generator = this.props.generatorFunction(...calledFunctionArgs, this.containerComponentRef);

        this.setState({
            generator,
            calledDelayValue,
            calledFunctionArgs
        });
    }

    updateContainer() {
        const Container = this.props.outputContainer;
        const ContainerComponent = <Container 
            ref={thisComponent => this.containerComponentRef = thisComponent} 
            containerClassNames={this.props.containerClassNames} 
        />;

        this.setState({
            ContainerComponent
        });
    }

    startPlaying() {
        let codeStepper = setTimeout(function stepFunc(self) {
            if (!self.state.isPlaying) return;

            self.stepOnce();
            codeStepper = setTimeout(stepFunc, self.state.calledDelayValue, self);

        }, this.state.calledDelayValue, this);
    }

    stepOnce() {
        this.setState(prevState => {
            const { generator } = prevState;
            const iteratorRes = generator.next();

            let newState = {
                iteratorRes
            };

            if (iteratorRes.done) {
                newState.isCompleted = true;
                newState.isPlaying = false;
                newState.generator = null;
                newState.iteratorRes = null;
            }

            return newState;
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
                <RecursionWindow 
                    calledContainerComponent={this.state.calledContainerComponent}
                    calledDelayValue={this.state.calledDelayValue}
                    calledFunctionArgs={this.state.calledFunctionArgs}
                >
                    {this.state.ContainerComponent}
                </RecursionWindow>
            </div>
        );
    }
}

export default RecursionVisualizer;