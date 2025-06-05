import {IcoordinatesElem, IPLayerConfig} from "../interf/Player";
import {IObstacle} from "../interf/Obstacle";

export class buildTerrain {

    private upperDiv: HTMLElement = null;
    private gameFrame: HTMLElement = null;
    private lowerDiv: HTMLElement = null;
    private canvas: HTMLCanvasElement = null;
    private canvasContext = null;

    private gravity = 0.6;
    private jumpForce = -12;
    private groundLevel = 300;
    private obstacles = [];
    // private obstacleTimer = 0;
    // private obstacleInterval = 100;
    private isGameOver = false;

    private mainPlayer: IPLayerConfig = null;

    private mainPlayerColor = 'blue';
    private obstacleColor = 'red';
    private timer = 0;
    private punteggio = 0;
    private firstInteraction = true;


    public mainPipeline() {
        this.upperDiv = document.getElementById("upperDiv");
        this.gameFrame = document.getElementById("gameFrame");
        this.lowerDiv = document.getElementById("lowerDiv");
        this.giveWidth([this.upperDiv, this.lowerDiv, this.gameFrame])
        this.giveHeight([this.upperDiv, this.lowerDiv, this.gameFrame])
        this.addCanvasToHtml()
        this.canvasSetup()
        this.inizializeMainPlayer()
        // inizializzazione giocatore
        this.drawElement(this.mainPlayerColor, {
            height: this.mainPlayer.height,
            width: this.mainPlayer.width,
            y: this.mainPlayer.y,
            x: this.mainPlayer.x
        })
        this.handlePlayerActions()
        this.startGameLoop()
        this.showPunteggio()
        this.incrementPunteggio()
    }

    public incrementPunteggio() {
        setInterval(() => {
            this.punteggio += 10;
            document.getElementById('divPunti').innerHTML = ` punteggio: ${this.punteggio}`;
        }, 1000)
    }

    public showPunteggio() {
        const divPunti = document.createElement('div');
        divPunti.id = 'divPunti'
        this.upperDiv.appendChild(divPunti);
        divPunti.innerHTML = ` punteggio: ${this.punteggio}`;

    }

    public giveWidth(elements: HTMLElement[]) {
        elements.forEach(elem => elem.classList.add('w-100'))
    }

    public giveHeight(elements: HTMLElement[]) {
        elements.map(elem => {
            if (this.retriveElemID(elem) === 'upperDiv' ||
                this.retriveElemID(elem) === 'lowerDiv') {
                elem.classList.add('altezzaSec')
            } else {
                elem.classList.add('altezzaMain')
            }
        })
    }

    public retriveElemID(elem: HTMLElement) {
        return elem.id;
    }

    public addCanvasToHtml() {
        this.canvas = document.createElement('canvas')
        this.gameFrame.appendChild(this.canvas)
        this.canvas.height = 400;
        this.canvas.width = this.gameFrame.offsetWidth; // imposta la larghezza massima
        this.canvas.classList.add("border", "border-2")
        // Per aggiornare la larghezza se la finestra cambia:
        window.addEventListener('resize', () => {
            this.canvas.width = this.gameFrame.offsetWidth - 100;
        });
    }

    public canvasSetup() {

        // imposto il setup della canvas per un gioco 2d
        this.canvasContext = this.canvas.getContext('2d')

    }

    public inizializeMainPlayer() {
        this.mainPlayer = {
            x: 50,
            y: this.groundLevel,
            width: 50,
            height: 80,
            velocityY: 0,
            isJumping: false,
            isCrouching: false,
            isStandUp: true
        }
    }

    // metodo utilizzato per creare un elemento dentro la canvas
    public drawElement(color: string, coord: IcoordinatesElem) {
        this.canvasContext.fillStyle = color
        this.canvasContext.fillRect(coord.x, coord.y, coord.width, coord.height)
    }

