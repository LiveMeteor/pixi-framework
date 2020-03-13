requirejs.config({
    baseUrl: "./",
    waitSeconds: 20,
    paths: {
        PIXI: ["../lib/pixi"],
        PIXIParticles: ["../lib/pixi-particles"],
        PIXISound: ["../lib/pixi-sound"],
        dragonBones: ["../lib/dragonBones"],
        fishing: ["js/fishing.all"],
        effectTrophy: ["../../effectTrophy/release/js/effectTrophy.min"]
    }
});

var testData = {
    "randomId":44,
    "list":[
        {
            "id":1,
            "rightUrl":"img_342/3_4_2_1577255044939_3530773350171648_8fd11c5435e825ffd55dc3fc02f2d511.png",
            "beforeImageUrl":"img_342/3_4_2_1577255033763_3530773167064064_8fd11c5435e825ffd55dc3fc02f2d511.png",
            "audioUrl":"img_342/3_4_2_1577255179417_3530775553459200_87a443ceafaca515837c036a761d606a.mp3",
            "errorsUrl":[
                "img_342/3_4_2_1577255049100_3530773418345472_d23ca99c313c600810c737a789718266.png"
            ]
        },
        {
            "id":2,
            "rightUrl":"img_342/3_4_2_1577255058010_3530773564326912_7fdf25b9a5e25cf046a5fe2e8b9ce40c.png",
            "beforeImageUrl":"img_342/3_4_2_1577255055328_3530773520385024_7fdf25b9a5e25cf046a5fe2e8b9ce40c.png",
            "audioUrl":"img_342/3_4_2_1577255191185_3530775746266112_976977d4c8beb0023020292d02cec64a.mp3",
            "errorsUrl":[
                "img_342/3_4_2_1577255061672_3530773624325120_e63940d51a9ef15e41054a1d25ae3145.png"
            ]
        },
        {
            "id":3,
            "rightUrl":"img_342/3_4_2_1577255103999_3530774317810688_f15938a02312f0c558c40a9f94036ca9.png",
            "beforeImageUrl":"img_342/3_4_2_1577255100277_3530774256829440_f15938a02312f0c558c40a9f94036ca9.png",
            "audioUrl":"img_342/3_4_2_1577255202684_3530775934665728_zebra.mp3",
            "errorsUrl":[
                "img_342/3_4_2_1577255111919_3530774447571968_662d62cc657cfa243a96248565986146.png"
            ]
        },
        {
            "id":4,
            "rightUrl":"img_342/3_4_2_1577255127774_3530774707340288_27da9f00635817375c5995cfe469012c.png",
            "beforeImageUrl":"img_342/3_4_2_1577255121616_3530774606447616_27da9f00635817375c5995cfe469012c.png",
            "audioUrl":"img_342/3_4_2_1577255234252_3530776451875840_d2f6a225c7238871dacc517c76c72d14.mp3",
            "errorsUrl":[
                "img_342/3_4_2_1577255131828_3530774773761024_c3ef38eda845d7192885e3a6a7c9fc0b.png",
                "img_342/3_4_2_1577255149217_3530775058662400_0daa316bc2b8f50c0bd84a930ab74a85.png"
            ]
        }
    ],
    "gameId":150,
    "gameName":"钓鱼互动ver1",
    "gameMode":7
};

function loadFramework(onComplete) {
    require(["PIXI"], function(pixi) {
        require(["PIXIParticles"], function(pixiparticles) {
            require(["dragonBones"], function(dragonBones) {
                require(["PIXISound"], function(pixisound) {
                    onComplete();
                });
            });
        });
    });
}

function getInteractiveLevel() {
    window.addEventListener("message", loadGame, false);
    console.log("[SEND] type: interactiveLevel: {}");
    window.parent.postMessage({ type: "interactiveLevel", data: { level: 2, forceSoundEngine: 0} }, "*");
}

function loadGame(msg) {
    window.removeEventListener("message", loadGame, false);
    var data = (typeof msg.data.data != "object" ? { level: 2, forceSoundEngine: 0} : msg.data.data);
    require(["fishing"], function() {
        app.GameAPI.init(1440, 810, "game_container", data);
        app.GameAPI.setData(testData);
        app.GameAPI.setDebug(true);
        // app.GameAPI.setCurrTime(53);
    });
}

/** 显示奖杯组件 */
function showEffectTrophy(ribbonName, fromX, fromY, textures) {
    require(["effectTrophy"], function () {
        effectTrophy.GameAPI.init(1080, 810, null, fw.Config.quality, {
            resRoot: "../../effectTrophy/release/img/",
            quality: 2,
            ribbonName: ribbonName,
            textures: textures,
            fromX: fromX,
            fromY: fromY,
            videoPosTemplates: [
                { x: 148, y: 528, w: 1, h: 1 },
                { x: 428, y: 528, w: 1, h: 1 },
                { x: 708, y: 528, w: 1, h: 1 },
                { x: 988, y: 528, w: 1, h: 1 }
            ] //正式数据这个 templates 来自 fe 工程
        });
        fw.SceneManager.current().getLayer(fw.DefaultLayers.PANEL_LAYER).addChild(effectTrophy.GameAPI.effect);
    });
}

function hideEffectTrophy() {
    window.effectTrophy && window.effectTrophy.GameAPI.effect && window.effectTrophy.GameAPI.effect.hide();
}

loadFramework(getInteractiveLevel);
