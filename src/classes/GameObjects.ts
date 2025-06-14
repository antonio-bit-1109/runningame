import {costanti} from '../constants/costanti'
import {createServer} from "vite";


export class GameObjects {


    //costruttore della classe che ha come dipendenza canvas:HTMLCanvasElement
    constructor(canvasDepend: HTMLCanvasElement) {
        costanti.canvas = canvasDepend;
        costanti.canvasContext = costanti.canvas.getContext("2d");
    }

    public gameObjectPipeLine() {
        this.inizializeMainPlayer();
        this.handleEventListenersPlayer();
    }

    public inizializeMainPlayer() {
        costanti.mainPlayer = {
            x: 100,
            y: costanti.groundLevel,
            width: 50,
            height: 80,
            velocityY: 0,
            isJumping: false,
            isCrouching: false,
            isStandUp: true,
            isShooting: false,
            movingLeft: false,
            movingRight: false,
            hp: 3
        };
    }


    public handleEventListenersPlayer() {
        document.addEventListener("keydown", (e) => {
            console.log(e.code)

            if (e.code === 'Space' &&
                !costanti.mainPlayer.isJumping &&
                !costanti.mainPlayer.isCrouching &&
                !costanti.isGameOver) {
                this.jump();
            }

            if (e.code === 'ArrowDown' && !costanti.isGameOver && !costanti.mainPlayer.isJumping) {
                this.crouch()
            }

            if (e.code === 'ArrowUp' && !costanti.isGameOver && !costanti.mainPlayer.isJumping) {
                this.standUp()
            }

            if (e.code === 'KeyW' &&
                !costanti.mainPlayer.isShooting &&
                costanti.Bullet === null
            ) {
                this.shot();
            }

            if (e.code === 'ArrowRight') {
                this.moveRight()
            }

            if (e.code === 'ArrowLeft') {
                this.moveLeft()
            }

        })
    }

    public moveRight() {
        costanti.mainPlayer.movingRight = true;
        costanti.mainPlayer.movingLeft = false;
    }


    public moveLeft() {
        costanti.mainPlayer.movingRight = false;
        costanti.mainPlayer.movingLeft = true;
    }

    public jump() {
        if (costanti.mainPlayer.isCrouching) {
            return;
        }

        costanti.mainPlayer.isJumping = true;
        costanti.mainPlayer.velocityY = costanti.jumpForce
        const audio: HTMLElement = document.getElementById('jumpPlayer');
        const audioPlayer = audio as HTMLAudioElement;
        audioPlayer.src = '/src/assets/sounds/jumpSound.mp3';
        audioPlayer.currentTime = 0;
        void audioPlayer.play();
    }

    public standUp() {
        costanti.mainPlayer.isCrouching = false;
        costanti.mainPlayer.isStandUp = true;
        // risetto il player ai valori iniziali

        costanti.mainPlayer.height = 80
        costanti.mainPlayer.y = costanti.groundLevel
        costanti.mainPlayer.width = 50
    }


    public crouch() {
        if (costanti.mainPlayer.isJumping && costanti.mainPlayer.isCrouching) {
            return;
        }

        costanti.mainPlayer.isCrouching = true;
        costanti.mainPlayer.isStandUp = false;
    }

    public shot() {
        costanti.mainPlayer.isShooting = true;
        const audio: HTMLElement = document.getElementById('shotPlayer');
        const audioPlayer = audio as HTMLAudioElement;
        audioPlayer.src = '/src/assets/sounds/shotSound.mp3';
        audioPlayer.currentTime = 0;
        setTimeout(() => {
            void audioPlayer.play();
        }, 800)
    }


}