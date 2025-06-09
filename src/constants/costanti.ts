import {IcoordinatesElem, IPLayerConfig} from "../interf/Player";
import {IObstacle} from "../interf/Obstacle";

export const costanti: ICostanti = {
    groundLevel: 320,
    gravity: 0.6,
    jumpForce: -12,
    mainPlayerColor: 'blue',
    obstacleColor: 'red',
    isGameOver: false,
    intervalPunteggio: null,
    punteggio: 0,
    obstacleTimer: 0,
    obstacleInterval: 100,
    mainPlayer: null,
    obstacles: [],
    obstacleVelocity: 8,
    canvas: null,
    canvasContext: null,
    upperDiv: null,
    gameFrame: null,
    lowerDiv: null,
}


interface ICostanti {
    groundLevel: number,
    gravity: number,
    jumpForce: number,
    mainPlayerColor: string,
    obstacleColor: string,
    isGameOver: boolean,
    intervalPunteggio: null | number,
    punteggio: number,
    obstacleTimer: number,
    obstacleInterval: number,
    mainPlayer: null | IPLayerConfig,
    obstacles: IObstacle[],
    obstacleVelocity: number,
    canvas: HTMLCanvasElement | null,
    canvasContext: any | null,
    upperDiv: HTMLElement | null,
    gameFrame: HTMLElement | null,
    lowerDiv: HTMLElement | null,
}


export function drawElement(color: string, coord: IcoordinatesElem) {
    costanti.canvasContext.fillStyle = color
    costanti.canvasContext.fillRect(coord.x, coord.y, coord.width, coord.height)
}

export function interrompiPunteggio() {
    clearInterval(costanti.intervalPunteggio)
}