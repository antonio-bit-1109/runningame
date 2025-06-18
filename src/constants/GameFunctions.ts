import {costanti} from "./costanti";
import {ICircle, IObstacle} from "../interf/Obstacle";
import {IBoss} from "../interf/Boss";
import {IcoordinatesElem} from "../interf/Player";

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

export function playSoundDeath() {
    const deathPlayer = document.getElementById('deathPlayer');
    const audioPLayer = deathPlayer as HTMLAudioElement;
    audioPLayer.src = '/src/assets/sounds/death.mp3';
    audioPLayer.currentTime = 0;
    void audioPLayer.play();
}

export function interrompiAltreMusiche() {
    // @ts-ignore
    const arrElem: HTMLElement[] = document.getElementsByTagName('audio');
    // @ts-ignore
    const arrAudioPlayer = Array.from(arrElem) as HTMLAudioElement[];
    arrAudioPlayer.forEach(player => {
        if (player.id !== 'deathPlayer') {
            player.currentTime = 0;
            void player.pause()
        }
    })
}


export function buildGun() {

    // la posizione del braccio segue sempre la y del personaggio cosi se salta anche il braccio salta con lui
    const playerArm: IcoordinatesElem = {
        height: 8,
        width: 35,
        y: costanti.mainPlayer.y + 30,
        x: costanti.mainPlayer.x + 40
    }

    const gunHandle: IcoordinatesElem = {
        height: 40,
        width: 8,
        y: costanti.mainPlayer.y + 11,
        x: costanti.mainPlayer.x + 65
    }
    const gunBarrel: IcoordinatesElem = {
        height: 8,
        width: 30,
        y: costanti.mainPlayer.y + 11,
        x: costanti.mainPlayer.x + 65
    }

    const bullet: ICircle = {
        x: costanti.mainPlayer.x + 80,
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
    }

}


export function showNExtLevelHtml() {
    const divLivello = document.getElementById('divLivello');
    costanti.gameLevel++
    divLivello.innerHTML = `Livello: ${costanti.gameLevel}`
}

export function update_showOstacoliAbbattuti_InitialVAlue() {
    // const divOstacoliAbbattuti = document.createElement('div');
    // divOstacoliAbbattuti.id = 'divOstacoliAbbattuti';
    // costanti.upperDiv.appendChild(divOstacoliAbbattuti);
    // divOstacoliAbbattuti.innerHTML = `ostacoli distrutti: ${costanti.ostacoliAbbattuti}`
    const divOstacoliAbbattuti = document.getElementById('divOstacoliAbbattuti');
    divOstacoliAbbattuti.innerHTML = `ostacoli distrutti: ${costanti.ostacoliAbbattuti}`
}

export function addPunteggioBonus() {
    costanti.punteggio += 50;
}


// il boss appare solo ogni 5 livelli
export function generateBoss() {

    if (costanti.enemyBoss === null) {
        const bossHeight = 450;

        const boss: IBoss = {
            x: costanti.canvas.width,
            y: 1,
            height: bossHeight,
            width: 250,
            isShooting: false,
            hp: 300
        }
        costanti.enemyBoss = boss
    }

}

export function moveBoss() {
    if (costanti.enemyBoss.x > costanti.canvas.width - 400) {
        costanti.enemyBoss.x -= 1;
    } else {
        // fa random shrink and grow solo se non è attiva l animazione di morte del boss
        !costanti.showBossAnimationDeath && random_Grow_Shrink(costanti.enemyBoss)
    }
}

export function bossMusic() {
    const element = document.getElementById('bossSound');
    const audioPlayer = element as HTMLAudioElement;
    if (audioPlayer.paused) {
        audioPlayer.src = 'src/assets/sounds/bossMusic.mp3';
        audioPlayer.currentTime = 0;
        void audioPlayer.play();
    }
}


export function createBossHpBar() {

    const upperWrapper = document.createElement("div");
    upperWrapper.classList.add("w-100", "d-flex", "justify-content-end", "m-custom");
    const divWrapper = document.createElement("div");
    divWrapper.classList.add("progress")

    const hpBar = document.createElement('div');
    hpBar.id = "hpBossbar"
    hpBar.classList.add('progress-bar', "bg-success");
    hpBar.setAttribute('role', 'progressbar');
    hpBar.setAttribute('aria-valuenow', '100');
    hpBar.setAttribute('aria-valuemin', '0');
    hpBar.setAttribute('aria-valuemax', '100');
    hpBar.style.width = '300px';

    divWrapper.appendChild(hpBar);
    upperWrapper.appendChild(divWrapper)

    costanti.upperDiv.appendChild(upperWrapper);

    costanti.isBossLifeSpawned = true;
}


