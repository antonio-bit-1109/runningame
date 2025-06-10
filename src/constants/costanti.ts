import {IcoordinatesElem, IPLayerConfig} from "../interf/Player";
import {ICircle, IObstacle} from "../interf/Obstacle";

export const costanti: ICostanti = {
    groundLevel: 320,
    gravity: 0.6,
    jumpForce: -12,
    mainPlayerColor: 'blue',
    obstacleColor: 'red',
    gunColor: 'green',
    bulletColor: 'black',
    isGameOver: false,
    intervalPunteggio: null,
    punteggio: 0,
    obstacleTimer: 0,
    obstacleInterval: 100,
    mainPlayer: null,
    obstacles: [],
    Bullet: null,
    obstacleVelocity: 8,
    canvas: null,
    canvasContext: null,
    upperDiv: null,
    gameFrame: null,
    lowerDiv: null,
    timerShowGun: 0,
    ObstacleShotted: null
}


interface ICostanti {
    groundLevel: number,
    gravity: number,
    jumpForce: number,
    mainPlayerColor: string,
    obstacleColor: string,
    bulletColor: string,
    gunColor: string,
    isGameOver: boolean,
    intervalPunteggio: null | number,
    punteggio: number,
    obstacleTimer: number,
    obstacleInterval: number,
    mainPlayer: null | IPLayerConfig,
    obstacles: IObstacle[],
    Bullet: ICircle | null,
    obstacleVelocity: number,
    canvas: HTMLCanvasElement | null,
    canvasContext: any | null,
    upperDiv: HTMLElement | null,
    gameFrame: HTMLElement | null,
    lowerDiv: HTMLElement | null,
    timerShowGun: number,
    ObstacleShotted: null | IObstacle
}


export function drawElement(color: string, coord: IcoordinatesElem) {
    costanti.canvasContext.fillStyle = color
    costanti.canvasContext.fillRect(coord.x, coord.y, coord.width, coord.height)
}

export function drawCircle(color: string, circleParam: ICircle) {
    costanti.canvasContext.beginPath();
    costanti.canvasContext.arc(
        circleParam.x,
        circleParam.y,
        circleParam.radius,
        circleParam.startAngle,
        circleParam.endAngle,
        circleParam.counterclockwise
    );
    costanti.canvasContext.fillStyle = color;
    costanti.canvasContext.fill();
}

export function interrompiPunteggio() {
    clearInterval(costanti.intervalPunteggio)
}

export function buildGun() {

    // la posizione del braccio segue sempre la y del personaggio cosi se salta anche il braccio salta con lui
    const playerArm: IcoordinatesElem = {
        height: 8,
        width: 35,
        y: costanti.mainPlayer.y + 30,
        x: 140
    }

    const gunHandle: IcoordinatesElem = {
        height: 40,
        width: 8,
        y: costanti.mainPlayer.y + 11,
        x: 165
    }
    const gunBarrel: IcoordinatesElem = {
        height: 8,
        width: 30,
        y: costanti.mainPlayer.y + 11,
        x: 165
    }

    const bullet: ICircle = {
        x: 180,
        y: costanti.mainPlayer.y + 15,
        radius: 6,
        startAngle: 0,
        endAngle: Math.PI * 2,
        counterclockwise: false,
        velocity: 7
    }

    // disegno braccio player
    drawElement(costanti.mainPlayerColor, playerArm);

    //disegno pistola
    drawElement(costanti.gunColor, gunHandle)
    drawElement(costanti.gunColor, gunBarrel)
    // drawCircle(costanti.bulletColor, bullet)
    costanti.Bullet = bullet;
}


export function moveBullet() {
    if (costanti.Bullet != null) {
        let bullet = costanti.Bullet;

        if (bullet.x > costanti.canvas.width) {
            costanti.Bullet = null;
        }

        bullet.x += bullet.velocity
        drawCircle(costanti.bulletColor, bullet)
    } else {
        console.log("il bullet è null.")
    }

}