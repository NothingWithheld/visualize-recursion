'use strict';

class CodePlayer {
    constructor(generatorFunction, simulationControllerDOMRef, ...codePlayerClassNames) {
        this.codePlayer = this.createCodePlayer(codePlayerClassNames);
        this.generatorFunction = generatorFunction;

        this.generator;
        this.generatorYield;

        this.simulationControllerDOMRef = simulationControllerDOMRef;
        this.simluationStartButton = simulationControllerDOMRef.querySelector('.simulation-controller__start-button');
        this.simluationFunctionParameterInput = simulationController.querySelector('.simulation-controller__function-parameter');
        this.simulationPlayPause = simulationController.querySelector('.simulation-controller__play-button');
        this.simulationDelayInput = simulationController.querySelector('.simulation-controller__delay');
        this.simulationStepper = simulationController.querySelector('.simulation-controller__step-next');

        this.delay;
        this.paused = false;

        this.playFunction = this.playFunction.bind(this);
        this.step = this.step.bind(this);
        this.getSimulationDelay = this.getSimulationDelay.bind(this);
        this.getFunctionParameter = this.getFunctionParameter.bind(this);
        this.togglePlayPause = this.togglePlayPause.bind(this);
        this.startFunction = this.startFunction.bind(this);
    }

    createCodePlayer(classNames) {
        const codePlayer = document.createElement('div');
        codePlayer.classList.add('code-player', ...classNames);

        return codePlayer;
    }

    placeCodePlayerAtLocation(DOMLocation) {
        DOMLocation.appendChild(this.codePlayer);
    }

    startFunction() {
        const functionParameter = this.getFunctionParameter();
        const delay = this.getSimulationDelay();
        this.delay = delay;

        this.generator = this.generatorFunction(functionParameter, this.codePlayer);
        this.playFunction();
    }

    playFunction() {
        if (this.paused) {
            return;
        } else {
            let codeStepper = setTimeout(function step(self) {
                if (self.paused) {
                    return;
                }
                self.step();
                if (self.generatorYield && self.generatorYield.done) {
                    return;
                } else {
                    codeStepper = setTimeout(step, self.delay, self);
                }
            }, this.delay, this);
        }
    }

    step() {
        if (this.generatorYield && this.generatorYield.done) {
            return;
        } else {
            this.generatorYield = this.generator.next();
        }
    }

    getFunctionParameter() {
        return Number(this.simluationFunctionParameterInput.value);
    }

    getSimulationDelay() {
        return Number(this.simulationDelayInput.value) * 1000;
    }

    togglePlayPause() {
        this.paused = !this.paused;
    }
}