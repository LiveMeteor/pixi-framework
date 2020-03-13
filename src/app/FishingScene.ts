namespace app {
    /** 主场景，由于单一场景游戏，所以此处负责不同阶段的转换 */
    export class FishingScene extends fw.BaseScene {

        private background: PIXI.Sprite;
        private elements: PIXI.Sprite[];
        // private particles: fw.ParticleLayer;
        // private particleConfig: PIXI.particles.EmitterConfig;
        private currTime?: number;

        public constructor() {
            super(1440, 810);
            // this.particleConfig = {
            //     alpha: {"start": 0.5, "end": 0.22},
            //     scale: {"start": 0.25, "end": 0.5, "minimumScaleMultiplier":0.5},
            //     color: {"start": "ffffff", "end": "ffffff"},
            //     speed: {"start": 100, "end": 100},
            //     startRotation: {"min": 260, "max": 280},
            //     rotationSpeed: {"min": 0, "max": 50},
            //     lifetime: {"min": 6, "max": 10},
            //     blendMode: "normal",
            //     frequency: 0.100,
            //     emitterLifetime: 0,
            //     maxParticles: 50,
            //     pos: {"x": 0, "y": 0},
            //     addAtBack: false,
            //     spawnType: "rect",
            //     spawnRect: {
            //         "x": -this.designWidth / 2,
            //         "y": this.designHeight / 2,
            //         "w": this.designWidth,
            //         "h": 0
            //     }
            // }
        }

        public initialize(): void {
            fw.ResizeManager.initialize(1080, 810);
            this.initLayers();

            this.resource = fw.ResourceManager.ins.getTextureResource("fishing.json") as fw.TextureResource;
            this.background = fw.ResourceManager.ins.createSprite("fishing_bg.png");
            const bgLayer = this.getLayer(fw.DefaultLayers.BACKGROUND_LAYER);
            bgLayer.addChild(this.background);

            this.elements = [];
            let createElements = (name: string, x: number, y: number, w: number, h: number, globalRes: boolean = false): PIXI.Sprite => {
                const ele = globalRes
                    ? fw.ResourceManager.ins.createSprite(name, x, y)
                    : this.resource.createSprite(name, x, y);
                ele.width = w;
                ele.height = h;
                bgLayer.addChild(ele);
                this.elements.push(ele);
                return ele;
            }
            let grass = createElements("fishing_grass5.png", 102, 659, 151, 254);
            grass.anchor.x = 0.5;
            grass.anchor.y = 1;
            FishingModel.addSwing(grass, 5000);
            createElements("fishing_grass6.png", 203, 421, 129, 274);
            createElements("fishing_grass3.png", 379, 652, 138, 137);
            createElements("fishing_grass7.png", 873, 659, 64, 144);
            createElements("fishing_grass8.png", 1144, 449, 179, 361);
            createElements("fishing_grass4.png", 9, 527, 406, 230);
            grass = createElements("fishing_grass2.png", 1130, 810, 109, 193);
            grass.anchor.x = 0.25;
            grass.anchor.y = 1;
            FishingModel.addSwing(grass, 4000);
            createElements("fishing_grass1.png", 1206, 652, 192, 158);
            createElements("fishing_bg_bottom.png", 0, 659, 1096, 151);
        }

        public onOpen(): void {
            super.onOpen();

            // this.particles = new fw.ParticleLayer(this.designWidth, this.designHeight,
            //     this.resource.getTexture("bbubbles_bubbles_small.png"), this.particleConfig, false);
            // this.particles.interactive = false;
            // this.getLayer(fw.DefaultLayers.BACKGROUND_LAYER).addChild(this.particles);

            fw.SoundManager.playSound("fishing_bg_music","",true,true);
            this.updateStage(this.currTime);
            fw.GResponser.postMessage("sceneenabled", { status: 1 });
            if (FishingModel.mode != 1) {
                fw.GResponser.postMessage("hideGuideLoad", { status: 1 });
            }
        }

        /** 设备当前进行的时间 */
        public setCurrTime(time: number): void {
            if (this.isOpen) {
                this.updateStage(time);
            }
            else {
                this.currTime = time;
            }
        }

        /** 更新关卡 */
        public updateStage(currTime?: number): void {
            //当前进行中
            if (currTime) {
                if (FishingModel.mode != 2) {
                    fw.GResponser.postMessage("hideGuideLoad", { status: 1 });
                }
                FishingModel.quiet = true;
                fw.PanelManager.hideAllPanel();
                FishingModel.quiet = false;
                const panel = fw.PanelManager.showPanel(FishingStage, { func: this.onOpenEnding, this: this }, fw.ResizeAlign.SCALE_CLIP,
                    this.getLayer(fw.DefaultLayers.INTERACTIVE_LAYER), []);
                panel.setCurrTime(currTime);

                this.currTime = null;
                return;
            }

            //当前未进行
            if (FishingModel.mode == 0 || FishingModel.mode == 2 || FishingModel.mode == 3 || FishingModel.mode == 4) {
                fw.PanelManager.showPanel(FishingEntrance, { func: this.onOpenIntro, this: this }, fw.ResizeAlign.CENTER,
                    this.getLayer(fw.DefaultLayers.PANEL_LAYER), [], true);
            }
            else {
                FishingModel.cacheSyncInfo && FishingModel.cacheSyncInfo.status == 1 && this.onOpenIntro();
            }
        }

        /* 正式开始游戏，学生端入这里开始入场 */
        public onOpenIntro(): void {
            // fw.PanelManager.showPanel(FishingIntro, {func: this.onOpenStage, this: this}, fw.ResizeAlign.SCALE_CLIP,
            //     this.getLayer(fw.DefaultLayers.UI_LAYER), ["img/yellow_submarine.json"], true);
            this.onOpenStage();
        }

        private onOpenStage(): void {
            fw.PanelManager.showPanel(FishingStage, { func: this.onOpenEnding, this: this }, fw.ResizeAlign.SCALE_CLIP,
                this.getLayer(fw.DefaultLayers.INTERACTIVE_LAYER), []);
        }

        /** 结束界面 */
        public onOpenEnding(): void {
            const self = this;
            if (FishingModel.mode != 1) {
                fw.PanelManager.showPanel(FishingEnding, {}, fw.ResizeAlign.CENTER,
                    self.getLayer(fw.DefaultLayers.PANEL_LAYER), [], true);
            }
        }

        public setData(value: any): void {
            this.mData = value;
        }

        public onClose(): void {
            fw.GResponser.postMessage("sceneenabled", { status: 0 });
            fw.SoundManager.stopSound("fishing_bg_music");
            fw.PanelManager.hideAllPanel();
            super.onClose();
        }

        public destroy(): void {
            if (FishingModel.scoreBars) {
                FishingModel.scoreBars.destroy();
                FishingModel.scoreBars = undefined;
            }
            // this.particles && this.particles.destroy();
            for (const grass of this.elements) {
                FishingModel.clearSwing(grass);
                fw.DisplayUtil.removeFromParent(grass);
                grass.destroy();
            }
            fw.DisplayUtil.removeFromParent(this.background);
            this.background && this.background.destroy();
            for (const ins of FishingModel.fishingInsActivatePool) {
                ins.destroy();
            }
            FishingModel.fishingInsActivatePool = [];
            FishingModel.fishingInsDeadPool = [];

            fw.ResourceManager.ins.destroyResource("fishing.json");
            fw.ResourceManager.ins.destroyResource("bbubbles_submarine.png");
            fw.ResourceManager.ins.destroyResource("bbubbles_submarine_ipad.png");
            fw.ResourceManager.ins.destroyResource("fishing_bg.png");
            fw.ResourceManager.ins.destroyResource("fishing_foreground.png");
            fw.ResourceManager.ins.destroyResource("fishing_wave.png");
            fw.ResourceManager.ins.destroyResource("fishing_spindrift1.png");
            fw.ResourceManager.ins.destroyResource("fishing_spindrift2.png");
            fw.ResourceManager.ins.destroyResource("fishing_spindrift3.png");
            super.destroy();
        }
    }
}
