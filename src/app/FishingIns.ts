namespace app {
    /** 泡泡实例 */
    export class FishingIns extends PIXI.Container {
        /** 泡泡实例状态 0普通待机 1正确 2错误 3鱼回家 -1已销毁 */
        public status: number;

        private resource: fw.TextureResource;
        private fishImg: PIXI.Sprite;
        private wordImg: PIXI.Sprite;
        private dataItem: IWordData;

        private fishId: number;
        // private fishCurve: fw.Point[];
        private posY: number;
        private lifeLength: number = 1440;
        private lifeTime: number;
        /** 摆动周期 */
        private swingCycle: number = 100;
        private clock: fw.TimerClock;

        public static create(par: FishingStage, fishId: number, posY: number): FishingIns {
            let ins = FishingModel.fishingInsDeadPool.shift();
            !ins && (ins = new FishingIns());
            ins.activate(fishId, Math.floor(Math.random() * 3), 10667 + Math.random() * 1000, posY);
            FishingModel.fishingInsActivatePool.push(ins);
            par.addChild(ins);
            return ins;
        }

        public constructor() {
            super();
            this.interactive = true;

            this.resource = fw.ResourceManager.ins.getTextureResource("fishing.json");
            this.fishImg = new PIXI.Sprite();
            this.fishImg.anchor.x = this.fishImg.anchor.y = 0.5;
            this.addChild(this.fishImg);
            this.wordImg = new PIXI.Sprite();
            // this.wordImg.x = -30;
            this.wordImg.anchor.x = this.wordImg.anchor.y = 0.5;
            this.addChild(this.wordImg);
        }

        /** 激活 */
        public activate(fishId: number, pathId: number, lifeTime: number, posY: number): void {
            this.fishId = fishId;
            this.status = 0;
            const fishModelId = Math.floor(this.fishId / 100);

            this.fishImg.texture = this.resource.getTexture(`fishing_fish${fishModelId}.png`);
            // const modifyPosY = FishingModel.fishPaths[pathId].y.concat();
            // const offsetPosY = modifyPosY[0] - posY;
            // for (let i = 0; i < modifyPosY.length; i++) {
            //     modifyPosY[i] = modifyPosY[i] - offsetPosY;
            // }
            // const bspline = new fw.BSpline(FishingModel.fishPaths[pathId].x, modifyPosY);
            // this.fishCurve = bspline.getLinePoints();
            
            this.lifeTime = lifeTime;
            this.swingCycle = this.lifeLength * (0.8 + Math.random() + 0.5);
            this.posY = posY;

            if (FishingModel.mode == 0 || FishingModel.mode == 1) {
                this.addListener("pointerup", this.onTouchFish, this);
            }

            this.clock = fw.TimerManager.addClock(this.fishId, this.lifeTime / 1000, 10);
            this.clock.registCallBack(this, this.willDie, this.update);
        }

        private update(progress: number): void {
            if (this.status != 0)
                return;
            // const pos = this.fishCurve[Math.floor((this.fishCurve.length - 1) * (1 - progress))];
            // this.x = pos.x;
            // this.y = pos.y;

            this.x = (this.lifeLength + 100) * (1 - progress) - 100;
            this.y = this.posY + Math.sin(this.lifeLength * 2 * progress * (2 * Math.PI / this.swingCycle)) * 60;
        }

        private onTouchFish(evt: PIXI.interaction.InteractionEvent): void {
            if (!this.dataItem || this.status != 0)
                return;
            if (this.dataItem.trueOpt) {
                this.playRight();
            }
            else {
                this.playWrong();
            }
            fw.SoundManager.playSound("fishing_touch");
        }

        /** 错误状态 */
        private playWrong(): void {
            if (this.status != 0)
                return;
            this.status = 2;
            fw.GResponser.emit("miss", {obj: this, x: this.x, y: this.y});
        }

        /** 错误状态完成 */
        public playWrongComplete(): void {
            console.log("playWrongComplete");
            this.status = 0;
            fw.SoundManager.playSound("fishing_wrong");
        }

        /** 正确状态 */
        private playRight(): void {
            if (this.status != 0)
                return;
            this.status = 1;
            fw.GResponser.emit("bomb", {obj: this, x: this.x, y: this.y});
            FishingModel.gotFishCount++;
        }

        /** 正确状态完成 */
        public playRightComplete(): void {
            console.log("playRightComplete");
            fw.SoundManager.playSound("fishing_right");
            if (this.dataItem && this.dataItem.audioUrl) {
                const audioFileName = fw.cutFilename(this.dataItem.audioUrl);
                fw.SoundManager.playSound(audioFileName, `../../${this.dataItem.audioUrl}`);
            }
            this.status = 0;
            this.willDie();
        }

        /** 时间到，鱼回家 */
        public fishGoHome(): void {
            if (this.status == -1 || this.status == 1)
                return;
            this.status = 3;
            fw.Tween.get(this).to({x: -100}, (this.x + 100) * 2).call(this.willDie, this);
        }

        private willDie(): void {
            if (this.status == 1 || this.status == -1)
                return;
            this.destroy();
        }

        /** 单词数据 */
        public setData(value: IWordData): void {
            this.dataItem = value;
            fw.ResourceManager.ins.loadByUrl(`../../${value.imageUrl}`, res => {
                this.wordImg.texture = res;
            }, this);
        }

        public destroy(): void {
            if (this.status == -1)
                return;
            this.status = -1;
            this.removeAllListeners();
            if (this.clock) {
                this.clock.removeCallBack(this);
                fw.TimerManager.removeClock(this.fishId);
                this.clock = undefined;
            }
            this.fishImg.texture = null;
            this.wordImg.texture = null;
            fw.DisplayUtil.removeFromParent(this);
            this.dataItem = null;
            const actIndex = FishingModel.fishingInsActivatePool.indexOf(this);
            if (actIndex > -1) {
                FishingModel.fishingInsActivatePool.splice(actIndex, 1);
            }
            FishingModel.fishingInsDeadPool.push(this);
        }
    }
}