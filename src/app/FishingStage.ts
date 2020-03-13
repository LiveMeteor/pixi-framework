/// <reference path = "components/FishingWaveImage.ts" />
/// <reference path = "FishingHook.ts" /> 
namespace app {
    /** 关卡面板 */
    export class FishingStage extends fw.BasePanel {
        private maskBoard: fw.GQuad;
        private foreground: FishingScrollImage;
        private wave: FishingScrollImage;
        private spindrifts: FishingWaveImage[];
        private fishPool: PIXI.Container;
        private dbRabbit: fw.DragonBones;
        private hook: FishingHook;
        private labelTime: PIXI.Text;
        private imgCurrWord: PIXI.Sprite;

        private fishLastTimes: number;
        private fishCounter: number = 0;
        private stageId: number;
        private stageData?: IStageData;
        private isAwardPhase: boolean = false;

        private testLabel: PIXI.Text;

        public constructor() {
            super(1080, 810);
        }

        public initialize(): void {
            this.resource = fw.ResourceManager.ins.getTextureResource("fishing.json");
            const bgClock = this.resource.createSprite("fishing_clock.png", 110, 40);
            this.addChild(bgClock);
            this.labelTime = this.resource.createLabel("", 146, 86, 32, 0x614A36, "center");
            this.addChild(this.labelTime);
            this.fishPool = new PIXI.Container();
            this.addChild(this.fishPool);
            this.maskBoard = new fw.GQuad(0x0, 0, 0, 1440, 810, 0);
            this.maskBoard.interactive = this.maskBoard.interactiveChildren = false;
            this.addChild(this.maskBoard);

            let bgSumbarine: PIXI.Sprite;
            if (fw.getDeviceType() == fw.DeviceType.iPad) {
                bgSumbarine = fw.ResourceManager.ins.createSprite("bbubbles_submarine_ipad.png", 0, this.designHeight - 218);
                this.addChild(bgSumbarine);
            }
            else {
                bgSumbarine = fw.ResourceManager.ins.createSprite("bbubbles_submarine.png", 0, this.designHeight - 258);
                this.addChild(bgSumbarine);
            }

            this.hook = new FishingHook();
            this.imgCurrWord = new PIXI.Sprite();
            this.imgCurrWord.anchor.x = this.imgCurrWord.anchor.y = 0.5;

            if (FishingModel.mode == RoleType.TEACHER || FishingModel.mode == RoleType.OBSERVER 
                || FishingModel.mode == RoleType.RECORDER || FishingModel.mode == RoleType.PREVIEW) {
                const scoreBars = new FishingScoreBars();
                scoreBars.x = 15;
                scoreBars.y = 537;
                this.addChild(scoreBars);
                FishingModel.scoreBars = scoreBars;
            }

            if (fw.Config.isDebug) {
                this.testLabel = this.resource.createLabel("", 0, 160, 20, 0xff0000, "left");
                this.addChild(this.testLabel);

                const labelDevice = this.resource.createLabel(`DeviceLevel: ${fw.Config.quality} 
StageSize: ${fw.Config.currentDirector.app.screen.width}x${fw.Config.currentDirector.app.screen.height} 
Resolution: ${fw.Config.currentDirector.app.view.width}x${fw.Config.currentDirector.app.view.height}
Version: ${fw.Config.version}`, 0, 210, 20, 0xff0000, "left");
                this.addChild(labelDevice);
            }

            super.initialize();
        }

        public onOpen(): void {
            super.onOpen();
            
            this.wave = new FishingScrollImage(fw.ResourceManager.ins.getTexture("fishing_wave.png"), 25);
            this.wave.y = 341;
            this.addChildAt(this.wave, 0);
            this.foreground = new FishingScrollImage(fw.ResourceManager.ins.getTexture("fishing_foreground.png"), 20);
            this.foreground.y = 241;
            this.addChildAt(this.foreground, 1);
            this.spindrifts = [];
            const spindriftY = [283, 420, 591];
            for (let i = 1; i <= 3; i++) {
                const spindrift = new FishingWaveImage(fw.ResourceManager.ins.getTexture(`fishing_spindrift${i}.png`), 2000 * i);
                spindrift.y = spindriftY[i - 1];
                this.addChildAt(spindrift, 2);
                this.spindrifts.push(spindrift);
            }

            this.dbRabbit = new fw.DragonBones();
            this.dbRabbit.x = 540;
            this.dbRabbit.y = 250;
            this.dbRabbit.load("img/rabbit", "rabbit");
            this.dbRabbit.once("loaded", this.onBonesLoaded, this);
            fw.DisplayUtil.addChildAfter(this.dbRabbit, this.wave);

            PIXI.ticker.shared.add(this.updateTime, this);
            fw.GResponser.addListener("bomb", this.onCatchHandler, this);
            fw.GResponser.addListener("miss", this.onMissHandler, this);
            fw.GResponser.addListener("stageGameNotice", this.onClickMsg, this);

            //TODO 需要加中途进入的情况
            this.stageId = 1;
            this.stageData = FishingModel.generateStageData(this.stageId);
            this.nextStage();
        }

