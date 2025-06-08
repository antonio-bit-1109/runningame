import {IcoordinatesElem} from "../interf/Player";

export class BuildHtml {

    public upperDiv: HTMLElement = document.getElementById('upperDiv');
    public gameFrame: HTMLElement = document.getElementById('gameFrame')
    public lowerDiv: HTMLElement = document.getElementById('lowerDiv');
    private canvas: HTMLCanvasElement = null;
    private canvasContext = null;

    public buildFondamentalHtml(){
        const arrElem = [this.upperDiv , this.gameFrame , this.lowerDiv];
        this.giveWidth(arrElem);
        this.giveHeight(arrElem);
        this.addCanvasToHtml();
        this.canvasSetContext()
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
        this.canvas.id = 'canvas-id';
        this.gameFrame.appendChild(this.canvas)
        this.canvas.height = 400;
        this.canvas.width = this.gameFrame.offsetWidth; // imposta la larghezza massima
        this.canvas.classList.add("border", "border-2")
        // Per aggiornare la larghezza se la finestra cambia:
        window.addEventListener('resize', () => {
            this.canvas.width = this.gameFrame.offsetWidth - 100;
        });
    }

    public canvasSetContext() {
        // imposto il setup della canvas per un gioco 2d
        this.canvasContext = this.canvas.getContext('2d')
    }



}