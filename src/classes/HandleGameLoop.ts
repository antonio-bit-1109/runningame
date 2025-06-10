import {ICircle, IObstacle} from "../interf/Obstacle";
import {IcoordinatesElem, IPLayerConfig} from "../interf/Player";
import {
    addPunteggioBonus,
    buildGun,
    costanti,
    drawElement,
    interrompiPunteggio,
    moveBullet,
    update_showOstacoliAbbattuti_InitialVAlue
} from "../constants/costanti";

export class HandleGameLoop {


    public startGameLoop() {

        const loop = () => {


            costanti.obstacleTimer++


            if (costanti.isGameOver) {
                console.log("GAME OVER IS TRUE!!!!")
                interrompiPunteggio();
                return;
            }

            if (costanti.obstacleTimer >= costanti.obstacleInterval) {
                this.generateObstacle()
                costanti.obstacleTimer = 0
            }

            // Pulisce tutto il canvas
            costanti.canvasContext.clearRect(0, 0, costanti.canvas.width, costanti.canvas.height);

            // Applica la gravità se il player sta saltando
            if (costanti.mainPlayer.isJumping) {


                costanti.mainPlayer.velocityY += costanti.gravity;
                costanti.mainPlayer.y += costanti.mainPlayer.velocityY;

                // Quando il giocatore tocca terra, resetta il salto
                if (costanti.mainPlayer.y >= costanti.groundLevel) {
                    costanti.mainPlayer.y = costanti.groundLevel;
                    costanti.mainPlayer.velocityY = 0;
                    costanti.mainPlayer.isJumping = false;
                }
            }

            // modifica la struttura del player se questo è in modalità abbassato
            if (costanti.mainPlayer.isCrouching && !costanti.mainPlayer.isStandUp) {
                costanti.mainPlayer.height = 40
                costanti.mainPlayer.y = costanti.groundLevel + 40
                costanti.mainPlayer.width = 100
                costanti.mainPlayer.isCrouching = false;
                costanti.mainPlayer.isStandUp = true;
            }

            // se isshooting è true mostro la pistola per sparare
            if (costanti.mainPlayer.isShooting) {
                costanti.timerShowGun++
                console.log(costanti.timerShowGun)

                if (costanti.timerShowGun >= 50) {
                    costanti.mainPlayer.isShooting = false;
                    costanti.timerShowGun = 0;

                } else {
                    buildGun();

                }


            }
            moveBullet()

            // ridisegna il giocatore
            drawElement(costanti.mainPlayerColor, {
                height: costanti.mainPlayer.height,
                width: costanti.mainPlayer.width,
                y: costanti.mainPlayer.y,
                x: costanti.mainPlayer.x
            })


            this.moveObstacle()
            this.disegnaObstacles(costanti.obstacles)

            if (this.isCollisionsDetected(costanti.mainPlayer, costanti.obstacles)) {
                costanti.isGameOver = true;
            }

            if (this.isCollisionDetected_W_Bullet_N_obstacle(costanti.Bullet, costanti.obstacles)) {
                costanti.obstacles = costanti.obstacles.filter(obstacle => obstacle !== costanti.ObstacleShotted);
                costanti.Bullet = null;
                costanti.ObstacleShotted = null;
                costanti.ostacoliAbbattuti++
                update_showOstacoliAbbattuti_InitialVAlue()
                addPunteggioBonus();
            }

            requestAnimationFrame(loop);
        }

        loop()
    }


    public moveObstacle() {

        if (costanti.obstacles.length > 0) {
            costanti.obstacles = costanti.obstacles.filter(obst => {

                obst.x -= obst.velocity;

                // mantenimento dell ostacolo solo finche non esce dall asse x della canvas
                if (obst.x > 0) {
                    return obst;
                }
            })
        }

    }

    public disegnaObstacles(obstacles: IObstacle[]) {
        obstacles.forEach(obs => {
            drawElement(costanti.obstacleColor, {
                x: obs.x,
                y: obs.y,
                width: obs.width,
                height: obs.height
            })
        })
    }


    public isCollisionsDetected(mainPlayer: IcoordinatesElem, obstacles: IObstacle[]) {
        console.log(obstacles);
        return obstacles && obstacles.length > 0 && obstacles.some(obst => {
            if (mainPlayer.x < obst.x + obst.width &&
                mainPlayer.x + mainPlayer.width > obst.x &&
                mainPlayer.y < obst.y + obst.height &&
                mainPlayer.y + mainPlayer.height > obst.y)
                //
            {
                return true;
            }
            return false;
        })

    }

    public isCollisionDetected_W_Bullet_N_obstacle(bullet: ICircle, obstacles: IObstacle[]) {

        return bullet && obstacles && obstacles.length > 0 && obstacles.some(obst => {
            if (bullet.x < obst.x + obst.width &&
                bullet.x + bullet.radius > obst.x &&
                bullet.y < obst.y + obst.height &&
                bullet.y + bullet.radius > obst.y)
                //
            {
                costanti.ObstacleShotted = obst;
                return true;
            }
            return false;
        })
    }

    public generateObstacle() {

        const groundPosition = costanti.groundLevel + 40;
        const velocity = costanti.obstacleVelocity + Math.random() * 8;


        const obstacle: IObstacle = {
            height: 20 + Math.random() * 10,
            width: 15,
            y: groundPosition - this.numeroInteroTraIntervalli(10, 65),
            x: costanti.canvas.width,
            velocity: velocity
        }
        costanti.obstacles.push(obstacle)
    }

    public numeroInteroTraIntervalli(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


}