        private onBonesLoaded(armature: dragonBones.PixiArmatureDisplay): void {
            this.dbRabbit.play("idle");
            this.dbRabbit.replaceSlotDisplay("cable_hook", this.hook);
            this.dbRabbit.replaceSlotDisplay("word_pos", this.imgCurrWord);
        }

        private resetHook(): void {
            this.hook.rotation = Math.PI / 2;
            this.hook.hookLength = 160;
        }

        public setData(value: any): void {
            this.mData = value;
        }

        /** 设置当前游戏进行了多少时间(秒) */
        public setCurrTime(time: number): void {
        }

        /** 更新下一关数据 */
        private nextStage(time?: number): void {
            this.clearFishPool();
            this.resetHook();
            if (this.stageId >= 5) {
                fw.Log.log("stage complete");
                this.hide();
                //老师模式和录课模式在游戏完全结束后会向外 post 消息
                if (FishingModel.mode == 2 || FishingModel.mode == 4) {
                    const msgBody: IStageGameSwitch = { type: GameAPI.gameName, status: 2 };
                    fw.GResponser.postMessage("stageGameSwitch", msgBody);
                }
                return;
            }
            this.fishCounter = time ? Math.ceil(time / FishingModel.fishGapTime) : 1;
            this.isAwardPhase = false;
            FishingModel.gotFishCount = 0;
            fw.Log.log(`stage start: ${this.stageId}`);

            fw.ResourceManager.ins.loadByUrl(`../../${this.stageData.imageUrl}`, res => {
                this.imgCurrWord.texture = res;
            }, this);
            const audioFileName = fw.cutFilename(this.stageData.audioUrl);
            fw.SoundManager.playSound(audioFileName, `../../${this.stageData.audioUrl}`);
        }

        /** 清理所有泡泡 */
        private clearFishPool(): void {
            this.fishLastTimes = null;
            const valid = FishingModel.fishingInsActivatePool.concat();
            for (const ins of valid) {
                ins.destroy();
            }
        }

        /** 帧刷新 */
        private updateTime(deltaTime: number): void {
            const passTime = Date.now() - FishingModel.cacheSyncInfo.startTime - FishingModel.introTime;
            const allPhase = FishingModel.getPhases();
            this.testLabel && (this.testLabel.text = `phase=${allPhase} time=${fw.NumberFormatter.formatTime(passTime, true, true)}`);
            if (allPhase <= 0)
                return;
            const subPhase = allPhase % 10;
            const remainingTime = Math.max(Math.ceil(15 - passTime % FishingModel.stageTime / 1000), 0);
            this.labelTime.text = `${remainingTime}`;

            /** 创建新鱼 */
            if (subPhase == 1 && this.fishCounter <= 10) {
                if (!this.fishLastTimes || passTime - this.fishLastTimes > FishingModel.fishGapTime) {
                    this.fishLastTimes = passTime;

                    const modelId = 1 + Math.floor(Math.random() * 6);
                    const newFish = FishingIns.create(this, modelId * 100 + this.fishCounter, 341 + Math.random() * 200);
                    newFish.setData(this.stageData.list[(this.fishCounter - 1) % 10]);
                    this.fishPool.addChild(newFish);
                    this.fishCounter++;
                }
            }

            /** 显示宝箱 */
            const awardPhase = subPhase == 2;
            if (this.isAwardPhase != awardPhase) {
                if (awardPhase) {
                    this.showAwardChest();
                    this.maskBoard.alpha = 0.6;
                    const valid = FishingModel.fishingInsActivatePool.concat();
                    for (const ins of valid) {
                        ins.fishGoHome();
                    }
                }
                else {
                    (<any>window).hideEffectTrophy();
                    this.maskBoard.alpha = 0;
                    const runningTime = Date.now() - FishingModel.cacheSyncInfo.startTime - FishingModel.introTime;
                    this.stageId = Math.round(runningTime / FishingModel.stageTime) + 1;
                    this.stageData = FishingModel.generateStageData(this.stageId);
                    this.nextStage();
                }
                this.isAwardPhase = awardPhase;
            }
        }

