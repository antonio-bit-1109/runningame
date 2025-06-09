import {buildGun, costanti} from '../constants/costanti'
import {IcoordinatesElem, IPLayerConfig} from "../interf/Player";
import {IObstacle} from "../interf/Obstacle";

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
            isShooting: false
        };
    }


    public handleEventListenersPlayer() {
        document.addEventListener("keydown", (e) => {
            console.log(e.code)

            if (e.code === 'Space' &&
                !costanti.mainPlayer.isJumping &&
                !costanti.isGameOver) {
                this.jump();
            }

            if (e.code === 'ArrowDown' && !costanti.isGameOver) {
                this.crouch()
            }

            if (e.code === 'ArrowUp' && !costanti.isGameOver) {
                this.standUp()
            }

            if (e.code === 'KeyW' && !costanti.mainPlayer.isShooting) {
                this.shot();
            }

        })
    }

    public jump() {
        if (costanti.mainPlayer.isCrouching) {
            return;
        }

        costanti.mainPlayer.isJumping = true;
        costanti.mainPlayer.velocityY = costanti.jumpForce
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
    }


}