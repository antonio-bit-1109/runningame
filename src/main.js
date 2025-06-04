import {buildTerrain} from "./classes/BuildTerrain.ts"

document.addEventListener("DOMContentLoaded", () => {
    const classBuild = new buildTerrain();
    classBuild.mainPipeline()
});