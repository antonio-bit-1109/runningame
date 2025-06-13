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
            hp: 100
        }
        costanti.enemyBoss = boss
    }

}

export function moveBoss() {
    if (costanti.enemyBoss.x > costanti.canvas.width - 400) {
        costanti.enemyBoss.x -= 1;
    } else {
        random_Grow_Shrink(costanti.enemyBoss)
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
        costanti.lowerDiv.removeChild(img);
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


export function isCollisionsDetected(mainPlayer: IcoordinatesElem, obstacles: IObstacle[]) {

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
        const hpBar = document.getElementById('hpBossbar')
        if (hpBar) {
            let i = hpBar.style.width.indexOf("px")
            let width = hpBar.style.width.substring(0, i)
            console.log(width)
            hpBar.setAttribute('aria-valuenow', `${boss.hp}`);
            hpBar.style.width = `${parseInt(width) - costanti.bulletDamage}px`
        }
        costanti.Bullet = null;

    }
}


export function giveDamage(boss: IBoss) {
    console.error("boss colpito!!")
    boss.hp -= 10;
}

export function generateObstacle() {

    const groundPosition = costanti.groundLevel + 40;
    const velocity = costanti.obstacleVelocity + Math.random() * 8;


    const obstacle: IObstacle = {
        height: 20 + Math.random() * 10,
        width: 15,
        y: groundPosition - Math.random() * 101,
        x: costanti.canvas.width,
        velocity: velocity
    }
    costanti.obstacles.push(obstacle)
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
        showNExtLevelHtml();
        costanti.lastLevelScore = punteggio
    }
}