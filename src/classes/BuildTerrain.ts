import {IcoordinatesElem, IPLayerConfig} from "../interf/Player";

export class buildTerrain {

    private upperDiv: HTMLElement = null;
    private gameFrame: HTMLElement = null;
    private lowerDiv: HTMLElement = null;
    private canvas: HTMLCanvasElement = null;
    private canvasContext = null;
    private isGameOver: boolean = null;
    //costanti gioco
    private gravity: number | null = null;
    private jumpForce = null;
    private groundLevel = null;
    // Ostacoli
    private obstacles = null;
    private obstacleTimer = null;
    private obstacleInterval = null; // ogni quanti frame spawna un ostacolo
    private mainPlayer: IPLayerConfig = null;

    private mainPlayerColor = 'blue';
    private obstacleColor = 'red';


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
        this.handlePlayerJump()
        this.startGameLoop()
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
        this.gravity = 0.6;
        this.jumpForce = -12;
        this.groundLevel = 300;
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.obstacleInterval = 100;
        this.isGameOver = false;
    }

    public inizializeMainPlayer() {
        this.mainPlayer = {
            x: 50,
            y: this.groundLevel,
            width: 50,
            height: 80,
            velocityY: 0,
            isJumping: false,
        }
    }

    // metodo utilizzato per creare un elemento dentro la canvas
    public drawElement(color: string, coord: IcoordinatesElem) {
        this.canvasContext.fillStyle = color
        this.canvasContext.fillRect(coord.x, coord.y, coord.width, coord.height)
    }

    public handlePlayerJump() {
        document.addEventListener("keydown", (e) => {
            if (e.code === 'Space' &&
                !this.mainPlayer.isJumping &&
                !this.isGameOver) {
                this.jump();
            }
        })
    }

    public jump() {
        this.mainPlayer.isJumping = true;
        this.mainPlayer.velocityY = this.jumpForce
    }

    public startGameLoop() {

        const loop = () => {
            if (this.isGameOver) {
                return;
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

            // ridisegna il giocatore
            this.drawElement(this.mainPlayerColor, {
                height: this.mainPlayer.height,
                width: this.mainPlayer.width,
                y: this.mainPlayer.y,
                x: this.mainPlayer.x
            })

            requestAnimationFrame(loop);
        }

        loop()
    }

    public generateObstacle() {
        this.drawElement()
    }
}