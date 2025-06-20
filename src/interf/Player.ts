export interface IPLayerConfig {
    x: number,
    y: number,
    width: number,
    height: number,
    velocityY: number,
    isJumping: boolean,
    isCrouching: boolean,
    isStandUp: boolean,
    isShooting: boolean,
    movingRight: boolean,
    movingLeft: boolean,
    hp: number
}

export interface IcoordinatesElem {
    x: number,
    y: number,
    width: number,
    height: number,

    [key: string]: any
}