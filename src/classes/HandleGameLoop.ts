import {

    addPunteggioBonus,
    bossEntranceFrase,
    bossMusic,
    buildGun, checkIfCollisionIsNoMore,
    createBossHpBar,
    disegnaObstacles,
    drawElement,
    generateBoss,
    generateObstacle, handleBossDefeated,
    handleNextLevelGame,
    interrompiAltreMusiche,
    interrompiPunteggio,
    isCollisionDetected_w_bullet_n_boss,
    isCollisionDetected_W_Bullet_N_obstacle,
    isCollisionsDetected, loadBackgroundToCanvas,
    moveBoss,
    moveBullet, moveObstacle,
    playSoundDeath, showBackgroundIfReady,
    update_showOstacoliAbbattuti_InitialVAlue
} from "../constants/GameFunctions";
import {costanti} from "../constants/costanti";

export class HandleGameLoop {


    public startGameLoop() {


        // caricamento iniziale dell immagine come valore costante
        loadBackgroundToCanvas()

        const loop = () => {


            costanti.obstacleTimer++

            // funzione per capire se si è passati al livello successivo
            handleNextLevelGame(costanti.punteggio)

            // gestione della generazione dle boss
            if (costanti.punteggio === 200) {
                generateBoss()
            }


            if (costanti.isGameOver) {
                console.log("GAME OVER IS TRUE!!!!")
                interrompiPunteggio();
                playSoundDeath();
                interrompiAltreMusiche()
                return;
            }

            if (costanti.obstacleTimer >= costanti.obstacleInterval) {
                generateObstacle()
                costanti.obstacleTimer = 0
            }

            // Pulisce tutto il canvas
            costanti.canvasContext.clearRect(0, 0, costanti.canvas.width, costanti.canvas.height);

            // se lìimmagine di sfondo è stata caricata la inserisco nel loop
            showBackgroundIfReady()

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

            // controlla se il player si sta muovendo verso destra
            if (costanti.mainPlayer.movingRight) {
                costanti.mainPlayer.x += 5
                costanti.mainPlayer.movingRight = false
            }

            // controlla se il player si sta muovendo verso sinistra
            if (costanti.mainPlayer.movingLeft) {
                costanti.mainPlayer.x -= 5
                costanti.mainPlayer.movingLeft = false
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


            // ridisegna il giocatore
            drawElement(costanti.mainPlayerColor, {
                height: costanti.mainPlayer.height,
                width: costanti.mainPlayer.width,
                y: costanti.mainPlayer.y,
                x: costanti.mainPlayer.x
            })


            if (costanti.enemyBoss) {
                bossMusic()
                moveBoss()
                drawElement(costanti.bossColor, {
                    x: costanti.enemyBoss.x,
                    y: costanti.enemyBoss.y,
                    width: costanti.enemyBoss.width,
                    height: costanti.enemyBoss.height
                })
                isCollisionDetected_w_bullet_n_boss(costanti.Bullet, costanti.enemyBoss)

            }

            if (costanti.enemyBoss && !costanti.isBossLifeSpawned) {
                createBossHpBar();
                bossEntranceFrase()
            }


            moveObstacle()
            disegnaObstacles(costanti.obstacles)

            isCollisionsDetected(costanti.mainPlayer, costanti.obstacles)


            if (isCollisionDetected_W_Bullet_N_obstacle(costanti.Bullet, costanti.obstacles)) {
                costanti.obstacles = costanti.obstacles.filter(obstacle => obstacle !== costanti.ObstacleShotted);
                costanti.Bullet = null;
                costanti.ObstacleShotted = null;
                costanti.ostacoliAbbattuti++
                update_showOstacoliAbbattuti_InitialVAlue()
                addPunteggioBonus();
            }

            moveBullet()
            checkIfCollisionIsNoMore();

            handleBossDefeated();

            requestAnimationFrame(loop);
        }

        loop()
    }


}