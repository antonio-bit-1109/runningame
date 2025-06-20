import {BuildHtml} from "./classes/BuildHtml.js";
import {GameObjects} from "./classes/GameObjects.js";
import {costanti} from "./constants/costanti";
import {HandleGameLoop} from "./classes/HandleGameLoop";
import {drawElement} from "./constants/GameFunctions";

document.addEventListener("DOMContentLoaded", () => {

    const BuildHtmlClass = classFactory<BuildHtml>(BuildHtml);
    BuildHtmlClass.buildFondamentalHtml();

    const canvas = document.getElementById('canvas-id');
    const gameObjectsClass = classFactory<GameObjects>(GameObjects, canvas);
    gameObjectsClass.gameObjectPipeLine();

    const handleGameLoopClass = classFactory<HandleGameLoop>(HandleGameLoop)

    // disegno sulla canvas il personaggio principale,
    // prima dell inizio del loop;
    drawElement(costanti.mainPlayerColor, costanti.mainPlayer)
    handleGameLoopClass.startGameLoop()

});

// funzione factory che instanzia la classe passata come parametro,
// il primo argomento corrisponde alla classe da instaziare ( di cui fare il new ,
// il secondo parametro è l'eventuale dipendenza di cui la classe ha bisogno per essere correttamente
// istanziata.
function classFactory<T>(ClassConstructor: new (...args: any[]) => T, ...args: any[]): T {
    return new ClassConstructor(...args);
}

