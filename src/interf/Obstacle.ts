export interface IObstacle {
    x: number,
    y: number,
    width: number,
    height: number,
    velocity: number
}

export interface ICircle {
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean,
    velocity: number
}