        /** 显示奖励宝箱 */
        private showAwardChest(): void {
            let soundName = "fishing_good_job";
            let ribbonName = "nicetry"; 
            if (FishingModel.mode == 0 || FishingModel.mode == 1) {
                if (FishingModel.gotFishCount >= 6) {
                    soundName = "fishing_excellent";
                    ribbonName = "excellent";
                }
                else if (FishingModel.gotFishCount >= 1) {
                    soundName = "fishing_good_job";
                    ribbonName = "goodjob";
                }
                else {
                    soundName = "fishing_nice_try";
                    ribbonName = "nicetry";
                }
            }
            fw.SoundManager.playSound("fishing_succeed");
            setTimeout(() => {
                fw.SoundManager.playSound(soundName);
                fw.SoundManager.playSound("fishing_gold_sound");
            }, 1500);
            
            // const names: string[] = [];
            // FishingModel.studentsInfo.forEach(info => {
            //     names.push(info.name + "+1");
            // });
            // (<any>window).showEffectChest(names, this.designWidth / 2, this.designHeight / 2);
            if (FishingModel.mode != RoleType.STUDENT && FishingModel.mode != RoleType.REVIEW)
                ribbonName = "";
            (<any>window).showEffectTrophy(ribbonName, this.designWidth / 2, this.designHeight, ["fish6"]);
        }

        /** 抓到鱼 */
        private onCatchHandler(params: {obj: FishingIns, x: number, y: number}): void {
            const hookPos = this.hook.getGlobalPosition();
            hookPos.x *= (fw.SceneManager.current() as FishingScene).designWidth / fw.Config.stageWidth;
            hookPos.y *= (fw.SceneManager.current() as FishingScene).designHeight / fw.Config.stageHeight;
            const angel = Math.atan((params.y - hookPos.y) / (params.x - hookPos.x));
            const rotate = angel >= 0 ? angel + Math.PI / 2 : angel - Math.PI / 2;
            this.hook.rotation = rotate - Math.PI / 2;

            const maxLength = Math.sqrt(Math.pow(hookPos.x - params.x, 2) + Math.pow(hookPos.y - params.y, 2));
            this.hook.hookLength = maxLength / 2;
            fw.Tween.get(this.hook)
                .to({ hookLength: maxLength }, 200)
                .call(() => {
                    this.hook.hangingFish(params.obj);
                }, this)
                .to({ hookLength: 0 }, 1000)
                .call(() => {
                    this.hook.hangingFish(null);
                    params.obj.playRightComplete();
                }, this)
                .to({ hookLength: 160, rotation: Math.PI / 2 }, 100)
                .call(this.resetHook, this);
        }

        /** 抓错鱼 */
        private onMissHandler(params: {obj: FishingIns, x: number, y: number}): void {
            const hookPos = this.hook.getGlobalPosition();
            hookPos.x *= (fw.SceneManager.current() as FishingScene).designWidth / fw.Config.stageWidth;
            hookPos.y *= (fw.SceneManager.current() as FishingScene).designHeight / fw.Config.stageHeight;
            const angel = Math.atan((params.y - hookPos.y) / (params.x - hookPos.x));
            const rotate = angel >= 0 ? angel + Math.PI / 2 : angel - Math.PI / 2;
            this.hook.rotation = rotate - Math.PI / 2;

            const maxLength = Math.sqrt(Math.pow(hookPos.x - params.x, 2) + Math.pow(hookPos.y - params.y, 2));
            this.hook.hookLength = maxLength - 30;
            fw.Tween.get(this.hook)
                .call(() => {
                    this.hook.hangingFish(params.obj);
                }, this)
                .to({ hookLength: maxLength + 30 }, 100)
                .to({ hookLength: maxLength - 30 }, 100)
                .to({ hookLength: maxLength + 30 }, 100)
                .to({ hookLength: maxLength }, 100)
                .call(() => {
                    this.hook.hangingFish(null);
                    params.obj.playWrongComplete();
                }, this)
                .to({ hookLength: 160, rotation: Math.PI / 2 }, 100)
                .call(this.resetHook, this);
        }

        /** 没有 */
        private onClickMsg(data: IStageGameNotice): void {
            if (data.type != GameAPI.gameName)
                return;
            let checkIndex = -1;
            const studentsInfo = FishingModel.studentsInfo;
            for (let i = 0; i < studentsInfo.length; i++) {
                if (studentsInfo[i].uid == data.userId) {
                    checkIndex = i;
                    break;
                }
            }
            if (checkIndex != -1) {
                let score = FishingModel.cacheSyncInfo[data.userId] || 0;
                const pos = 1 << (data.step - 1);
                score = score | pos;
                FishingModel.cacheSyncInfo[data.userId] = score;
                FishingModel.scoreBars && FishingModel.scoreBars.updateScores();
            }
        }

        protected onClose(): void {
            PIXI.ticker.shared.remove(this.updateTime, this);
            fw.GResponser.removeListener("bomb", this.onCatchHandler, this);
            fw.GResponser.removeListener("miss", this.onMissHandler, this);
            fw.GResponser.removeListener("stageGameNotice", this.onClickMsg, this);
            this.wave && this.wave.destroy();
            this.foreground && this.foreground.destroy();
            for (const ele of this.spindrifts) {
                ele.destroy();
            }
            this.spindrifts = [];
            this.dbRabbit.destroy();

            FishingModel.startRunningTime = 0;
            !FishingModel.quiet && this.mData && this.mData.func && this.mData.func.call(this.mData.this);
            super.onClose();
        }
    }
}