export function bossEntranceFrase() {

    const img = document.createElement("img");
    img.src = "src/assets/materials/comic.png"
    img.classList.add("m-custom")
    costanti.lowerDiv.classList.add("d-flex", "justify-content-end")
    costanti.lowerDiv.appendChild(img)
    setTimeout(() => {
        img && costanti.lowerDiv.removeChild(img);
    }, 3000)
}


export function moveObstacle() {

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

export function disegnaObstacles(obstacles: IObstacle[]) {
    obstacles.forEach(obs => {
        drawElement(costanti.obstacleColor, {
            x: obs.x,
            y: obs.y,
            width: obs.width,
            height: obs.height
        })
    })
}


// funzione che controlla se è avvenuta una collissione tra player e ostacolo
export function isCollisionsDetected(mainPlayer: IcoordinatesElem, obstacles: IObstacle[]) {

    // se l'elaborazione della collisione sta avvenendo non constento al loop di entrare nella funzione ma deve attendere il completamento dell elaborazione
    if (costanti.elaborateCollision) {
        return;
    }

    return obstacles && obstacles.length > 0 && obstacles.some(obst => {
        if (mainPlayer.x < obst.x + obst.width &&
            mainPlayer.x + mainPlayer.width > obst.x &&
            mainPlayer.y < obst.y + obst.height &&
            mainPlayer.y + mainPlayer.height > obst.y)
            //
        {
            costanti.elaborateCollision = true
            costanti.lastHittedObstacle = obst;
            // return true;
            if (costanti.mainPlayer.hp === 1) {
                costanti.isGameOver = true;
            }

            costanti.mainPlayer.hp -= 1
            playerDamagedSound()
            updateHeartsHtml()

        }

    })

}

// controlla se l'ultimo ostacolo che sta colpendo il main player è uscito dalla width e dalla height del main player,
// in questo modo non sta avvenendo lacollisione e resetto le variabili
// costanti.elaborateCollision e costanti.lastHittedObstacle -- avvenuto un ciclo completo
export function checkIfCollisionIsNoMore() {

    if (costanti.elaborateCollision && costanti.lastHittedObstacle) {

        if (costanti.mainPlayer.x + costanti.mainPlayer.width < costanti.lastHittedObstacle.x || // player a sinistra dell'ostacolo
            costanti.mainPlayer.x > costanti.lastHittedObstacle.x + costanti.lastHittedObstacle.width)
            //
        {
            costanti.elaborateCollision = false
            costanti.lastHittedObstacle = null;
        }

    }
}

// funzione che prende gli elementi html relativi ai cuori e aggiorna la UI in rapporto alle vite rimanenti del main player
export function updateHeartsHtml() {

    console.log(costanti.mainPlayer.hp)
    const HeartNodeList = document.querySelectorAll(".hearth");
    // @ts-ignore
    const heartsArr = Array.from(HeartNodeList) as HTMLImageElement[]
    heartsArr.map((heartElem, i) => {
        if (i === costanti.mainPlayer.hp) {
            heartElem.src = 'src/assets/materials/heartEmpty.png'
        }

    })


}

export function isCollisionDetected_W_Bullet_N_obstacle(bullet: ICircle, obstacles: IObstacle[]) {

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

export function isCollisionDetected_w_bullet_n_boss(bullet: ICircle, boss: IBoss) {
    if (bullet && boss) {
        checkIfCollision(bullet, boss)
    }

}

export function checkIfCollision(bullet: ICircle, boss: IBoss) {

    if (
        (bullet.x + bullet.radius > boss.x) &&
        (bullet.x - bullet.radius < boss.x + boss.width) &&
        (bullet.y + bullet.radius > boss.y) &&
        (bullet.y - bullet.radius < boss.y + boss.height)
    ) {
        giveDamage(boss)
        bossDamagedSound()

        const hpBar = document.getElementById('hpBossbar')
        if (hpBar) {
            let i = hpBar.style.width.indexOf("px")
            let width = hpBar.style.width.substring(0, i)
            hpBar.setAttribute('aria-valuenow', `${boss.hp}`);
            hpBar.style.width = `${parseInt(width) - costanti.bulletDamage}px`
            console.log(costanti.enemyBoss.hp, "BOSS HPPPPP")
        }
        costanti.Bullet = null;

        if (boss.hp === 0) {
            costanti.showBossAnimationDeath = true;
            showBossIsDeathHtml();
        }

    }
}

export function showBossIsDeathHtml() {

    const lowerDiv = document.getElementById("lowerDiv");
    lowerDiv.classList.add("d-flex", "justify-content-center", "fs-1", "text-danger");
    lowerDiv.innerHTML = "Boss sconfitto! Complimenti!"
}

export function showAnimationBossDeath() {


    if (costanti.enemyBoss && costanti.showBossAnimationDeath) {
        costanti.functionEnterTimes++
        costanti.enemyBoss.height -= 4

        if (costanti.functionEnterTimes % 5 === 0) {
            costanti.enemyBoss.x -= 4;
        } else {
            costanti.enemyBoss.x += 4;
        }

    }

    if (costanti.enemyBoss &&
        costanti.enemyBoss.height >= 0 && costanti.enemyBoss.height < 5 &&
        costanti.showBossAnimationDeath)
        //
    {
        costanti.showBossAnimationDeath = false;
        costanti.functionEnterTimes = 0;
        costanti.enemyBoss = null;
        showNExtLevelHtml();
        handleLogicChangeLevel()
        reloadOneHpPlayer();
    }
}

function handleLogicChangeLevel() {
    costanti.levelFinished = true;
    costanti.startObstaclesGeneration = false;
    costanti.obstacles = [];
}

function reloadOneHpPlayer() {
    setTimeout(() => {
        costanti.mainPlayer.hp++
        updateHeartsHtml();
    }, 2000)
}

export function bossDamagedSound() {
    const elem = document.getElementById('bossDamagedSound');
    const player = elem as HTMLAudioElement;
    player.src = 'src/assets/sounds/bossDamaged.mp3'
    player.currentTime = 0;
    void player.play()
}

export function playerDamagedSound() {
    const elem = document.getElementById('playerDamagedSound');
    const player = elem as HTMLAudioElement;
    player.src = 'src/assets/sounds/playerDamaged.mp3'
    player.currentTime = 0;
    void player.play()
}


export function giveDamage(boss: IBoss) {
    console.error("boss colpito!!")
    boss.hp -= costanti.bulletDamage;
}

export function generateObstacle() {

    const groundPosition = costanti.groundLevel + 40;
    const velocity = costanti.obstacleVelocity + Math.random() * 8;


    if (costanti.startObstaclesGeneration) {
        const obstacle: IObstacle = {
            height: 20 + Math.random() * 10,
            width: 15,
            y: groundPosition - Math.random() * 101,
            x: costanti.canvas.width,
            velocity: velocity
        }
        costanti.obstacles.push(obstacle)
    }


    console.log(costanti.obstacles)
}


export function random_Grow_Shrink(boss: IBoss) {

    if (boss.height === 450 && !costanti.isShrinking) {
        costanti.isShrinking = true;
    }

    if (boss.height <= 450 && costanti.isShrinking) {
        boss.height -= 3;
    }

    if (boss.height <= 50 && costanti.isShrinking) {
        costanti.isShrinking = false;
    }

    if (boss.height <= 50 || boss.height >= 50 && !costanti.isShrinking) {
        boss.height += 3;
    }
}

// aumenta la difficolta del livello aumentando la velocità degli ostacoli
export function handleNextLevelGame(punteggio: number) {
    if (punteggio % 100 === 0 && punteggio !== 0 && punteggio !== costanti.lastLevelScore) {
        costanti.obstacles.map(obst => obst.velocity++)
        costanti.lastLevelScore = punteggio
    }
}

export function loadBackgroundToCanvas() {

    const img = new Image();
    img.src = 'src/assets/materials/background2.jpg';
    costanti.backgroundImage = img;

}

export function showBackgroundIfReady() {
    if (costanti.backgroundImage?.complete) {
        costanti.canvasContext.drawImage(costanti.backgroundImage, 0, 0, costanti.canvas.width, costanti.canvas.height);
    }
}

