requirejs.config({
    baseUrl: "./",
    waitSeconds: 20,
    paths: {
        PIXI: ["../lib/pixi"],
        PIXIParticles: ["../lib/pixi-particles"],
        PIXISound: ["../lib/pixi-sound"],
        dragonBones: ["../lib/dragonBones"],
        fishing: ["js/fishing.min"],
        fw: ["../lib/fw.min"],
        effectTrophy: ["../components/js/effectTrophy.min"]
    }
});

function loadFramework(onComplete) {
    require(["PIXI"], function(pixi) {
        require(["PIXIParticles"], function(pixiparticles) {
            require(["dragonBones"], function(dragonBones) {
                require(["PIXISound"], function(pixisound) {
                    require(["fw"], function(fw) {
                        onComplete();
                    });
                });
            });
        });
    });
}

function getInteractiveLevel() {
    window.addEventListener("message", loadGame, false);
    window.parent.postMessage({ type: "interactiveLevel", data: {} }, "*");
}

function loadGame(msg) {
    window.removeEventListener("message", loadGame, false);
    var data = (typeof msg.data.data != "object" ? { level: 2, forceSoundEngine: 0} : msg.data.data);
    require(["fishing"], function() {
        app.GameAPI.init(1440, 810, "game_container", data);
        app.GameAPI.setDebug(true);
    });
}

/** 显示奖杯组件 */
function showEffectTrophy(ribbonName, fromX, fromY, textures) {
    require(["effectTrophy"], function () {
        effectTrophy.GameAPI.init(1080, 810, null, fw.Config.quality, {
            resRoot: "../components/img/",
            quality: 2,
            ribbonName: ribbonName,
            textures: textures,
            fromX: fromX,
            fromY: fromY
        });
        fw.SceneManager.current().getLayer(fw.DefaultLayers.PANEL_LAYER).addChild(effectTrophy.GameAPI.effect);
    });
}

function hideEffectTrophy() {
    window.effectTrophy && window.effectTrophy.GameAPI.effect && window.effectTrophy.GameAPI.effect.hide();
}

loadFramework(getInteractiveLevel);