    public handlePlayerActions() {
        document.addEventListener("keydown", (e) => {
            console.log(e.code)
            if (e.code === 'Space' &&
                !this.mainPlayer.isJumping &&
                !this.isGameOver) {
                this.jump();
            }

            if (e.code === 'ArrowDown' && !this.isGameOver) {
                this.crouch()
            }

            if (e.code === 'ArrowUp' && !this.isGameOver) {
                this.standUp()
            }

        })
    }


    public jump() {
        this.mainPlayer.isJumping = true;
        this.mainPlayer.velocityY = this.jumpForce
    }

    public standUp() {
        this.mainPlayer.isCrouching = false;
        this.mainPlayer.isStandUp = true;
        // risetto il player ai valori iniziali

        this.mainPlayer.height = 80
        this.mainPlayer.y = this.groundLevel
        this.mainPlayer.width = 50
    }


    public crouch() {
        if (this.mainPlayer.isJumping && this.mainPlayer.isCrouching) {
            return;
        }

        this.mainPlayer.isCrouching = true;
        this.mainPlayer.isStandUp = false;
    }


    public startGameLoop() {

        const loop = () => {

            this.timer++

            if (this.isGameOver) {
                console.log("GAME OVER IS TRUE!!!!")
                return;
            }

            if (this.timer % 150 === 0 || this.timer % 373 === 0) {
                this.generateObstacle()
            }

            // Pulisce tutto il canvas
            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Applica la gravità se il player sta saltando
            if (this.mainPlayer.isJumping) {
                this.mainPlayer.velocityY += this.gravity;
                this.mainPlayer.y += this.mainPlayer.velocityY;

                // Quando il giocatore tocca terra, resetta il salto
                if (this.mainPlayer.y >= this.groundLevel) {
                    this.mainPlayer.y = this.groundLevel;
                    this.mainPlayer.velocityY = 0;
                    this.mainPlayer.isJumping = false;
                }
            }

            // modifica la struttura del player se questo è in modalità abbassato

            if (this.mainPlayer.isCrouching && !this.mainPlayer.isStandUp) {
                this.mainPlayer.height = this.mainPlayer.height / 2
                this.mainPlayer.y = this.groundLevel + 40
                this.mainPlayer.width *= 2
                this.mainPlayer.isCrouching = false;
                this.mainPlayer.isStandUp = true;
            }


            // ridisegna il giocatore
            this.drawElement(this.mainPlayerColor, {
                height: this.mainPlayer.height,
                width: this.mainPlayer.width,
                y: this.mainPlayer.y,
                x: this.mainPlayer.x
            })


            this.moveObstacle()
            this.disegnaObstacles(this.obstacles)

            if (this.isCollisionsDetected(this.mainPlayer, this.obstacles)) {
                this.isGameOver = true;
            }

            requestAnimationFrame(loop);
        }

        loop()
    }

    public generateObstacle() {

        const obstacle: IObstacle = {
            height: 30 + Math.random() * 10,
            width: 25,
            y: this.groundLevel - Math.random() * 20,
            x: this.canvas.width - Math.random() * 20,
            velocity: 5
        }
        this.obstacles.push(obstacle)
    }

    public moveObstacle() {
        this.obstacles.length > 0 && this.obstacles.filter(obst => {
            obst.x -= obst.velocity;
            return obst.x + obst.width > 0; // tiene solo quelli visibili
        })
    }

    public disegnaObstacles(obstacles: IObstacle[]) {
        obstacles.forEach(obs => {
            this.drawElement(this.obstacleColor, {
                x: obs.x,
                y: obs.y,
                width: obs.width,
                height: obs.height
            })
        })
    }


    public isCollisionsDetected(mainPlayer: IPLayerConfig, obstacle: IObstacle[]) {
        console.log(obstacle);
        return obstacle && obstacle.length > 0 && obstacle.some(obstacle => {
            if (mainPlayer.x < obstacle.x + obstacle.width &&
                mainPlayer.x + mainPlayer.width > obstacle.x &&
                mainPlayer.y < obstacle.y + obstacle.height &&
                mainPlayer.y + mainPlayer.height > obstacle.y)
                //
            {
                return true;
            }
            return false;
        })

    }


}