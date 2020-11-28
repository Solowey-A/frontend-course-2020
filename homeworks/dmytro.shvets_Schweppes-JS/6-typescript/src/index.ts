// main game element
const scoreElement = document.querySelector('[data-score]') as HTMLHeadingElement;
const cubeScoreElement = document.querySelector('[data-cube-score]') as HTMLHeadingElement;
const cubeElement = document.querySelector('[data-cube]') as HTMLDivElement;
const keyElement = document.querySelector('[data-key]') as HTMLDivElement;
const notification = document.querySelector('[data-notification]') as HTMLParagraphElement;
// progres barr element
const progressTop = document.querySelector('[data-progress-top]') as HTMLDivElement;
const progressRight = document.querySelector('[data-progress-right]') as HTMLDivElement;
const progressLeft = document.querySelector('[data-progress-left]') as HTMLDivElement;
const progressBottom = document.querySelector('[data-progress-bottom]') as HTMLDivElement;
// button element
const startBtn = document.querySelector('[data-start]') as HTMLButtonElement;
const stopBtn = document.querySelector('[data-stop]') as HTMLButtonElement;
const newGameBtn = document.querySelector('[data-new]') as HTMLButtonElement;

class Game {
    // main game variables
    private interval: number = 2000;
    private animationInterval: number = 480;
    private characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    private charactersLength: number = this.characters.length;
    // timers for animation
    private textTimer: any;
    private animationTimer: any;
    private timerRight: any;
    private timerTop: any;
    private timerleft: any;
    
    private disableAnimation: any;
    private randomCharacters: string = '';
    private isKeyPress: boolean = false;


    constructor (
        private scoreElement: HTMLHeadingElement,
        private cubeScoreElement: HTMLHeadingElement,
        private cubeElement: HTMLDivElement,
        private keyElement: HTMLDivElement,
        private progressBottom: HTMLDivElement,
        private progressLeft: HTMLDivElement,
        private progressTop: HTMLDivElement,
        private progressRight: HTMLDivElement,
    ) {}

    start() {
        this.textAnimate();
        this.cyclProgressAnimation();
        document.addEventListener('keydown', this.submitting.bind(this));
        notification.textContent = '';
    }

    stopGame() {
        keyElement.textContent = '';
        notification.textContent = '';
        this.stopAnimation();
        this.stoppingTimers();
        document.removeEventListener('keydown', this.submitting.bind(this));
    }

    restart() {
        scoreElement.textContent = '100';
        cubeScoreElement.textContent = '0';
        cubeElement.style.width = `100px`;
        cubeElement.style.height = `100px`;
        this.stopGame();
    }

    // start text animation
    textAnimate() {
        this.textTimer = setTimeout(() => {
            notification.textContent = '1';
        }, 500);
        this.textTimer = setTimeout(() => {
            notification.textContent = '2';
        }, 1000);
        this.textTimer = setTimeout(() => {
            notification.textContent = '3';
        }, 1500);
        this.textTimer = setTimeout(() => {
            notification.textContent = 'Start typing!';
        }, 2000);
        this.textTimer = setTimeout(() => {
            notification.textContent = '';
        }, 3000);
    }

    // perform animation every 2 seconds
    private cyclProgressAnimation() {
        this.animationTimer = setInterval(() => {
            this.startAnimation();
        }, this.interval);
    }

    // getting random character
    private generateLetter() {
        const index: number = Math.floor((Math.random() * this.charactersLength) + 1);
        this.randomCharacters = this.characters[index - 1];
        keyElement.textContent = this.randomCharacters;
    }

    // checking current score
    private checkingScore(currentScore: number) {
        if (currentScore > 200) {
            this.stopGame();
            scoreElement.textContent = 'You Win!'
        } else if (currentScore < 0) {
            this.stopGame();
            scoreElement.textContent = 'You Lose!'
        }
    }

    // setting random point and change cube size
    private ganeratePoint(isCorrectKey: boolean) {
        // if pressed successfully
        if (isCorrectKey) {
            // generate random number
            const min: number = 5;
            const max: number = 10;
            const point: number = Math.floor((Math.random() * (max - min + 1)) + min);
            // inserting this amount in DOM
            cubeScoreElement.textContent = `+${point}`;
            const totalScore: number = parseInt(scoreElement.textContent!);
            scoreElement.textContent = `${totalScore + point}`;
            // changing cube size 
            const cubeSize: number = parseInt(getComputedStyle(cubeElement,).width);
            cubeElement.style.width = `${cubeSize + point}px`;
            cubeElement.style.height = `${cubeSize + point}px`;
        // if fail to press
        } else {
            // generate random number between min and max
            let min: number;
            let max: number;
            if (this.isKeyPress) {
                min = 20;
                max = 25;
            } else {
                min = 10;
                max = 15;
            }
            const point: number = Math.floor((Math.random() * (max - min + 1)) + min);
            // inserting this amount in DOM
            cubeScoreElement.textContent = `-${point}`;
            const totalScore: number = parseInt(scoreElement.textContent!);
            scoreElement.textContent = `${totalScore - point}`;
            // changing cube size 
            const cubeSize: number = parseInt(getComputedStyle(cubeElement,).width);
            const pointSum: number = cubeSize - point;
            cubeElement.style.width = `${pointSum}px`;
            cubeElement.style.height = `${pointSum}px`;
            this.checkingScore(pointSum);
            this.isKeyPress = false;
        }
    }

