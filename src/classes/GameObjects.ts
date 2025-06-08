import {costanti} from '../constants/costanti'
import {IcoordinatesElem, IPLayerConfig} from "../interf/Player";
import {IObstacle} from "../interf/Obstacle";

export class GameObjects {

    public mainPlayer: IPLayerConfig = null;
    public obstacles:IObstacle[] = [];
    public obstacleVelocity = 8;
    public canvas: HTMLCanvasElement | undefined;
    public canvasContext = null;

    //costruttore della classe che ha come dipendenza canvas:HTMLCanvasElement
    constructor(canvasDepend: HTMLCanvasElement ) {
        this.canvas = canvasDepend;
        this.canvasContext = this.canvas.getContext("2d");
    }

    public gameObjectPipeLine(){
        this.inizializeMainPlayer();
        this.generateObstacle();
    }

    public inizializeMainPlayer() {
        this.mainPlayer = {
            x: 100,
            y: costanti.groundLevel,
            width: 50,
            height: 80,
            velocityY: 0,
            isJumping: false,
            isCrouching: false,
            isStandUp: true
        };
    }

    public generateObstacle() {

        const groundPosition = costanti.groundLevel + 40;
        const velocity = this.obstacleVelocity + Math.random() * 8;


        const obstacle: IObstacle = {
            height: 20 + Math.random() * 10,
            width: 15,
            y: groundPosition - this.numeroInteroTraIntervalli(50 , 10),
            x: this.canvas.width,
            velocity: velocity
        }
        this.obstacles.push(obstacle)
    }

    public numeroInteroTraIntervalli(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    // // metodo utilizzato per creare un elemento dentro la canvas
    public drawElement(color: string, coord: IcoordinatesElem) {
        this.canvasContext.fillStyle = color
        this.canvasContext.fillRect(coord.x, coord.y, coord.width, coord.height)
    }

}