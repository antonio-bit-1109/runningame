import {costanti} from "../constants/costanti";


export class BuildHtml {


    public buildFondamentalHtml() {

        costanti.upperDiv = document.getElementById('upperDiv');
        costanti.gameFrame = document.getElementById('gameFrame');
        costanti.lowerDiv = document.getElementById('lowerDiv');

        const arrElem = [costanti.upperDiv, costanti.gameFrame, costanti.lowerDiv];
        this.giveWidth(arrElem);
        this.giveHeight(arrElem);
        this.addCanvasToHtml();
        this.canvasSetContext();
        this.incrementPunteggio();
        this.showPunteggio();
        this.showInitialLevel()
        this.showOstacoliAbbattuti_InitialVAlue();
        this.buildPlayerLifesHtml()
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
        costanti.canvas = document.createElement('canvas')
        costanti.canvas.id = 'canvas-id';
        costanti.gameFrame.appendChild(costanti.canvas)
        costanti.canvas.height = costanti.canvasHeight;
        costanti.canvas.width = costanti.gameFrame.offsetWidth - 200; // imposta la larghezza massima
        costanti.canvas.classList.add("border", "border-2")
        // Per aggiornare la larghezza se la finestra cambia:
        window.addEventListener('resize', () => {
            costanti.canvas.width = costanti.gameFrame.offsetWidth - 100;
        });
    }

    public canvasSetContext() {
        // imposto il setup della canvas per un gioco 2d
        costanti.canvasContext = costanti.canvas.getContext('2d')
    }


    public incrementPunteggio() {
        costanti.intervalPunteggio = setInterval(() => {
            costanti.punteggio += 10;
            document.getElementById('divPunti').innerHTML = ` punteggio: ${costanti.punteggio}`;
        }, 1000)
    }

    public showPunteggio() {
        const divPunti = document.createElement('div');
        divPunti.id = 'divPunti'
        costanti.upperDiv.appendChild(divPunti);
        divPunti.innerHTML = ` punteggio: ${costanti.punteggio}`;

    }


    public showInitialLevel() {
        costanti.upperDiv.classList.add("d-flex", "flex-column")
        const divLivello = document.createElement('div');
        divLivello.id = 'divLivello';
        costanti.upperDiv.appendChild(divLivello);
        divLivello.innerHTML = `Livello: ${costanti.gameLevel}`
    }

    public showOstacoliAbbattuti_InitialVAlue() {
        const divOstacoliAbbattuti = document.createElement('div');
        divOstacoliAbbattuti.id = 'divOstacoliAbbattuti';
        costanti.upperDiv.appendChild(divOstacoliAbbattuti);
        divOstacoliAbbattuti.innerHTML = `ostacoli distrutti: ${costanti.ostacoliAbbattuti}`
    }

    public buildPlayerLifesHtml() {
        const outerWrapper = document.createElement("div");
        outerWrapper.classList.add("d-flex", "justify-content-start", "w-100", "m-custom-l");

        const wrapperHearts = document.createElement("div");
        wrapperHearts.classList.add("d-flex")
        for (let i = 0; i < 3; i++) {
            const fillHeart = document.createElement("img");
            fillHeart.classList.add(`hearth`)
            fillHeart.src = "src/assets/materials/heartFill.png"
            fillHeart.style.width = '40px'
            wrapperHearts.appendChild(fillHeart)
        }
        outerWrapper.appendChild(wrapperHearts)
        costanti.upperDiv.appendChild(outerWrapper);
    }
}