    // stopping animation with little deley to apply styles correctly
    private stopAnimation() {
        // set transition 0 second to disable smoothness
        progressBottom.style.transition = 'none';
        progressLeft.style.transition = 'none';
        progressTop.style.transition = 'none';
        progressRight.style.transition = 'none';
        // return the progress line to the default position
        progressBottom.style.width = '0';
        progressLeft.style.height = '0';
        progressTop.style.width = '0';
        progressRight.style.height = '0';
        // turn on smoothness
        setTimeout(() => {
            progressBottom.style.transition = '.48s all linear';
            progressLeft.style.transition = '.48s all linear';
            progressTop.style.transition = '.48s all linear';
            progressRight.style.transition = '.48s all linear';
        }, 40);
    }

    // srting animation every two second
    private startAnimation() {
        keyElement.classList.replace('hidden', 'animated');
        keyElement.classList.replace('hidden-animated', 'animated');
        // ganerate characters every two second
        this.generateLetter();
        // start progress bar animations with deley for each / bottom line
        new Promise((resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
                progressBottom.style.width = '100%';
            resolve();
        })
        // left line
        .then(() => {
            return new Promise((resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
                this.timerleft = setTimeout(() => {
                    progressLeft.style.height = '100%';
                    resolve();
                }, this.animationInterval);
            });
        })
        // top line
        .then(() => {
            return new Promise((resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
                this.timerTop = setTimeout(() => {
                    progressTop.style.width = '100%';
                    resolve();
                }, this.animationInterval);
            });
        })
        // right line
        .then(() => {
            return new Promise((resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
                this.timerRight = setTimeout(() => {
                    keyElement.classList.replace('animated-onPress', 'hidden-animated');
                    keyElement.classList.replace('animated', 'hidden-animated');
                    progressRight.style.height = '100%';
                    resolve();
                }, this.animationInterval);
            });
        })
        // disable animation
        .then(() => {
            return new Promise((resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
                this.disableAnimation = setTimeout(() => {
                    this.stopAnimation();
                    this.ganeratePoint(false);
                    resolve();
                }, this.animationInterval);
            });
        })
    }

    // cleat all timer to start new cicl animation or stop the game
    private stoppingTimers() {
        clearInterval(this.disableAnimation);
        clearInterval(this.animationTimer);
        clearInterval(this.timerRight);
        clearInterval(this.timerTop);
        clearInterval(this.timerleft);
    }

    // restart cycle of animation whe key pressed
    private restartCycle() {
        keyElement.textContent = '';
        // setting the same animation but with different animation name to correctly work
        if (keyElement.classList.contains('animated-onPress')) {
            keyElement.classList.replace('animated-onPress', 'animated');
        } else {
            keyElement.classList.replace('animated', 'animated-onPress');
        }
        this.stopAnimation();
        // needed a little delay for all styles to be set in order and work correctly
        setTimeout(() => {
            this.stoppingTimers();
            this.startAnimation();
            this.cyclProgressAnimation();
        }, 50);
    }

    // identify the key that was pressed
    private submitting(e: any) {
        const pressedKey: string = e.key;
        const showedCharacters: string = this.randomCharacters.toLocaleLowerCase();
        if (pressedKey === showedCharacters) {
            this.restartCycle();
            this.ganeratePoint(true);
        }
        else {
            this.isKeyPress = true;
            this.restartCycle();
            this.ganeratePoint(false);
        }
    }
}

const game = new Game(
    scoreElement,
    cubeScoreElement,
    cubeElement,
    keyElement,
    progressBottom,
    progressLeft,
    progressTop,
    progressRight
);

function start() {
    game.start();
    startBtn.disabled = true;
    setTimeout(() => stopBtn.disabled = false, 2000);
}

function stop() {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    game.stopGame();
}

function restart() {
    stopBtn.disabled = true;
    startBtn.disabled = false;
    game.restart();
}

startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
newGameBtn.addEventListener('click', restart);
