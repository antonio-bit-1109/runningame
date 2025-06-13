export interface IBoss {
    x: number,
    y: number,
    width: number,
    height: number,
    isShooting: boolean,
    hp: number
}

export interface IBombs {
    x: number,
    y: number,
    width: number,
    height: number,
    isExplode: boolean
}